import { useEffect, useState } from 'react'
import { Plant } from '../setup/ShelfDecor'

// Peças do cômodo ao redor da estante (todas em coordenadas do palco, via CSS .room-*).

function currentAngles() {
  const now = new Date()
  const minutes = now.getMinutes() + now.getSeconds() / 60
  return { minute: minutes * 6, hour: ((now.getHours() % 12) + minutes / 60) * 30 }
}

function WallClock() {
  const [angles, setAngles] = useState(currentAngles)

  useEffect(() => {
    const timer = setInterval(() => setAngles(currentAngles()), 20000)
    return () => clearInterval(timer)
  }, [])

  return (
    <svg className="room-clock" viewBox="0 0 100 100" aria-hidden="true">
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
      <line x1="50" y1="50" x2="50" y2="29" stroke="#3a2410" strokeWidth="4" strokeLinecap="round" transform={`rotate(${angles.hour} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="20" stroke="#3a2410" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${angles.minute} 50 50)`} />
      <line className="room-clock-second" x1="50" y1="56" x2="50" y2="18" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3.4" fill="#ea580c" />
    </svg>
  )
}

function Frames() {
  return (
    <>
      <div className="room-frame room-frame-a" aria-hidden="true" />
      <div className="room-frame room-frame-b" aria-hidden="true" />
    </>
  )
}

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

function FloorLamp() {
  return (
    <>
      <div className="room-lamp-glow" aria-hidden="true" />
      <svg className="room-lamp" viewBox="0 0 90 330" fill="none" aria-hidden="true">
        <ellipse cx="45" cy="320" rx="30" ry="8" fill="#3a2d1d" />
        <rect x="42" y="96" width="6" height="226" rx="3" fill="#6b4a2a" />
        <path d="M14 96 L26 34 H64 L76 96 Z" fill="#fde7b0" />
        <path d="M14 96 L26 34 H40 L34 96 Z" fill="#fff6d8" opacity="0.7" />
        <ellipse cx="45" cy="96" rx="31" ry="6" fill="#f6cf7a" />
      </svg>
    </>
  )
}

function SleepingCat() {
  return (
    <div className="room-cat">
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
    </div>
  )
}

export default function RoomDecor() {
  return (
    <>
      <WallClock />
      <Frames />
      <RoomWindow />
      <div className="room-rug" aria-hidden="true" />
      <svg className="room-plant-big" viewBox="0 0 80 100" fill="none" aria-hidden="true">
        <Plant x={20} floorY={100} />
      </svg>
      <FloorLamp />
      <SleepingCat />
    </>
  )
}
