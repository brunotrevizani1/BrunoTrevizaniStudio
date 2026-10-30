import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Relógio de parede do cômodo, com a hora real. Clicar vira o relógio no ar (como os quadros
// das fotos) e ele vem para perto, com a hora digital e a data embaixo.

const FLIP_MS = 900

function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    // alinha o tique com a virada do segundo, como um relógio de verdade
    let interval = 0
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 1000)
    }, 1000 - (Date.now() % 1000))
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return now
}

function ClockFace({ now, className }) {
  const seconds = now.getSeconds()
  const minutes = now.getMinutes() + seconds / 60
  const hour = ((now.getHours() % 12) + minutes / 60) * 30

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#8b5a2b" />
      <circle cx="50" cy="50" r="39" fill="#fdf3dc" />
      {Array.from({ length: 12 }, (_, index) => (
        <line
          key={index}
          x1="50"
          y1="15"
          x2="50"
          y2={index % 3 === 0 ? 22 : 19}
          stroke="#5b3a1a"
          strokeWidth={index % 3 === 0 ? 3 : 1.6}
          strokeLinecap="round"
          transform={`rotate(${index * 30} 50 50)`}
        />
      ))}
      <line x1="50" y1="50" x2="50" y2="29" stroke="#3a2410" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hour} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="20" stroke="#3a2410" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${minutes * 6} 50 50)`} />
      <line x1="50" y1="56" x2="50" y2="18" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${seconds * 6} 50 50)`} />
      <circle cx="50" cy="50" r="3.4" fill="#ea580c" />
    </svg>
  )
}

function clockSize() {
  return Math.round(Math.min(440, window.innerWidth - 48, window.innerHeight - 220))
}

/** Fases: start (na parede) -> in (virado, no centro) -> out -> (onClosed) */
function ClockViewer({ originRect, onClosed }) {
  const now = useNow()
  const [phase, setPhase] = useState('start')
  const [size, setSize] = useState(clockSize)

  useEffect(() => {
    const update = () => setSize(clockSize())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.modal = 'clock'
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
    const timer = setTimeout(onClosed, FLIP_MS)
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

  const onWall = phase !== 'in'
  const dx = originRect.left + originRect.width / 2 - window.innerWidth / 2
  const dy = originRect.top + originRect.height / 2 - window.innerHeight / 2

  const cardStyle = {
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2 - 40,
    transform: onWall
      ? `translate(${dx}px, ${dy + 40}px) scale(${originRect.width / size}) rotateY(0deg)`
      : 'translate(0px, 0px) scale(1) rotateY(360deg)',
    transition: phase === 'start' ? 'none' : `transform ${FLIP_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`,
  }

  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const date = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return createPortal(
    <div className="photo-scene" role="dialog" aria-modal="true" aria-label="Relógio">
      <div className="book-backdrop" style={{ opacity: onWall ? 0 : 1 }} onClick={close} />

      <button
        type="button"
        className="toon-btn toon-btn-icon book-close"
        style={{ opacity: onWall ? 0 : 1, pointerEvents: onWall ? 'none' : 'auto' }}
        onClick={close}
        aria-label="Devolver o relógio para a parede"
      >
        <X size={18} strokeWidth={3} />
      </button>

      <div className="photo-card clock-card" style={cardStyle} onClick={close}>
        <ClockFace now={now} className="clock-card-face" />
      </div>

      <div className="mug-panel" style={{ opacity: onWall ? 0 : 1 }}>
        <p className="clock-digital">
          <time dateTime={now.toISOString()}>{time}</time>
        </p>
        <p className="mug-hint clock-date">{date}</p>
      </div>
    </div>,
    document.body,
  )
}

export default function RoomClock() {
  const now = useNow()
  const [originRect, setOriginRect] = useState(null)

  return (
    <>
      <button
        type="button"
        className="room-clock"
        style={{ visibility: originRect ? 'hidden' : 'visible' }}
        onClick={(event) => setOriginRect(event.currentTarget.getBoundingClientRect())}
        aria-label="Ver as horas de perto"
        title="Ver as horas"
      >
        <ClockFace now={now} />
      </button>

      {originRect && <ClockViewer originRect={originRect} onClosed={() => setOriginRect(null)} />}
    </>
  )
}
