import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const SIZE = 440
const POT_LEFT = 150
const POT_RIGHT = 290
const SOIL_Y = 296
const FLOOR_Y = 430

// regador: o pivô (onde a mão segura) fica em CAN_Y; inclinado em TILT, o bico fica em tipOffset
const CAN_Y = 112
const CAN_PIVOT = { x: 96, y: 66 }
const CAN_TIP = { x: 6, y: 26 }
const CAN_NECK = { x: 58, y: 70 }
const TILT = -32
const TILT_MS = 200
const rotate = ({ x, y }) => {
  const angle = (TILT * Math.PI) / 180
  return { x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) }
}
const tipOffset = rotate({ x: CAN_TIP.x - CAN_PIVOT.x, y: CAN_TIP.y - CAN_PIVOT.y })
// direção do bico depois de inclinado: as gotas saem por ela
const SPOUT_ANGLE = (() => {
  const dir = rotate({ x: CAN_TIP.x - CAN_NECK.x, y: CAN_TIP.y - CAN_NECK.y })
  return Math.atan2(dir.y, dir.x)
})()

// gotas: saem do crivo em leque, caem com gravidade e herdam um pouco do movimento do regador
const DROPS_PER_S = 220
const DROP_SPEED = [70, 150]
const DROP_SPREAD = 0.55 // radianos para cada lado
const GRAVITY = 980
const CAN_DRAG = 0.35
const MAX_DROPS = 600

const WATER_START = 0.15
const WATER_PER_DROP = 0.0016 // cada gota que cai dentro do vaso
const WATER_LOSS = 0.02 // por segundo
const HAPPY_ON = 0.97
const HAPPY_OFF = 0.85

// folhas: [ângulo de pé, comprimento, largura, cor, lado para onde murcha]
const LEAVES = [
  [-58, 120, 30, '#1a8a4c', -1],
  [-28, 150, 32, '#22a15a', -1],
  [0, 176, 34, '#2fbf6c', 1],
  [26, 148, 32, '#22a15a', 1],
  [54, 118, 30, '#1a8a4c', 1],
]

const SPARKLES = [
  { left: '24%', top: '22%', delay: '0s', size: 18 },
  { left: '72%', top: '18%', delay: '0.3s', size: 22 },
  { left: '80%', top: '48%', delay: '0.55s', size: 14 },
  { left: '18%', top: '52%', delay: '0.2s', size: 16 },
  { left: '50%', top: '8%', delay: '0.45s', size: 12 },
]

function waterStatus(water) {
  if (water >= HAPPY_ON) return 'Que delícia! A planta agradece!'
  if (water >= 0.6) return 'Tá ficando verdinha, mais um pouco...'
  if (water >= 0.3) return 'Isso, continua regando!'
  return 'Segura o clique em cima do vaso para regar.'
}

function Leaf({ angle, length, width, color, side }) {
  const half = width / 2
  return (
    <g className="plant-leaf" style={{ '--angle': `${angle}deg`, '--side': side }}>
      <path
        d={`M0 0 C${-half * 1.6} ${-length * 0.35} ${-half} ${-length * 0.8} 0 ${-length} C${half} ${-length * 0.8} ${half * 1.6} ${-length * 0.35} 0 0 Z`}
        fill={color}
      />
      <path d={`M0 -6 Q2 ${-length * 0.5} 0 ${-length * 0.92}`} stroke="#ffffff" strokeWidth="2.5" opacity="0.25" fill="none" />
    </g>
  )
}

/**
 * Vaso de planta trazido para perto: o regador segue o ponteiro e, segurando o clique (ou espaço),
 * ele inclina e despeja água. Água caindo dentro do vaso enche a planta, que levanta as folhas,
 * fica mais verde e abre uma flor. Fases: start -> in -> out -> (onClosed)
 */
