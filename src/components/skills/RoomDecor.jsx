import { useRef, useState } from 'react'
import { Plant } from '../setup/ShelfDecor'
import PlantViewer from './PlantViewer'
import PhotoFrames from './PhotoFrames'
import RoomClock from './RoomClock'

// Peças do cômodo ao redor da estante (todas em coordenadas do palco, via CSS .room-*).

function RoomWindow() {
  return (
    <svg className="room-window" viewBox="0 0 150 214" fill="none" aria-hidden="true">
      <rect x="0" y="0" width="150" height="214" rx="6" fill="#8b5a2b" />
      <rect x="10" y="10" width="130" height="194" fill="#7dd3fc" />
      <g className="room-window-day">
        <rect x="10" y="10" width="130" height="194" fill="url(#room-window-sky-day)" />
        <circle cx="104" cy="52" r="15" fill="#fde047" />
        <circle cx="104" cy="52" r="22" fill="#fde047" opacity="0.3" />
        <g fill="#fff" opacity="0.95">
          <ellipse cx="50" cy="70" rx="22" ry="8" />
          <ellipse cx="64" cy="64" rx="14" ry="7" />
          <ellipse cx="96" cy="120" rx="18" ry="6" />
        </g>
        <path d="M10 168 Q50 148 90 164 T140 156 V204 H10 Z" fill="#4ade80" />
      </g>
      <g className="room-window-night">
        <rect x="10" y="10" width="130" height="194" fill="url(#room-window-sky-night)" />
        <path d="M108 38 a16 16 0 1 0 14 24 a13 13 0 0 1 -14 -24 Z" fill="#f1f5f9" />
        <g fill="#fff">
          {[[30, 36, 1.6], [62, 24, 1.2], [48, 80, 1.4], [86, 96, 1.2], [26, 120, 1.3], [120, 110, 1.5], [70, 56, 1]].map(([x, y, r]) => (
            <circle key={x + "-" + y} className="room-window-star" cx={x} cy={y} r={r} />
          ))}
        </g>
        <path d="M10 172 Q50 156 90 168 T140 162 V204 H10 Z" fill="#14532d" />
      </g>
      <defs>
        <linearGradient id="room-window-sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#38bdf8" />
          <stop offset="1" stop-color="#bae6fd" />
        </linearGradient>
        <linearGradient id="room-window-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0b1026" />
          <stop offset="1" stop-color="#312e81" />
        </linearGradient>
      </defs>
      <rect x="70" y="10" width="10" height="194" fill="#8b5a2b" />
      <rect x="10" y="102" width="130" height="10" fill="#8b5a2b" />
      <rect x="10" y="10" width="130" height="194" fill="none" stroke="#5b3a1a" strokeWidth="2" />
      <rect x="-8" y="204" width="166" height="10" rx="3" fill="#a06a35" />
    </svg>
  )
}

// cortina da janela: clicar abre/fecha; a luz da cena acompanha (ver .setup-shade-*)
function Curtains({ open, onToggle }) {
  return (
    <div className="room-curtains" data-open={open}>
      <div className="room-curtain-beam" aria-hidden="true" />
      <div className="room-curtain room-curtain-left" aria-hidden="true" />
      <div className="room-curtain room-curtain-right" aria-hidden="true" />
      <div className="room-curtain-rod" aria-hidden="true" />
      <button
        type="button"
        className="room-curtain-hit"
        onClick={onToggle}
        aria-pressed={!open}
        aria-label={open ? 'Fechar a cortina' : 'Abrir a cortina'}
        title={open ? 'Fechar a cortina' : 'Abrir a cortina'}
      />
    </div>
  )
}

// vaso grande do canto: clicar traz a planta para perto, para regar
function BigPlant() {
  const [originRect, setOriginRect] = useState(null)

  return (
    <>
      <button
        type="button"
        className="room-plant-big room-plant-btn"
        style={{ visibility: originRect ? 'hidden' : 'visible' }}
        onClick={(event) => setOriginRect(event.currentTarget.getBoundingClientRect())}
        aria-label="Regar a planta"
        title="Regar a planta"
      >
        <svg viewBox="0 0 80 100" fill="none" aria-hidden="true">
          <Plant x={20} floorY={100} />
        </svg>
      </button>

      {originRect && <PlantViewer originRect={originRect} onClosed={() => setOriginRect(null)} />}
    </>
  )
}

// cordinha do abajur (mesma ideia da SkyCord do Hero): arrastar para baixo e soltar liga/desliga
const CORD_REST = 46
const CORD_MAX_PULL = 26
const CORD_THRESHOLD = 14
const CORD_VIEW_H = 90

