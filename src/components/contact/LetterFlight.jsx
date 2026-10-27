/**
 * O pássaro que leva a carta: chega voando, pega o envelope que está na caixa de correio
 * (ver .yard-envelope) e sai voando. Fica nas coordenadas do palco do quintal (YardScene).
 * A linha do tempo (4s) está em yard.css; onDone avisa quando ele termina de sair.
 */
export default function LetterFlight({ onDone }) {
  return (
    <div className="yard-bird" aria-hidden="true" onAnimationEnd={(event) => event.target === event.currentTarget && onDone()}>
      <svg viewBox="0 0 120 80" width="120" height="80" overflow="visible">
        <g className="yard-bird-env">
          <rect x="94" y="46" width="34" height="24" rx="3" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
          <path d="M95 48 L111 60 L127 48" fill="none" stroke="#fdba74" strokeWidth="2" />
        </g>
        <path d="M18 44 L0 36 L6 50 L0 62 L24 54 Z" fill="#1b3552" />
        <ellipse cx="48" cy="48" rx="34" ry="18" fill="#2c5a8a" />
        <ellipse cx="54" cy="55" rx="22" ry="9" fill="#e2ecf7" />
        <circle cx="82" cy="40" r="14" fill="#2c5a8a" />
        <path d="M94 38 L108 44 L94 47 Z" fill="#fb923c" />
        <circle cx="86" cy="37" r="2.6" fill="#fff" />
        <circle cx="87" cy="37" r="1.3" fill="#0f172a" />
        <path className="yard-bird-wing" d="M40 42 C44 14 66 2 82 0 C72 16 66 32 62 46 Z" fill="#1b3552" />
      </svg>
    </div>
  )
}
