import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const SIZE = 480
const C = SIZE / 2
const COFFEE_R = 148
const SPOON_MAX_R = COFFEE_R - 26

const HEAT_START = 0.3
const HEAT_GAIN = 0.045 // por radiano mexido
const HEAT_LOSS = 0.035 // por segundo
const SPIN_FRICTION = 1.6
const PERFECT_ON = 0.97
const PERFECT_OFF = 0.9

// bolhinhas da crema que aparecem na borda do café conforme ele esquenta (determinístico, sem Math.random)
const FOAM = Array.from({ length: 34 }, (_, i) => {
  const angle = i * 2.399963 // ângulo áureo: espalha sem padrão óbvio
  const radius = COFFEE_R - 6 - ((i * 7) % 5) * 3.2
  return {
    x: C + Math.cos(angle) * radius,
    y: C + Math.sin(angle) * radius,
    r: 2.5 + ((i * 5) % 6) * 0.9,
    at: (i % 10) / 10, // a partir de quanto de calor a bolha aparece
  }
})

const SPARKLES = [
  { left: '30%', top: '30%', delay: '0s', size: 16 },
  { left: '68%', top: '24%', delay: '0.25s', size: 22 },
  { left: '78%', top: '56%', delay: '0.5s', size: 14 },
  { left: '22%', top: '62%', delay: '0.15s', size: 20 },
  { left: '50%', top: '16%', delay: '0.4s', size: 12 },
  { left: '46%', top: '80%', delay: '0.6s', size: 18 },
]

function heatStatus(heat) {
  if (heat >= 0.97) return 'No ponto! O Bruno agradece!'
  if (heat >= 0.66) return 'Quase no ponto, continua mexendo...'
  if (heat >= 0.33) return 'Chegando lá. Mexe mais um pouco!'
  return 'Pega a colher e mexe pra deixar no ponto!'
}

/**
 * Caneca vista de cima, bem perto da tela: a colher segue o ponteiro (arrastando dentro do café)
 * e o giro esquenta o café. O redemoinho e o vapor são aplicados direto no DOM, via variáveis CSS.
 * Fases: start -> in -> out -> (onClosed)
 */
