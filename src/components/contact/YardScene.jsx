// Quintal de uma casa, desenhado em SVG num palco lógico de 1200x700 (o Contact escala/enquadra).
// O dia e a noite seguem a lâmpada do site (night). A caixa de correio fica em MAILBOX.
export const STAGE_W = 1200
export const STAGE_H = 700
export const MAILBOX = { x: 756, y: 543 }

const rand = (i, salt = 1) => ((i * 9301 + 49297 * salt) % 233280) / 233280

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: 20 + rand(i, 3) * 1160,
  y: 14 + rand(i, 7) * 230,
  r: 0.8 + rand(i, 11) * 1.6,
  delay: rand(i, 13) * 3,
})).filter((s) => !(s.x < 500 && s.y > 110))

const PICKETS = Array.from({ length: 43 }, (_, i) => i * 28 + 6).filter((x) => x < 205 || x > 335)

const FLOWERS = Array.from({ length: 30 }, (_, i) => ({
  x: 14 + i * 40 + rand(i, 5) * 20,
  y: 566 + rand(i, 17) * 40,
  c: ['#f472b6', '#fbbf24', '#f87171', '#fff', '#c084fc'][i % 5],
})).filter((f) => f.x < 660 || f.x > 880)

const TUFTS = Array.from({ length: 26 }, (_, i) => ({ x: rand(i, 19) * 1180 + 10, y: 480 + rand(i, 23) * 150 }))

const FIREFLIES = [
  [120, 560, 0],
  [420, 600, 1.2],
  [600, 520, 0.6],
  [980, 590, 1.8],
  [1100, 520, 0.3],
  [860, 480, 2.1],
]

const WINDOWS = [
  [132, 314],
  [336, 314],
]

