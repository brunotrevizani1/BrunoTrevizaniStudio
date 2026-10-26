// Objetos decorativos em SVG (plantas, globo, troféu, ampulheta, porta-retratos, pilhas de
// livros...) usados nas prateleiras e no cômodo. Cada um é desenhado com a base em `floorY`.

const BOOK_COLORS = [
  '#9f1239',
  '#1e3a8a',
  '#166534',
  '#ca8a04',
  '#0f766e',
  '#7c2d12',
  '#475569',
  '#c2410c',
  '#e7d9b8',
  '#312e81',
  '#be123c',
  '#365314',
]

function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Plant({ x, floorY }) {
  return (
    <g>
      <path d={`M${x + 4} ${floorY - 22} h30 l-4 22 h-22 Z`} fill="#c2612f" />
      <rect x={x} y={floorY - 28} width="38" height="8" rx="2.5" fill="#d97339" />
      <path d={`M${x + 19} ${floorY - 28} C${x + 4} ${floorY - 44} ${x - 2} ${floorY - 62} ${x + 6} ${floorY - 78} C${x + 18} ${floorY - 66} ${x + 22} ${floorY - 48} ${x + 19} ${floorY - 28} Z`} fill="#1a8a4c" />
      <path d={`M${x + 19} ${floorY - 28} C${x + 34} ${floorY - 44} ${x + 40} ${floorY - 62} ${x + 32} ${floorY - 78} C${x + 20} ${floorY - 66} ${x + 16} ${floorY - 48} ${x + 19} ${floorY - 28} Z`} fill="#2fbf6c" />
      <path d={`M${x + 19} ${floorY - 28} C${x + 12} ${floorY - 52} ${x + 16} ${floorY - 74} ${x + 20} ${floorY - 92} C${x + 28} ${floorY - 72} ${x + 26} ${floorY - 50} ${x + 19} ${floorY - 28} Z`} fill="#22a15a" />
    </g>
  )
}

export function Globe({ x, floorY }) {
  const cx = x + 18
  const cy = floorY - 44
  return (
    <g>
      <rect x={cx - 14} y={floorY - 6} width="28" height="6" rx="2" fill="#6b4423" />
      <rect x={cx - 2} y={floorY - 26} width="4" height="22" fill="#6b4423" />
      <circle cx={cx} cy={cy} r="20" fill="#1d6fb8" />
      <path d={`M${cx - 12} ${cy - 8} q6 -8 14 -2 q4 6 -4 10 q-8 2 -10 -8 Z`} fill="#4ade80" />
      <path d={`M${cx + 2} ${cy + 6} q8 -2 10 6 q-6 6 -12 2 q-2 -4 2 -8 Z`} fill="#4ade80" />
      <path d={`M${cx - 20} ${cy} a20 20 0 0 0 40 0`} stroke="#c9902a" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx={cx - 7} cy={cy - 8} r="6" fill="#fff" opacity="0.18" />
    </g>
  )
}

export function Trophy({ x, floorY }) {
  return (
    <g>
      <rect x={x + 6} y={floorY - 8} width="26" height="8" rx="2" fill="#6b4423" />
      <rect x={x + 15} y={floorY - 22} width="8" height="14" fill="#d4a017" />
      <path d={`M${x + 4} ${floorY - 56} h30 q0 22 -15 26 q-15 -4 -15 -26 Z`} fill="#f5c542" />
      <path d={`M${x + 4} ${floorY - 52} q-10 0 -8 10 q2 8 12 8`} stroke="#d4a017" strokeWidth="3" fill="none" />
      <path d={`M${x + 34} ${floorY - 52} q10 0 8 10 q-2 8 -12 8`} stroke="#d4a017" strokeWidth="3" fill="none" />
      <path d={`M${x + 11} ${floorY - 52} v14`} stroke="#fff" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
    </g>
  )
}

export function Hourglass({ x, floorY }) {
  return (
    <g>
      <rect x={x} y={floorY - 6} width="30" height="6" rx="2" fill="#6b4423" />
      <rect x={x} y={floorY - 56} width="30" height="6" rx="2" fill="#6b4423" />
      <path d={`M${x + 4} ${floorY - 50} h22 l-9 20 l9 24 h-22 l9 -24 Z`} fill="#bfe3f5" opacity="0.55" />
      <path d={`M${x + 8} ${floorY - 46} h14 l-7 12 Z`} fill="#fb923c" opacity="0.9" />
      <path d={`M${x + 8} ${floorY - 6} q7 -16 14 0 Z`} fill="#fb923c" opacity="0.9" />
    </g>
  )
}

export function Frame({ x, floorY }) {
  return (
    <g transform={`rotate(-7 ${x + 30} ${floorY})`}>
      <rect x={x} y={floorY - 54} width="38" height="54" rx="2" fill="#6b4423" />
      <rect x={x + 5} y={floorY - 49} width="28" height="44" fill="#fde7c2" />
      <path d={`M${x + 5} ${floorY - 20} l9 -12 l8 9 l5 -5 l6 8 v14 h-28 Z`} fill="#fb923c" opacity="0.85" />
      <circle cx={x + 24} cy={floorY - 38} r="4" fill="#facc15" />
    </g>
  )
}

export function Basket({ x, floorY }) {
  return (
    <g>
      <path d={`M${x} ${floorY - 34} h56 l-5 34 h-46 Z`} fill="#b98450" />
      <path d={`M${x + 4} ${floorY - 24} h48 M${x + 3} ${floorY - 14} h50`} stroke="#8f6a3d" strokeWidth="2" />
      <rect x={x + 8} y={floorY - 56} width="9" height="26" rx="1.5" fill="#be123c" transform={`rotate(-8 ${x + 12} ${floorY - 34})`} />
      <rect x={x + 22} y={floorY - 62} width="9" height="32" rx="1.5" fill="#0f766e" />
      <rect x={x + 36} y={floorY - 54} width="9" height="24" rx="1.5" fill="#ca8a04" transform={`rotate(9 ${x + 40} ${floorY - 34})`} />
    </g>
  )
}

export function HorizontalStack({ x, floorY, seed }) {
  const random = createRandom(seed)
  return (
    <g>
      {[0, 1, 2].map((index) => (
        <g key={index}>
          <rect
            x={x + (random() - 0.5) * 6}
            y={floorY - 13 * (index + 1)}
            width={58 - index * 4}
            height="12.5"
            rx="1.5"
            fill={BOOK_COLORS[(seed + index * 3) % BOOK_COLORS.length]}
          />
          <rect x={x + 3} y={floorY - 13 * (index + 1) + 4.5} width={52 - index * 4} height="2" fill="#f2d28a" opacity="0.8" />
        </g>
      ))}
    </g>
  )
}

