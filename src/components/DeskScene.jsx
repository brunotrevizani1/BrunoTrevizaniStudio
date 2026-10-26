const CODE_LINES = [
  { width: '46%', color: 'orange', indent: 0 },
  { width: '62%', color: 'blue', indent: 1 },
  { width: '38%', color: 'green', indent: 1 },
  { width: '70%', color: 'blue', indent: 2 },
  { width: '30%', color: 'amber', indent: 2 },
  { width: '54%', color: 'green', indent: 1 },
  { width: '24%', color: 'orange', indent: 0 },
  { width: '58%', color: 'blue', indent: 0 },
]

const STARS = [
  { left: '14%', top: '16%', delay: '0s' },
  { left: '70%', top: '12%', delay: '0.8s' },
  { left: '40%', top: '34%', delay: '1.4s' },
  { left: '82%', top: '40%', delay: '0.4s' },
  { left: '24%', top: '58%', delay: '1.9s' },
  { left: '58%', top: '66%', delay: '1.1s' },
]

const DUST = [
  { left: '8%', top: '28%', delay: '0s', duration: '9s' },
  { left: '16%', top: '46%', delay: '-3s', duration: '11s' },
  { left: '24%', top: '36%', delay: '-6s', duration: '10s' },
  { left: '12%', top: '62%', delay: '-2s', duration: '12s' },
  { left: '30%', top: '54%', delay: '-8s', duration: '9s' },
]

function Cat() {
  return (
    <div className="desk-cat">
      <div className="desk-zzz" aria-hidden="true">
        <span style={{ animationDelay: '0s' }}>z</span>
        <span style={{ animationDelay: '1.1s' }}>z</span>
        <span style={{ animationDelay: '2.2s' }}>Z</span>
      </div>
      <svg viewBox="0 0 170 84" className="desk-cat-body" fill="none">
        {/* rabo */}
        <path
          d="M128 66 C158 70 168 52 150 44"
          stroke="#e08a12"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* corpo */}
        <ellipse cx="86" cy="56" rx="64" ry="26" fill="#f59e0b" />
        <path d="M62 36 q4 10 0 20 M84 32 q4 12 0 24 M106 34 q4 11 0 22" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
        {/* cabeça */}
        <circle cx="38" cy="54" r="21" fill="#f59e0b" />
        <path d="M22 40 L24 22 L38 34 Z" fill="#f59e0b" />
        <path d="M54 40 L52 22 L38 34 Z" fill="#f59e0b" />
        <path d="M25 36 L26 27 L33 33 Z" fill="#fbcfe8" />
        <path d="M51 36 L50 27 L43 33 Z" fill="#fbcfe8" />
        {/* olhos fechados e focinho */}
        <path d="M27 54 q5 5 10 0 M40 54 q5 5 10 0" stroke="#78350f" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M35 61 l3 3 l3 -3 Z" fill="#fb7185" />
        {/* patinha */}
        <ellipse cx="62" cy="76" rx="16" ry="7" fill="#fbbf24" />
      </svg>
    </div>
  )
}

function Mug() {
  return (
    <div className="desk-mug">
      <div className="desk-steam" aria-hidden="true">
        <span style={{ animationDelay: '0s' }} />
        <span style={{ animationDelay: '0.9s' }} />
        <span style={{ animationDelay: '1.8s' }} />
      </div>
      <svg viewBox="0 0 70 62" fill="none">
        <path d="M52 20 h6 a9 9 0 0 1 0 22 h-8" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M8 14 h46 v28 a16 16 0 0 1 -16 16 h-14 a16 16 0 0 1 -16 -16 Z" fill="#f8fafc" />
        <ellipse cx="31" cy="15" rx="23" ry="5" fill="#7c4a24" />
        <path d="M14 30 h34" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Plant() {
  return (
    <div className="desk-plant">
      <svg viewBox="0 0 110 170" fill="none">
        <g className="desk-plant-leaves">
          <path d="M55 120 C30 100 18 70 26 38 C46 52 56 84 55 120 Z" fill="#22a15a" />
          <path d="M55 120 C80 100 96 72 86 36 C64 52 54 86 55 120 Z" fill="#1a8a4c" />
          <path d="M55 124 C46 90 50 54 58 14 C72 54 66 92 55 124 Z" fill="#2fbf6c" />
          <path d="M55 124 C28 118 8 104 4 80 C30 84 46 100 55 124 Z" fill="#188548" />
          <path d="M55 124 C82 118 102 106 106 82 C80 86 64 102 55 124 Z" fill="#22a15a" />
        </g>
        <path d="M24 122 h62 l-8 44 h-46 Z" fill="#c2612f" />
        <rect x="20" y="116" width="70" height="12" rx="4" fill="#d97339" />
      </svg>
    </div>
  )
}

function Monitor() {
  return (
    <div className="desk-monitor">
      <div className="desk-screen">
        <div className="desk-screen-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="desk-code">
          {CODE_LINES.map((line, index) => (
            <div key={index} className="desk-code-row" style={{ paddingLeft: `${line.indent * 14}px` }}>
              <span
                className={`desk-code-line desk-code-${line.color}`}
                style={{ '--w': line.width, animationDelay: `${index * 0.75}s` }}
              />
            </div>
          ))}
          <span className="desk-cursor" />
        </div>
      </div>
      <div className="desk-monitor-neck" />
      <div className="desk-monitor-base" />
    </div>
  )
}

export default function DeskScene({ isNight }) {
  return (
    <div
      aria-hidden="true"
      data-night={isNight}
      className="desk-scene pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="desk-wall" />
      <div className="desk-wall-glow" />

      {/* janela */}
      <div className="desk-window-light" />
      <div className="desk-window">
        <div className="desk-window-sky">
          <span className="desk-window-cloud" style={{ top: '16%', animationDelay: '-12s' }} />
          <span className="desk-window-cloud desk-window-cloud-small" style={{ top: '48%', animationDelay: '-38s' }} />
          <span className="desk-window-sun" />
          <span className="desk-window-moon" />
          {STARS.map((star, index) => (
            <span
              key={index}
              className="desk-window-star"
              style={{ left: star.left, top: star.top, animationDelay: star.delay }}
            />
          ))}
        </div>
        <span className="desk-window-bar-v" />
        <span className="desk-window-bar-h" />
      </div>

      {DUST.map((dust, index) => (
        <span
          key={index}
          className="desk-dust"
          style={{
            left: dust.left,
            top: dust.top,
            animationDelay: dust.delay,
            animationDuration: dust.duration,
          }}
        />
      ))}

      <div className="desk-monitor-glow" />

      {/* mesa e objetos */}
      <div className="desk-surface" />
      <Cat />
      <Mug />
      <Plant />
      <Monitor />
    </div>
  )
}