function LampCord({ on, onToggle }) {
  const [pull, setPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const svgRef = useRef(null)
  const drag = useRef({ active: false, startY: 0, unitsPerPixel: 1, lastPull: 0 })

  function handlePointerDown(event) {
    event.preventDefault()
    event.stopPropagation()
    const rect = svgRef.current.getBoundingClientRect()
    drag.current = { active: true, startY: event.clientY, unitsPerPixel: CORD_VIEW_H / rect.height, lastPull: 0 }
    setDragging(true)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  function handlePointerMove(event) {
    if (!drag.current.active) return
    const { startY, unitsPerPixel } = drag.current
    const next = Math.max(0, Math.min(CORD_MAX_PULL, (event.clientY - startY) * unitsPerPixel))
    drag.current.lastPull = next
    setPull(next)
  }

  function handlePointerUp() {
    if (!drag.current.active) return
    drag.current.active = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    setDragging(false)
    if (drag.current.lastPull >= CORD_THRESHOLD) onToggle()
    setPull(0)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggle()
    }
  }

  const snap = dragging ? 'none' : 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)'
  const length = CORD_REST + pull

  return (
    <svg
      ref={svgRef}
      className={`room-lamp-cord${dragging ? '' : ' sky-cord-sway'}`}
      viewBox={`0 0 20 ${CORD_VIEW_H}`}
      width="20"
      height={CORD_VIEW_H}
      fill="none"
    >
      <g
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => event.preventDefault()}
        role="button"
        tabIndex={0}
        aria-pressed={on}
        aria-label={on ? 'Puxar a cordinha para desligar o abajur' : 'Puxar a cordinha para ligar o abajur'}
      >
        <rect x="0" y="0" width="20" height={CORD_VIEW_H} fill="transparent" />
        {/* correntinha de bolinhas */}
        <line
          x1="10"
          y1="0"
          x2="10"
          y2={length}
          stroke="#b8925a"
          strokeWidth="2.6"
          strokeDasharray="0.1 4"
          strokeLinecap="round"
          style={{ transition: snap }}
        />
        {/* puxador de madeira */}
        <g style={{ transform: `translateY(${pull}px)`, transition: snap }}>
          <path d={`M7 ${CORD_REST} h6 l1.5 12 a4.5 4.5 0 0 1 -9 0 Z`} fill="#8b5a2b" />
          <ellipse cx="8.6" cy={CORD_REST + 5} rx="1.2" ry="3" fill="#fff" opacity="0.35" />
        </g>
      </g>
    </svg>
  )
}

// abajur: a cordinha liga/desliga; a luz da cena acompanha (ver .setup-shade-lamp)
function FloorLamp({ on, onToggle }) {
  return (
    <>
      <div className="room-lamp-glow" aria-hidden="true" />
      <svg className="room-lamp" viewBox="0 0 90 330" fill="none" aria-hidden="true">
        <ellipse cx="45" cy="320" rx="30" ry="8" fill="#3a2d1d" />
        <rect x="42" y="96" width="6" height="226" rx="3" fill="#6b4a2a" />
        <path className="room-lamp-shade" d="M14 96 L26 34 H64 L76 96 Z" />
        <path className="room-lamp-shine" d="M14 96 L26 34 H40 L34 96 Z" fill="#fff6d8" />
        <ellipse className="room-lamp-rim" cx="45" cy="96" rx="31" ry="6" />
      </svg>
      <LampCord on={on} onToggle={onToggle} />
    </>
  )
}

// clicar no gato: ele dá um pulo, sai correndo pela esquerda e some da tela
function SleepingCat() {
  const [fleeing, setFleeing] = useState(false)
  const [gone, setGone] = useState(false)
  if (gone) return null

  return (
    <button
      type="button"
      className={`room-cat${fleeing ? ' is-fleeing' : ''}`}
      aria-label="Acordar o gato"
      onClick={() => setFleeing(true)}
      onAnimationEnd={(event) => event.target === event.currentTarget && setGone(true)}
    >
      <div className="desk-zzz" aria-hidden="true">
        <span style={{ animationDelay: '0s' }}>z</span>
        <span style={{ animationDelay: '1.1s' }}>z</span>
        <span style={{ animationDelay: '2.2s' }}>Z</span>
      </div>
      <svg viewBox="0 0 170 84" className="desk-cat-body" fill="none" aria-hidden="true">
        <path d="M128 66 C158 70 168 52 150 44" stroke="#e08a12" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="86" cy="56" rx="64" ry="26" fill="#f59e0b" />
        <path d="M62 36 q4 10 0 20 M84 32 q4 12 0 24 M106 34 q4 11 0 22" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="54" r="21" fill="#f59e0b" />
        <path d="M22 40 L24 22 L38 34 Z" fill="#f59e0b" />
        <path d="M54 40 L52 22 L38 34 Z" fill="#f59e0b" />
        <path d="M25 36 L26 27 L33 33 Z" fill="#fbcfe8" />
        <path d="M51 36 L50 27 L43 33 Z" fill="#fbcfe8" />
        <path d="M27 54 q5 5 10 0 M40 54 q5 5 10 0" stroke="#78350f" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M35 61 l3 3 l3 -3 Z" fill="#fb7185" />
        <ellipse cx="62" cy="76" rx="16" ry="7" fill="#fbbf24" />
      </svg>
    </button>
  )
}

export default function RoomDecor({ curtainOpen, onToggleCurtain, lampOn, onToggleLamp }) {
  return (
    <>
      <RoomClock />
      <PhotoFrames />
      <RoomWindow />
      <Curtains open={curtainOpen} onToggle={onToggleCurtain} />
      <div className="room-rug" aria-hidden="true" />
      <BigPlant />
      <FloorLamp on={lampOn} onToggle={onToggleLamp} />
      <SleepingCat />
    </>
  )
}
