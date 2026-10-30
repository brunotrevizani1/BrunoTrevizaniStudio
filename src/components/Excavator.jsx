import InkFilter from './icons/InkFilter'

const dirtParticles = [
  { x: 330, y: 170, dx: '4px', delay: '0s', r: 4 },
  { x: 336, y: 172, dx: '14px', delay: '0.08s', r: 3 },
  { x: 342, y: 170, dx: '24px', delay: '0.04s', r: 4.5 },
  { x: 334, y: 174, dx: '-4px', delay: '0.12s', r: 3 },
  { x: 340, y: 173, dx: '34px', delay: '0.16s', r: 3.5 },
]

export default function Excavator({ className = 'h-auto max-h-[34vh] w-full max-w-xl' }) {
  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      role="img"
      aria-label="Escavadeira cavando"
    >
      <defs>
        <linearGradient id="exc-ground-fill" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--color-surface)" stopOpacity="0" />
          <stop offset="0.15" stopColor="var(--color-surface)" />
          <stop offset="0.85" stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="exc-ground-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--color-border)" stopOpacity="0" />
          <stop offset="0.15" stopColor="var(--color-border)" />
          <stop offset="0.85" stopColor="var(--color-border)" />
          <stop offset="1" stopColor="var(--color-border)" stopOpacity="0" />
        </linearGradient>
        <InkFilter id="exc-ink" width={2} offset={4} />
      </defs>

      {/* placa */}
      <g filter="url(#exc-ink)">
        <rect x="508" y="170" width="6" height="82" fill="#52525b" />
        <rect x="474" y="150" width="74" height="34" rx="5" fill="#facc15" />
        <rect x="474" y="150" width="74" height="34" rx="5" fill="none" stroke="#18181b" strokeWidth="2" />
        <text
          x="511"
          y="172"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#18181b"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          EM OBRAS
        </text>
      </g>

      {/* cone */}
      <g filter="url(#exc-ink)">
        <polygon points="30,250 58,250 49,214 39,214" fill="#f97316" />
        <rect x="38" y="228" width="12" height="6" fill="#fff" opacity="0.9" />
        <rect x="26" y="248" width="36" height="6" rx="2" fill="#18181b" />
      </g>

      {/* escavadeira */}
      <g className="exc-idle" filter="url(#exc-ink)">
        {/* esteira */}
        <rect x="58" y="222" width="150" height="30" rx="15" fill="#27272a" />
        <rect x="64" y="228" width="138" height="18" rx="9" fill="none" stroke="#52525b" strokeWidth="2" strokeDasharray="7 6" />
        {[84, 133, 182].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="237" r="9" fill="#3f3f46" />
            <circle cx={cx} cy="237" r="3.5" fill="#a1a1aa" />
          </g>
        ))}

        {/* contrapeso e corpo */}
        <rect x="58" y="176" width="34" height="46" rx="8" fill="#ca8a04" />
        <rect x="80" y="170" width="112" height="54" rx="8" fill="#facc15" />
        <rect x="80" y="206" width="112" height="6" fill="#ca8a04" opacity="0.6" />

        {/* cabine */}
        <path d="M128 172 V138 a6 6 0 0 1 6-6 h38 a6 6 0 0 1 6 6 V172 Z" fill="#eab308" />
        <path d="M136 168 V142 h34 v26 Z" fill="#bae6fd" opacity="0.85" />
        <path d="M136 142 h14 l-14 26 Z" fill="#fff" opacity="0.35" />

        {/* escape */}
        <rect x="100" y="150" width="7" height="24" rx="3" fill="#3f3f46" />

        {/* lança, braço e caçamba */}
        <g className="exc-boom">
          <line x1="172" y1="185" x2="268" y2="108" stroke="#facc15" strokeWidth="15" strokeLinecap="round" />
          <line x1="172" y1="185" x2="268" y2="108" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <circle cx="172" cy="185" r="8" fill="#3f3f46" />

          <g className="exc-stick">
            <line x1="268" y1="108" x2="322" y2="196" stroke="#eab308" strokeWidth="11" strokeLinecap="round" />
            <circle cx="268" cy="108" r="8" fill="#3f3f46" />

            <g className="exc-bucket">
              <path
                d="M308 186 L336 184 L356 214 Q344 230 322 224 L304 206 Z"
                fill="#71717a"
                stroke="#3f3f46"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M346 214 l10 0 l-3 10 l-10 -1 Z" fill="#d4d4d8" />
              <circle cx="322" cy="196" r="7" fill="#3f3f46" />
            </g>
          </g>
        </g>
      </g>

      {/* terra caindo */}
      {dirtParticles.map((particle) => (
        <circle
          key={particle.x}
          cx={particle.x}
          cy={particle.y}
          r={particle.r}
          fill="#92613a"
          className="exc-dirt"
          style={{ '--dx': particle.dx, animationDelay: particle.delay }}
        />
      ))}

      {/* monte de terra */}
      <path d="M318 252 Q358 196 424 252 Z" fill="#92613a" />
      <path d="M340 252 Q366 220 402 252 Z" fill="#7c4f2a" opacity="0.6" />

      {/* chão (cobre a parte da caçamba que está cavando) */}
      <rect x="0" y="250" width="600" height="50" fill="url(#exc-ground-fill)" />
      <line x1="0" y1="250.5" x2="600" y2="250.5" stroke="url(#exc-ground-line)" strokeWidth="2" />
      <path d="M254 250 Q272 262 292 250 Z" fill="#6b4423" opacity="0.8" />

      {/* poeira */}
      {[
        { cx: 262, cy: 246, delay: '0s' },
        { cx: 284, cy: 244, delay: '0.15s' },
        { cx: 300, cy: 248, delay: '0.3s' },
      ].map((puff) => (
        <circle
          key={puff.cx}
          cx={puff.cx}
          cy={puff.cy}
          r="9"
          fill="#a8a29e"
          className="exc-dust"
          style={{ animationDelay: puff.delay }}
        />
      ))}
    </svg>
  )
}
