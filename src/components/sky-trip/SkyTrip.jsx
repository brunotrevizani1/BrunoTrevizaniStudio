import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createVeil, fitScale, zoomIn } from '../../hooks/cameraZoom'
import './sky-trip.css'

// Easter egg do Hero: depois que a câmera mergulha no sol ou na lua (CityScene), abre um
// "universo" com um bonequinho falando e a Terra no céu para voltar. Não tem utilidade, é só diversão.

// voltar pra Terra: a câmera mergulha na Terra e o véu azul cobre o final
const EARTH_ZOOM_MS = 1200
export const EARTH_VEIL = 'radial-gradient(circle, #7fb6ff 0%, #3a86ff 60%, #1d4fb8 100%)'

function scatter(count, seed, maxTop) {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  return Array.from({ length: count }, () => ({
    left: `${(random() * 100).toFixed(2)}%`,
    top: `${(random() * maxTop).toFixed(2)}%`,
    size: 8 + random() * 24,
    delay: `${(random() * 4).toFixed(2)}s`,
  }))
}

const BUBBLES = scatter(12, 7, 0)
const STARS = scatter(70, 13, 64)

const outline = { stroke: '#1e1b3a', strokeWidth: 4, strokeLinejoin: 'round' }
const limb = { fill: 'none', stroke: '#1e1b3a', strokeWidth: 9, strokeLinecap: 'round' }

// banhista de bermuda e óculos escuros, se abanando e suando
function Sunbather() {
  return (
    <svg className="sky-trip-buddy" viewBox="-110 -225 220 235" aria-hidden="true">
      <path d="M-14 -58 L-18 0 M14 -58 L18 0" {...limb} />
      <path d="M-30 2 h18 M12 2 h18" {...limb} strokeWidth="8" />
      <path d="M-28 -128 Q-50 -110 -46 -84" {...limb} />
      <rect x="-28" y="-82" width="56" height="30" rx="7" fill="#3a86ff" {...outline} />
      <rect x="-30" y="-140" width="60" height="64" rx="18" fill="#ffffff" {...outline} />
      <g className="sky-trip-fan">
        <path d="M28 -128 Q46 -138 54 -156" {...limb} />
        <path d="M54 -156 L34 -200 Q66 -214 92 -186 Z" fill="#fb923c" {...outline} />
        <path d="M54 -156 L50 -204 M54 -156 L66 -206 M54 -156 L80 -198" stroke="#1e1b3a" strokeWidth="2" />
      </g>
      <circle cy="-172" r="32" fill="#ffb38a" {...outline} />
      <ellipse cx="-20" cy="-160" rx="7" ry="4" fill="#ff7a7a" opacity="0.7" />
      <ellipse cx="20" cy="-160" rx="7" ry="4" fill="#ff7a7a" opacity="0.7" />
      <rect x="-26" y="-186" width="22" height="13" rx="5" fill="#1e1b3a" />
      <rect x="4" y="-186" width="22" height="13" rx="5" fill="#1e1b3a" />
      <path d="M-4 -181 h8" stroke="#1e1b3a" strokeWidth="3" />
      <path d="M-12 -152 q4 -5 8 0 t8 0 t8 0" fill="none" stroke="#1e1b3a" strokeWidth="3" strokeLinecap="round" />
      {[
        'M34 -196 q7 11 0 16 q-7 -5 0 -16z',
        'M-36 -186 q7 11 0 16 q-7 -5 0 -16z',
        'M24 -150 q6 9 0 13 q-6 -4 0 -13z',
      ].map((d, index) => (
        <path
          key={d}
          className="sky-trip-drop"
          d={d}
          fill="#7fd1ff"
          stroke="#1e1b3a"
          strokeWidth="2"
          style={{ animationDelay: `${index * 0.55}s` }}
        />
      ))}
    </svg>
  )
}