export default function MugViewer({ originRect, onClosed }) {
  const [phase, setPhase] = useState('start')
  const [fit, setFit] = useState(1)
  const [status, setStatus] = useState(() => heatStatus(HEAT_START))
  const rootRef = useRef(null)
  const cupRef = useRef(null)
  const spoonRef = useRef(null)
  const sim = useRef({ heat: HEAT_START, spin: 0, omega: 0, angle: -0.6, dragging: false, last: null })

  useEffect(() => {
    const update = () => setFit(Math.min(1, (window.innerWidth - 32) / SIZE, (window.innerHeight - 190) / SIZE))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.modal = 'mug'
    return () => {
      delete document.documentElement.dataset.modal
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (phase !== 'out') return undefined
    const timer = setTimeout(onClosed, 700)
    return () => clearTimeout(timer)
  }, [phase, onClosed])

  const close = useCallback(() => setPhase('out'), [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const placeSpoon = useCallback((x, y) => {
    const spoon = spoonRef.current
    if (!spoon) return
    const dx = x - C
    const dy = y - C
    if (Math.hypot(dx, dy) > 8) sim.current.angle = Math.atan2(dy, dx)
    spoon.style.transform = `translate(${x}px, ${y}px) rotate(${sim.current.angle}rad)`
  }, [])

  useEffect(() => {
    const a = sim.current.angle
    placeSpoon(C + Math.cos(a) * 70, C + Math.sin(a) * 70)
  }, [placeSpoon])

  // laço da simulação: inércia do redemoinho, calor e vapor
  useEffect(() => {
    let frame = 0
    let prev = performance.now()
    let shownStatus = heatStatus(HEAT_START)
    let perfect = false
    const step = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      const s = sim.current
      if (!s.dragging) s.omega *= Math.exp(-SPIN_FRICTION * dt)
      s.spin += s.omega * dt
      s.heat = Math.max(0, Math.min(1, s.heat - HEAT_LOSS * dt))

      const root = rootRef.current
      if (root) {
        root.style.setProperty('--spin', `${s.spin}rad`)
        root.style.setProperty('--heat', s.heat.toFixed(3))
        root.style.setProperty('--vortex', Math.min(1, Math.abs(s.omega) / 9).toFixed(3))
      }
      if (!perfect && s.heat >= PERFECT_ON) perfect = true
      else if (perfect && s.heat < PERFECT_OFF) perfect = false
      if (root && (root.dataset.perfect === 'true') !== perfect) root.dataset.perfect = String(perfect)
      const next = heatStatus(s.heat)
      if (next !== shownStatus) {
        shownStatus = next
        setStatus(next)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  const toLocal = (event) => {
    const rect = cupRef.current.getBoundingClientRect()
    let x = ((event.clientX - rect.left) / rect.width) * SIZE
    let y = ((event.clientY - rect.top) / rect.height) * SIZE
    const dist = Math.hypot(x - C, y - C)
    if (dist > SPOON_MAX_R) {
      x = C + ((x - C) / dist) * SPOON_MAX_R
      y = C + ((y - C) / dist) * SPOON_MAX_R
    }
    return { x, y, t: event.timeStamp }
  }

  const onPointerDown = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = toLocal(event)
    sim.current.dragging = true
    sim.current.last = point
    placeSpoon(point.x, point.y)
  }

  const onPointerMove = (event) => {
    const s = sim.current
    if (!s.dragging) return
    const point = toLocal(event)
    const last = s.last
    if (Math.hypot(point.x - C, point.y - C) > 14 && Math.hypot(last.x - C, last.y - C) > 14) {
      let delta = Math.atan2(point.y - C, point.x - C) - Math.atan2(last.y - C, last.x - C)
      if (delta > Math.PI) delta -= Math.PI * 2
      if (delta < -Math.PI) delta += Math.PI * 2
      const dt = Math.max((point.t - last.t) / 1000, 0.008)
      s.omega += (delta / dt - s.omega) * 0.35
      s.heat = Math.min(1, s.heat + Math.abs(delta) * HEAT_GAIN)
    }
    s.last = point
    placeSpoon(point.x, point.y)
  }

  const onPointerUp = () => {
    sim.current.dragging = false
  }

  const atDesk = phase !== 'in'
  const dx = originRect.left + originRect.width / 2 - window.innerWidth / 2
  const dy = originRect.top + originRect.height / 2 - window.innerHeight / 2
  const fromScale = Math.max(0.08, originRect.width / SIZE)

  const stageStyle = {
    width: SIZE,
    height: SIZE,
    marginLeft: -SIZE / 2,
    marginTop: -SIZE / 2 - 30,
    transform: atDesk
      ? `translate(${dx}px, ${dy + 30}px) scale(${fromScale}) rotateX(70deg)`
      : `translate(0px, 0px) scale(${fit}) rotateX(0deg)`,
    opacity: phase === 'out' ? 0 : 1,
    transition:
      phase === 'start'
        ? 'none'
        : phase === 'out'
          ? 'transform 650ms cubic-bezier(0.5, 0, 0.8, 0.4), opacity 650ms ease-in'
          : 'transform 850ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  }

  return createPortal(
    <div ref={rootRef} className="mug-scene" role="dialog" aria-modal="true" aria-label="Caneca de café">
      <div className="book-backdrop" style={{ opacity: atDesk ? 0 : 1 }} onClick={close} />

      <button
        type="button"
        className="toon-btn toon-btn-icon book-close"
        style={{ opacity: atDesk ? 0 : 1, pointerEvents: atDesk ? 'none' : 'auto' }}
        onClick={close}
        aria-label="Devolver a caneca"
      >
        <X size={18} strokeWidth={3} />
      </button>

      <div className="mug-stage" style={stageStyle}>
        <div
          ref={cupRef}
          className="mug-top"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
            <defs>
              <radialGradient id="mug-wall" cx="50%" cy="50%" r="50%">
                <stop offset="80%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#f8fafc" />
              </radialGradient>
              <radialGradient id="mug-coffee" cx="45%" cy="42%" r="60%">
                <stop offset="0%" stopColor="#8a5530" />
                <stop offset="70%" stopColor="#5b3519" />
                <stop offset="100%" stopColor="#3d220f" />
              </radialGradient>
              <clipPath id="mug-coffee-clip">
                <circle cx={C} cy={C} r={COFFEE_R} />
              </clipPath>
            </defs>

            {/* pires */}
            <circle cx={C} cy={C + 6} r={226} fill="rgba(0,0,0,0.25)" />
            <circle cx={C} cy={C} r={224} fill="#f1f5f9" />
            <circle cx={C} cy={C} r={196} fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle cx={C} cy={C} r={218} fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.6" />

            {/* alça (vista de cima, a argola fica em pé: aparece como uma barra grossa, levemente inclinada) */}
            <g transform={`rotate(-24 ${C} ${C})`}>
              <rect x={C + 140} y={C - 29 + 12} width="138" height="58" rx="27" fill="rgba(0,0,0,0.2)" />
              <rect x={C + 140} y={C - 29} width="138" height="58" rx="27" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <rect x={C + 176} y={C - 20} width="88" height="14" rx="7" fill="#f1f5f9" />
            </g>

            {/* caneca */}
            <circle cx={C} cy={C + 8} r={170} fill="rgba(0,0,0,0.18)" />
            <circle cx={C} cy={C} r={168} fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx={C} cy={C} r={156} fill="url(#mug-wall)" />

            {/* fundo da caneca, com a escrita */}
            <circle cx={C} cy={C} r={COFFEE_R} fill="#fdf6ec" />
            <g className="mug-bottom-text">
              <text x={C} y={C - 12} textAnchor="middle">
                mexa para deixar
              </text>
              <text x={C} y={C + 24} textAnchor="middle">
                o café no ponto!
              </text>
            </g>

            {/* café: fica mais transparente com o redemoinho, revelando o fundo */}
            <g clipPath="url(#mug-coffee-clip)">
              <circle cx={C} cy={C} r={COFFEE_R} fill="url(#mug-coffee)" className="mug-coffee" />
              <g className="mug-swirl" style={{ transformOrigin: `${C}px ${C}px` }}>
                <path
                  d={`M${C} ${C} m0 -20 a20 20 0 1 1 -20 20 a45 45 0 0 1 45 -45 a72 72 0 0 1 72 72 a100 100 0 0 1 -100 100 a128 128 0 0 1 -128 -128`}
                  fill="none"
                  stroke="#d6a676"
                  strokeWidth="9"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle cx={C + 92} cy={C - 40} r="6" fill="#e9c9a3" opacity="0.7" />
                <circle cx={C - 70} cy={C + 84} r="4.5" fill="#e9c9a3" opacity="0.7" />
                <circle cx={C - 96} cy={C - 52} r="3.5" fill="#e9c9a3" opacity="0.7" />
                <circle cx={C + 40} cy={C + 110} r="3" fill="#e9c9a3" opacity="0.7" />
              </g>
            </g>
            <circle cx={C} cy={C} r={COFFEE_R} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />

            {/* crema: bolhas na borda que vão surgindo com o calor */}
            <g className="mug-foam" style={{ transformOrigin: `${C}px ${C}px` }}>
              {FOAM.map((b, i) => (
                <circle
                  key={i}
                  className="mug-foam-bubble"
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  style={{ '--at': b.at }}
                />
              ))}
            </g>

            {/* ondas do café no ponto */}
            <circle className="mug-ripple" cx={C} cy={C} r={COFFEE_R - 20} />
            <circle className="mug-ripple mug-ripple-2" cx={C} cy={C} r={COFFEE_R - 20} />
          </svg>

          {/* colher (o pivô é o centro da concha; o cabo aponta para fora) */}
          <div ref={spoonRef} className="mug-spoon">
            <svg viewBox="-30 -20 260 40" width="260" height="40" aria-hidden="true">
              <path d="M14 -4 L222 -7 a7 7 0 0 1 0 14 L14 4 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="25" ry="17" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="-3" cy="-4" rx="12" ry="6" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>

          <div className="mug-glow" aria-hidden="true" />
          <div className="mug-sparkles" aria-hidden="true">
            {SPARKLES.map((sp, i) => (
              <svg
                key={i}
                viewBox="-10 -10 20 20"
                width={sp.size}
                height={sp.size}
                style={{ left: sp.left, top: sp.top, animationDelay: sp.delay }}
              >
                <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" />
              </svg>
            ))}
          </div>

          <div className="mug-steam" aria-hidden="true">
            <span style={{ left: '38%', animationDelay: '0s' }} />
            <span style={{ left: '52%', animationDelay: '0.7s' }} />
            <span style={{ left: '62%', animationDelay: '1.4s' }} />
            <span style={{ left: '45%', animationDelay: '2.1s' }} />
          </div>
        </div>
      </div>

      <div className="mug-panel" style={{ opacity: atDesk ? 0 : 1 }}>
        <p className="mug-status" aria-live="polite">
          {status}
        </p>
        <div className="mug-meter" aria-hidden="true">
          <span />
        </div>
        <p className="mug-hint">Arraste a colher em círculos dentro do café · Esc para devolver</p>
      </div>
    </div>,
    document.body,
  )
}