export default function PlantViewer({ originRect, onClosed }) {
  const [phase, setPhase] = useState('start')
  const [fit, setFit] = useState(1)
  const [status, setStatus] = useState(() => waterStatus(WATER_START))
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const canRef = useRef(null)
  const canvasRef = useRef(null)
  const sim = useRef({ water: WATER_START, pouring: false, pourSince: 0, canX: SIZE / 2 - tipOffset.x, drops: [], splashes: [] })

  useEffect(() => {
    const update = () => setFit(Math.min(1, (window.innerWidth - 32) / SIZE, (window.innerHeight - 190) / SIZE))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.modal = 'plant'
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

  // o regador anda na hora (sem transição); só a inclinação é animada, no svg de dentro
  const placeCan = useCallback(() => {
    const s = sim.current
    const can = canRef.current
    if (!can) return
    can.style.transform = `translate(${s.canX - CAN_PIVOT.x}px, ${CAN_Y - CAN_PIVOT.y}px)`
    can.firstChild.style.transform = s.pouring ? `rotate(${TILT}deg)` : ''
  }, [])

  const setPouring = useCallback(
    (pouring) => {
      const s = sim.current
      if (pouring && !s.pouring) s.pourSince = performance.now()
      s.pouring = pouring
      placeCan()
    },
    [placeCan],
  )

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') close()
      if ((event.key === ' ' || event.key === 'Enter') && !event.repeat && event.target === stageRef.current?.parentElement) {
        event.preventDefault()
        sim.current.canX = SIZE / 2 - tipOffset.x
        setPouring(event.type === 'keydown')
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [close, setPouring])

  // laço: gotas com física; as que caem dentro do vaso enchem a planta, que seca devagar
  useEffect(() => {
    placeCan()
    const canvas = canvasRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let frame = 0
    let prev = performance.now()
    let prevCanX = sim.current.canX
    let pending = 0
    let shown = waterStatus(WATER_START)
    let happy = false
    const step = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      const s = sim.current
      const canVx = dt > 0 ? (s.canX - prevCanX) / dt : 0
      prevCanX = s.canX

      // só começa a sair água depois que o regador terminou de inclinar
      if (s.pouring && now - s.pourSince > TILT_MS) {
        pending += DROPS_PER_S * dt
        const tipX = s.canX + tipOffset.x
        const tipY = CAN_Y + tipOffset.y
        while (pending >= 1 && s.drops.length < MAX_DROPS) {
          pending -= 1
          const angle = SPOUT_ANGLE + (Math.random() * 2 - 1) * DROP_SPREAD
          const speed = DROP_SPEED[0] + Math.random() * (DROP_SPEED[1] - DROP_SPEED[0])
          s.drops.push({
            x: tipX + (Math.random() * 2 - 1) * 4,
            y: tipY + (Math.random() * 2 - 1) * 4,
            vx: Math.cos(angle) * speed + canVx * CAN_DRAG,
            vy: Math.sin(angle) * speed,
            r: 1.6 + Math.random() * 1.6,
          })
        }
      } else {
        pending = 0
      }

      const kept = []
      for (const drop of s.drops) {
        drop.vy += GRAVITY * dt
        drop.x += drop.vx * dt
        drop.y += drop.vy * dt
        const overPot = drop.x > POT_LEFT + 6 && drop.x < POT_RIGHT - 6
        if (overPot && drop.y >= SOIL_Y) {
          s.water = Math.min(1, s.water + WATER_PER_DROP)
          if (Math.random() < 0.15) s.splashes.push({ x: drop.x, y: SOIL_Y, life: 1 })
        } else if (drop.y >= FLOOR_Y - 4) {
          if (Math.random() < 0.25) s.splashes.push({ x: drop.x, y: FLOOR_Y - 4, life: 1 })
        } else if (drop.x > -40 && drop.x < SIZE + 40) {
          kept.push(drop)
        }
      }
      s.drops = kept
      s.splashes = s.splashes.filter((splash) => (splash.life -= dt * 3) > 0)
      s.water = Math.max(0, s.water - WATER_LOSS * dt)

      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.fillStyle = 'rgba(127, 209, 255, 0.9)'
      for (const drop of s.drops) {
        // gota esticada na direção em que está caindo
        const stretch = Math.min(3, 1 + Math.hypot(drop.vx, drop.vy) / 260)
        ctx.beginPath()
        ctx.ellipse(drop.x, drop.y, drop.r * stretch, drop.r, Math.atan2(drop.vy, drop.vx), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)'
      ctx.lineWidth = 1.5
      for (const splash of s.splashes) {
        ctx.globalAlpha = splash.life
        ctx.beginPath()
        ctx.ellipse(splash.x, splash.y, 3 + (1 - splash.life) * 9, 1.5 + (1 - splash.life) * 3, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      const root = rootRef.current
      if (root) {
        root.style.setProperty('--water', s.water.toFixed(3))
        if (!happy && s.water >= HAPPY_ON) happy = true
        else if (happy && s.water < HAPPY_OFF) happy = false
        if ((root.dataset.happy === 'true') !== happy) root.dataset.happy = String(happy)
      }
      const next = waterStatus(s.water)
      if (next !== shown) {
        shown = next
        setStatus(next)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [placeCan])

  const moveCan = (event) => {
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * SIZE
    // o bico fica sob o ponteiro
    sim.current.canX = Math.max(40, Math.min(SIZE + 40, x - tipOffset.x))
    placeCan()
  }

  const onPointerDown = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    moveCan(event)
    setPouring(true)
  }

  const onPointerUp = () => setPouring(false)

  const atRoom = phase !== 'in'
  const dx = originRect.left + originRect.width / 2 - window.innerWidth / 2
  const dy = originRect.top + originRect.height / 2 - window.innerHeight / 2
  const fromScale = Math.max(0.08, originRect.width / SIZE)

  const stageStyle = {
    width: SIZE,
    height: SIZE,
    marginLeft: -SIZE / 2,
    marginTop: -SIZE / 2 - 40,
    transform: atRoom ? `translate(${dx}px, ${dy + 40}px) scale(${fromScale})` : `translate(0px, 0px) scale(${fit})`,
    opacity: phase === 'out' ? 0 : 1,
    transition:
      phase === 'start'
        ? 'none'
        : phase === 'out'
          ? 'transform 650ms cubic-bezier(0.5, 0, 0.8, 0.4), opacity 650ms ease-in'
          : 'transform 850ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  }

  return createPortal(
    <div ref={rootRef} className="plant-scene" role="dialog" aria-modal="true" aria-label="Regar a planta">
      <div className="book-backdrop" style={{ opacity: atRoom ? 0 : 1 }} onClick={close} />

      <button
        type="button"
        className="toon-btn toon-btn-icon book-close"
        style={{ opacity: atRoom ? 0 : 1, pointerEvents: atRoom ? 'none' : 'auto' }}
        onClick={close}
        aria-label="Devolver a planta"
      >
        <X size={18} strokeWidth={3} />
      </button>

      <div
        className="plant-stage"
        style={stageStyle}
        tabIndex={0}
        aria-label="Vaso de planta: segure espaço para regar"
        onPointerDown={onPointerDown}
        onPointerMove={moveCan}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={stageRef} className="plant-area">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
            <ellipse cx={SIZE / 2} cy={FLOOR_Y - 2} rx="110" ry="12" fill="rgba(0,0,0,0.25)" />

            <g className="plant-body" transform={`translate(${SIZE / 2} ${SOIL_Y})`}>
              {LEAVES.map(([angle, length, width, color, side]) => (
                <Leaf key={angle} angle={angle} length={length} width={width} color={color} side={side} />
              ))}
              <g className="plant-flower" transform="translate(0 -176)">
                {[0, 72, 144, 216, 288].map((petal) => (
                  <ellipse key={petal} cx="0" cy="-14" rx="10" ry="16" fill="#fb7185" transform={`rotate(${petal})`} />
                ))}
                <circle r="9" fill="#fde047" />
              </g>
            </g>

            {/* vaso */}
            <path d={`M${POT_LEFT + 10} ${SOIL_Y + 14} H${POT_RIGHT - 10} L${POT_RIGHT - 26} ${FLOOR_Y - 4} H${POT_LEFT + 26} Z`} fill="#c2612f" />
            <ellipse cx={SIZE / 2} cy={SOIL_Y + 4} rx="66" ry="12" fill="#6b3f1f" />
            <ellipse className="plant-soil-wet" cx={SIZE / 2} cy={SOIL_Y + 4} rx="66" ry="12" fill="#2e1a0b" />
            <rect x={POT_LEFT} y={SOIL_Y - 2} width={POT_RIGHT - POT_LEFT} height="22" rx="7" fill="#d97339" />
            <path d={`M${POT_LEFT + 30} ${SOIL_Y + 40} v70`} stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
          </svg>

          <canvas ref={canvasRef} className="plant-drops" aria-hidden="true" />

          <div ref={canRef} className="plant-can" aria-hidden="true">
            <svg viewBox="0 0 160 110" width="160" height="110" className="plant-can-tilt">
              <path d="M58 70 L6 26" stroke="#0e7490" strokeWidth="11" strokeLinecap="round" />
              <ellipse cx="7" cy="26" rx="9" ry="6" fill="#155e75" transform="rotate(-40 7 26)" />
              <path d="M120 40 C156 40 156 92 120 92" stroke="#0e7490" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M74 24 Q98 4 122 24" stroke="#0e7490" strokeWidth="8" fill="none" strokeLinecap="round" />
              <rect x="50" y="30" width="78" height="72" rx="14" fill="#22d3ee" stroke="#0e7490" strokeWidth="4" />
              <path d="M62 44 v40" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>

          <div className="plant-sparkles" aria-hidden="true">
            {SPARKLES.map((sp, i) => (
              <svg
                key={i}
                viewBox="-10 -10 20 20"
                width={sp.size}
                height={sp.size}
                style={{ left: sp.left, top: sp.top, animationDelay: sp.delay }}
              >
                <path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" fill="#fde047" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      <div className="mug-panel" style={{ opacity: atRoom ? 0 : 1 }}>
        <p className="mug-status" aria-live="polite">
          {status}
        </p>
        <div className="mug-meter plant-meter" aria-hidden="true">
          <span />
        </div>
        <p className="mug-hint">Mova o regador e segure o clique sobre o vaso</p>
      </div>
    </div>,
    document.body,
  )
}