// astronauta fincando a bandeira do estúdio
function Astronaut() {
  return (
    <svg className="sky-trip-buddy" viewBox="-110 -250 280 262" aria-hidden="true">
      <g className="sky-trip-flag">
        <path d="M74 -236 V10" stroke="#1e1b3a" strokeWidth="6" strokeLinecap="round" />
        <g className="sky-trip-flag-cloth">
          <rect x="76" y="-234" width="84" height="52" fill="#fb923c" {...outline} />
          <path d="M78 -199 h80" stroke="#ea580c" strokeWidth="14" />
          <rect x="76" y="-234" width="84" height="52" fill="none" {...outline} />
          <text x="118" y="-200" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="20" fill="#ffffff">
            BT
          </text>
        </g>
      </g>
      <g className="sky-trip-astronaut">
        <rect x="-50" y="-150" width="22" height="72" rx="6" fill="#cfd0da" {...outline} />
        <rect x="-30" y="-72" width="24" height="66" rx="10" fill="#f4f4f8" {...outline} />
        <rect x="6" y="-72" width="24" height="66" rx="10" fill="#f4f4f8" {...outline} />
        <rect x="-36" y="-12" width="32" height="15" rx="6" fill="#8d8da0" {...outline} />
        <rect x="4" y="-12" width="32" height="15" rx="6" fill="#8d8da0" {...outline} />
        <rect x="-38" y="-152" width="76" height="92" rx="24" fill="#f4f4f8" {...outline} />
        <rect x="-16" y="-128" width="32" height="20" rx="4" fill="#3a86ff" {...outline} />
        <circle cx="-7" cy="-118" r="3" fill="#ffd23f" />
        <circle cx="6" cy="-118" r="3" fill="#fb923c" />
        {['M-34 -136 Q-60 -112 -50 -84', 'M34 -136 Q58 -128 70 -114'].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#1e1b3a" strokeWidth="22" strokeLinecap="round" />
            <path d={d} fill="none" stroke="#f4f4f8" strokeWidth="14" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="72" cy="-112" r="10" fill="#cfd0da" {...outline} />
        <circle cy="-186" r="40" fill="#f4f4f8" {...outline} />
        <ellipse cy="-184" rx="28" ry="23" fill="#1e1b3a" />
        <path d="M-16 -196 q8 -9 20 -8" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  )
}

function SunDecor() {
  return (
    <>
      <svg className="sky-trip-flares" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M60 200 C60 40 230 40 230 200" pathLength="100" />
        <path d="M520 200 C520 80 640 80 640 200" pathLength="100" />
        <path d="M680 200 C680 10 790 10 790 200" pathLength="100" />
      </svg>
      {BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className="sky-trip-bubble"
          style={{ left: bubble.left, width: bubble.size, height: bubble.size, animationDelay: bubble.delay }}
        />
      ))}
    </>
  )
}

function MoonDecor() {
  return (
    <>
      {STARS.map((star, index) => (
        <span key={index} className="sky-trip-star" style={{ left: star.left, top: star.top, animationDelay: star.delay }} />
      ))}
    </>
  )
}

const Earth = forwardRef(function Earth({ onClick }, ref) {
  return (
    <button ref={ref} type="button" className="sky-trip-earth" onClick={onClick} aria-label="Voltar pra Terra">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <circle r="46" fill="#3a86ff" stroke="#1e1b3a" strokeWidth="3" />
        <path
          d="M-30 -20 q10 -14 24 -8 q8 10 -4 18 q-14 4 -12 16 q-12 -8 -8 -26z M10 8 q14 -6 24 4 q-2 16 -16 22 q-10 -10 -8 -26z M4 -38 q12 -2 18 6 q-8 4 -18 -6z"
          fill="#5bd26b"
        />
        <path d="M-40 -6 q30 -10 80 4" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      </svg>
    </button>
  )
})

const WORLDS = {
  sun: {
    label: 'O Sol',
    line: 'Uau… tá meio quente aqui, né?',
    detail: 'Logo hoje esqueci o protetor solar...',
    Buddy: Sunbather,
    Decor: SunDecor,
  },
  moon: {
    label: 'A Lua',
    line: 'Um pequeno passo pro homem…',
    detail: '…e um grande salto pro meu portfólio!',
    Buddy: Astronaut,
    Decor: MoonDecor,
  },
}

/**
 * Universo do sol ou da lua, em tela cheia. Voltar (clique na Terra ou Esc) mergulha na Terra e
 * chama `onClose(veil)` com a tela já coberta pelo véu azul; a cidade se afasta do astro a partir dele.
 */
export default function SkyTrip({ astro, onClose }) {
  const [leaving, setLeaving] = useState(false)
  const rootRef = useRef(null)
  const earthRef = useRef(null)
  const world = WORLDS[astro]
  const { Buddy, Decor } = world

  // a página por trás fica inerte enquanto o universo está aberto
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) root.inert = true
    earthRef.current?.focus({ preventScroll: true })
    return () => {
      if (root) root.inert = false
    }
  }, [])

  const goHome = useCallback(async () => {
    const root = rootRef.current
    const earth = earthRef.current
    if (leaving || !root || !earth) return
    setLeaving(true)
    // a animação de entrada prende o transform do universo; ela sai antes do zoom
    root.style.animation = 'none'
    const rect = earth.getBoundingClientRect()
    const veil = createVeil(EARTH_VEIL)
    veil.style.zIndex = '80'
    try {
      await zoomIn(
        root,
        {
          originX: rect.left + rect.width / 2,
          originY: rect.top + rect.height / 2,
          scale: fitScale({ width: rect.width * 0.4, height: rect.height * 0.4 }),
        },
        EARTH_ZOOM_MS,
        veil,
      )
      onClose(EARTH_VEIL)
    } finally {
      veil.remove()
    }
  }, [leaving, onClose])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') goHome()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goHome])

  return createPortal(
    <div
      ref={rootRef}
      className={`sky-trip sky-trip-${astro}${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={world.label}
    >
      <div className="sky-trip-sky">
        <Decor />
        <Earth ref={earthRef} onClick={goHome} />
      </div>
      <div className="sky-trip-ground" />

      <div className="sky-trip-stage">
        <p className="sky-trip-speech">
          {world.line}
          <small>{world.detail}</small>
        </p>
        <Buddy />
      </div>
    </div>,
    document.body,
  )
}