export default function YardScene({ open, flagUp, sealed }) {
  return (
    <svg className="yard-svg" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} width={STAGE_W} height={STAGE_H} aria-hidden="true">
      <defs>
        <linearGradient id="yard-sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4f4" />
          <stop offset="1" stopColor="#e4f4ff" />
        </linearGradient>
        <linearGradient id="yard-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c1738" />
          <stop offset="1" stopColor="#2c3d7a" />
        </linearGradient>
        <linearGradient id="yard-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86cf6c" />
          <stop offset="1" stopColor="#55a746" />
        </linearGradient>
        <radialGradient id="yard-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd479" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* céu */}
      <rect width="1200" height="480" fill="url(#yard-sky-day)" />
      <rect className="yard-night-only" width="1200" height="480" fill="url(#yard-sky-night)" />

      {/* nuvens */}
      <g className="yard-cloud yard-cloud-a" fill="#fff" opacity="0.92">
        <ellipse cx="220" cy="96" rx="58" ry="18" />
        <ellipse cx="256" cy="84" rx="38" ry="18" />
        <ellipse cx="186" cy="88" rx="30" ry="14" />
      </g>
      <g className="yard-cloud yard-cloud-b" fill="#fff" opacity="0.85">
        <ellipse cx="640" cy="64" rx="64" ry="18" />
        <ellipse cx="676" cy="52" rx="40" ry="18" />
        <ellipse cx="604" cy="58" rx="32" ry="13" />
      </g>
      <g className="yard-cloud yard-cloud-c" fill="#fff" opacity="0.8">
        <ellipse cx="1010" cy="196" rx="52" ry="14" />
        <ellipse cx="1040" cy="186" rx="32" ry="14" />
      </g>

      {/* colinas ao fundo */}
      <path d="M0 440 Q180 360 360 420 T720 410 T1060 400 T1200 420 L1200 500 L0 500Z" fill="#a8d894" />
      <path d="M0 470 Q240 410 480 455 T900 445 T1200 460 L1200 520 L0 520Z" fill="#92cc7d" />

      {/* gramado */}
      <rect y="462" width="1200" height="240" fill="url(#yard-grass)" />
      {TUFTS.map((t, i) => (
        <path key={i} d={`M${t.x} ${t.y} l-3 -9 M${t.x} ${t.y} l0 -11 M${t.x} ${t.y} l3 -9`} stroke="#3f8f37" strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* calçada */}
      <rect y="644" width="1200" height="60" fill="#d6d3d1" />
      <rect y="644" width="1200" height="6" fill="#a8a29e" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 110 + 20} y="672" width="70" height="3" fill="#b8b4b0" />
      ))}

      {/* caminho até a porta */}
      <path d="M244 468 L300 468 L338 644 L206 644Z" fill="#ead9b3" />
      {[490, 530, 575, 622].map((y, i) => (
        <rect key={y} x={238 - i * 5} y={y} width={72 + i * 8} height="9" rx="3" fill="#d4bf93" />
      ))}

      {/* casa */}
      <g>
        <rect x="100" y="250" width="340" height="218" fill="#f6e2bd" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x="100" y={266 + i * 21} width="340" height="2" fill="#e6cd9f" />
        ))}
        <rect x="100" y="460" width="340" height="9" fill="#cdb98f" />
        <rect x="362" y="160" width="34" height="84" fill="#a2492a" />
        <rect x="358" y="154" width="42" height="9" fill="#7a3419" />
        <polygon points="76,258 270,134 464,258" fill="#bb552b" />
        <polygon points="76,258 270,134 464,258" fill="none" stroke="#7a3419" strokeWidth="6" strokeLinejoin="round" />
        <circle cx="270" cy="206" r="17" fill="#fff4dc" stroke="#7a3419" strokeWidth="5" />

        {WINDOWS.map(([x, y]) => (
          <g key={x}>
            <rect x={x - 6} y={y - 6} width="86" height="84" rx="4" fill="#fff" />
            <rect x={x} y={y} width="74" height="72" fill="#bfe4f8" />
            <path d={`M${x + 37} ${y} V${y + 72} M${x} ${y + 36} H${x + 74}`} stroke="#fff" strokeWidth="5" />
            <rect x={x - 10} y={y + 74} width="94" height="9" rx="3" fill="#a8522f" />
            <circle cx={x + 12} cy={y + 80} r="5" fill="#f472b6" />
            <circle cx={x + 30} cy={y + 78} r="5" fill="#fbbf24" />
            <circle cx={x + 48} cy={y + 80} r="5" fill="#f87171" />
            <circle cx={x + 64} cy={y + 78} r="5" fill="#c084fc" />
          </g>
        ))}

        <rect x="232" y="346" width="76" height="122" rx="4" fill="#fff" />
        <rect x="240" y="354" width="60" height="114" rx="3" fill="#8b4a2b" />
        <rect x="248" y="364" width="44" height="36" rx="3" fill="#a3603b" />
        <rect x="248" y="408" width="44" height="46" rx="3" fill="#a3603b" />
        <circle cx="286" cy="414" r="4" fill="#fbbf24" />
        <rect x="224" y="466" width="92" height="9" fill="#cdb98f" />
      </g>

      {/* árvore */}
      <g>
        <rect x="1058" y="350" width="34" height="130" fill="#7a4b2a" />
        <path d="M1062 420 L1038 392 M1088 410 L1112 384" stroke="#7a4b2a" strokeWidth="8" strokeLinecap="round" />
        <circle cx="1075" cy="300" r="82" fill="#4a9a3a" />
        <circle cx="1020" cy="340" r="52" fill="#58a845" />
        <circle cx="1132" cy="338" r="52" fill="#58a845" />
        <circle cx="1070" cy="262" r="46" fill="#62b24d" />
        <circle cx="1040" cy="316" r="9" fill="#e11d48" />
        <circle cx="1100" cy="290" r="9" fill="#e11d48" />
        <circle cx="1120" cy="350" r="9" fill="#e11d48" />
      </g>

      {/* cerca (o portão fica aberto no caminho) */}
      <rect y="506" width="1200" height="7" fill="#f1f1ee" />
      <rect y="540" width="1200" height="7" fill="#f1f1ee" />
      {PICKETS.map((x) => (
        <path key={x} d={`M${x} 556 V500 L${x + 8} 490 L${x + 16} 500 V556Z`} fill="#fff" stroke="#d6d3cd" strokeWidth="1.5" />
      ))}
      {[198, 336].map((x) => (
        <g key={x}>
          <rect x={x} y="486" width="14" height="72" rx="2" fill="#f1f1ee" stroke="#d6d3cd" strokeWidth="1.5" />
          <rect x={x - 2} y="480" width="18" height="9" rx="2" fill="#e7e5df" />
        </g>
      ))}

      {/* arbustos e flores na frente da cerca */}
      {[60, 150, 400, 500, 620, 880].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy="566" rx={34 + (i % 2) * 8} ry="22" fill="#3f9b3e" />
          <ellipse cx={x - 14} cy="560" rx="22" ry="16" fill="#4fae48" />
        </g>
      ))}
      {FLOWERS.map((f, i) => (
        <g key={i}>
          <path d={`M${f.x} ${f.y + 12} V${f.y}`} stroke="#3f8f37" strokeWidth="2" />
          <circle cx={f.x} cy={f.y} r="4.6" fill={f.c} />
          <circle cx={f.x} cy={f.y} r="1.7" fill="#fbbf24" />
        </g>
      ))}

      {/* poste de luz */}
      <g>
        <rect x="926" y="424" width="9" height="222" fill="#3f3f46" />
        <rect x="918" y="404" width="26" height="24" rx="5" fill="#27272a" />
        <rect x="922" y="410" width="18" height="14" rx="3" fill="#f5f0dc" />
        <ellipse cx="930" cy="646" rx="16" ry="4" fill="#27272a" opacity="0.6" />
      </g>

      {/* caixa de correio */}
      <g className="yard-mailbox" data-open={open}>
        <ellipse cx="756" cy="645" rx="32" ry="7" fill="#3f8f37" />
        <rect x="748" y="576" width="16" height="70" fill="#8a5a34" />
        <rect x="748" y="576" width="5" height="70" fill="#a57444" />
        <rect x="690" y="506" width="132" height="72" rx="12" fill="#3f73bf" />
        <rect x="690" y="506" width="132" height="14" rx="7" fill="#5b8fdb" />
        <rect x="690" y="566" width="132" height="12" rx="6" fill="#2f5a99" />
        <rect x="704" y="524" width="90" height="28" rx="5" fill="#fff3c4" stroke="#2f5a99" strokeWidth="2" />
        <text x="749" y="544" textAnchor="middle" className="yard-mailbox-name">
          BRUNO
        </text>
        <ellipse className="yard-box-inside" cx="817" cy="542" rx="9" ry="35" fill="#101a2b" />
        <rect className="yard-door" x="812" y="506" width="12" height="72" rx="6" fill="#2f5a99" stroke="#244a80" strokeWidth="1.5" />
        <g className="yard-flag" data-up={flagUp}>
          <rect x="727" y="478" width="6" height="52" fill="#d4d4d8" />
          <rect x="733" y="478" width="26" height="16" rx="2" fill="#dc2626" />
        </g>
      </g>

      {/* carta pousada na caixa, esperando o pássaro */}
      <g className="yard-envelope" data-sealed={sealed}>
        <rect x="738" y="486" width="36" height="24" rx="3" fill="#fff7ed" stroke="#fdba74" strokeWidth="2" />
        <path d="M739 488 L756 500 L773 488" fill="none" stroke="#fdba74" strokeWidth="2" />
        <circle cx="756" cy="500" r="4" fill="#ea580c" />
      </g>

      {/* fumaça da chaminé */}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="yard-smoke" cx="379" cy="150" r={9 + i * 2} fill="#fff" style={{ animationDelay: `${i * 1.4}s` }} />
      ))}

      {/* noite: escurece tudo e acende janelas, poste, estrelas, lua e vagalumes */}
      <rect className="yard-night-dim" width="1200" height="700" fill="#0b1640" />

      <g className="yard-night-only">
        {STARS.map((s, i) => (
          <circle key={i} className="yard-star" cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${s.delay}s` }} />
        ))}
        <circle cx="980" cy="110" r="70" fill="url(#yard-glow)" opacity="0.35" />
        <circle cx="980" cy="110" r="38" fill="#fdf6d8" />
        <circle cx="996" cy="100" r="34" fill="#1a2750" />
        <circle cx="270" cy="400" r="150" fill="url(#yard-glow)" opacity="0.3" />
        {WINDOWS.map(([x, y]) => (
          <g key={x}>
            <rect x={x} y={y} width="74" height="72" fill="#ffd479" />
            <path d={`M${x + 37} ${y} V${y + 72} M${x} ${y + 36} H${x + 74}`} stroke="#fff3cc" strokeWidth="5" />
          </g>
        ))}
        <circle cx="270" cy="206" r="13" fill="#ffd479" />
        <rect x="922" y="410" width="18" height="14" rx="3" fill="#fff0b0" />
        <circle cx="931" cy="418" r="90" fill="url(#yard-glow)" />
        <ellipse cx="931" cy="650" rx="90" ry="14" fill="#ffe9a8" opacity="0.4" />
        {FIREFLIES.map(([x, y, d], i) => (
          <circle key={i} className="yard-firefly" cx={x} cy={y} r="3" fill="#fde68a" style={{ animationDelay: `${d}s` }} />
        ))}
      </g>
    </svg>
  )
}
