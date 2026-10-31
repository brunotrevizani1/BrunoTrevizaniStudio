import { useEffect, useId, useRef, useState } from 'react'
import { FoamLayer, WashOverlay } from './wash'
import ProjectInfo from '../../ProjectInfo'
import './primegarage.css'

// Bolhas de espuma sobre a lataria: posição/tamanho em % do carro e atraso de saída.
const FOAM = [
  [6, 44, 11, 0], [16, 26, 13, 60], [28, 16, 12, 120], [40, 10, 14, 30], [52, 12, 13, 150], [64, 16, 12, 90],
  [76, 28, 13, 40], [88, 42, 11, 180], [10, 60, 12, 100], [22, 48, 14, 210], [36, 38, 12, 70], [48, 34, 14, 160],
  [60, 38, 13, 20], [72, 48, 12, 130], [84, 58, 12, 190], [30, 66, 11, 50], [54, 62, 12, 110], [68, 66, 11, 80],
]

// Lavagem: primeiro o sabão, depois a água. A etapa fecha em 100% com 92% da lataria feita (ninguém
// precisa caçar o último cantinho) e o resto se completa sozinho.
const STAGE_DONE_AT = 0.92
const STAGE_TOOL = { soap: 'soap', rinse: 'water', done: null }

const SPARKLES = [
  [4, 30, 26, 0], [18, -6, 20, 0.3], [34, 18, 30, 0.6], [50, -14, 22, 0.15], [66, 14, 28, 0.45], [82, -4, 20, 0.75], [96, 34, 26, 0.3],
]

const BODY =
  'M24 150 Q22 124 52 118 L120 108 Q158 66 214 62 L350 62 Q404 64 440 106 L504 114 Q540 120 542 146 L542 162 Q542 168 534 168 L32 168 Q24 168 24 160 Z'

function Car() {
  return (
    <svg className="pg-car-svg" viewBox="0 0 566 214" aria-hidden="true">
      <defs>
        <clipPath id="pg-body-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="pg-paint" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a9c7e" />
          <stop offset="0.55" stopColor="#2b6b55" />
          <stop offset="1" stopColor="#173f31" />
        </linearGradient>
        <linearGradient id="pg-glass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d9f0f7" />
          <stop offset="1" stopColor="#5d8599" />
        </linearGradient>
      </defs>

      <ellipse cx="283" cy="206" rx="262" ry="8" fill="#000" opacity="0.3" />

      <g className="pg-shine">
        <path d={BODY} fill="url(#pg-paint)" />
        {/* vincos e reflexos da lataria */}
        <path d="M60 134 Q290 122 520 134" stroke="#fff" strokeWidth="3" opacity="0.28" fill="none" />
        <path d="M60 152 H520" stroke="#0f2d24" strokeWidth="2" opacity="0.45" />
        <path d="M150 106 Q170 74 216 72 L276 72 L276 106 Z" fill="url(#pg-glass)" />
        <path d="M288 72 L350 72 Q384 74 414 106 L288 106 Z" fill="url(#pg-glass)" />
        <path d="M282 72 V160" stroke="#0f2d24" strokeWidth="2" opacity="0.55" />
        <rect x="244" y="120" width="26" height="6" rx="3" fill="#cfe9dc" opacity="0.9" />
        <rect x="322" y="120" width="26" height="6" rx="3" fill="#cfe9dc" opacity="0.9" />
        <path d="M412 104 l22 -4 l4 8 l-22 4 Z" fill="#1f5442" />
        <rect x="28" y="124" width="18" height="12" rx="3" fill="#e5484d" />
        <path d="M508 122 h28 q4 0 4 5 v5 h-32 Z" fill="#fff7c2" className="pg-headlight" />
        <rect x="518" y="146" width="20" height="8" rx="2" fill="#f3d36b" />
        <rect x="36" y="160" width="494" height="8" fill="#0f2d24" opacity="0.5" />

        <g clipPath="url(#pg-body-clip)">
          <g transform="skewX(-22)">
            <rect className="pg-gloss" x="-120" y="40" width="80" height="170" fill="#fff" opacity="0.55" />
          </g>
        </g>
      </g>

      {[140, 436].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="168" r="40" fill="#0b1b15" />
          <circle cx={cx} cy="170" r="34" fill="#151515" />
          <circle cx={cx} cy="170" r="21" fill="#d3d8db" />
          <circle cx={cx} cy="170" r="21" fill="none" stroke="#7b848a" strokeWidth="2" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <rect
              key={angle}
              x={cx - 2}
              y="150"
              width="4"
              height="16"
              fill="#7b848a"
              transform={`rotate(${angle} ${cx} 170)`}
            />
          ))}
          <circle cx={cx} cy="170" r="5" fill="#4b5359" />
        </g>
      ))}
    </svg>
  )
}

function Shelf({ active, next, onToggle }) {
  return (
    <svg
      className={`pg-shelf pg-tool${next ? ' is-next' : ''}`}
      viewBox="0 0 250 150"
      fill="none"
      role="button"
      tabIndex={0}
      aria-label="Pegar o sabão"
      aria-pressed={active}
      onClick={onToggle}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onToggle())}
    >
      <rect x="4" y="62" width="242" height="8" rx="2" fill="#8a8f93" />
      <rect x="4" y="132" width="242" height="8" rx="2" fill="#8a8f93" />
      {[
        [14, 24, 22, 38, '#2f80ed'], [42, 18, 20, 44, '#e5484d'], [68, 26, 24, 36, '#f2c94c'],
        [100, 20, 22, 42, '#27ae60'], [128, 28, 30, 34, '#9b51e0'],
      ].map(([x, y, w, h, fill]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill={fill} />
          <rect x={x + w / 2 - 4} y={y - 6} width="8" height="7" rx="2" fill="#2b2b2b" />
          <rect x={x + 3} y={y + h / 2 - 6} width={w - 6} height="12" rx="2" fill="#fff" opacity="0.8" />
        </g>
      ))}
      <path d="M180 62 l6 -34 h38 l6 34 Z" fill="#f2c94c" />
      <path d="M184 40 h46" stroke="#b58a00" strokeWidth="3" />
      <path d="M20 132 l5 -40 h40 l5 40 Z" fill="#2f80ed" />
      <path d="M90 132 l5 -40 h40 l5 40 Z" fill="#e5484d" />
      <rect x="160" y="112" width="32" height="20" rx="5" fill="#f2c94c" />
      <rect x="200" y="106" width="30" height="26" rx="5" fill="#f5e6a8" />
    </svg>
  )
}

function Hose() {
  return (
    <svg className="pg-hose" viewBox="0 0 160 260" aria-hidden="true" fill="none">
      <circle cx="46" cy="44" r="34" fill="#374151" />
      <circle cx="46" cy="44" r="24" fill="#f59e0b" />
      <circle cx="46" cy="44" r="8" fill="#374151" />
      <path d="M72 52 C120 70 140 120 112 170 C96 200 60 214 74 240" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />
      <rect x="64" y="236" width="20" height="14" rx="4" fill="#374151" />
    </svg>
  )
}

// lavadora de alta pressão com a pistola e a mangueira enroladas
function Washer({ active, next, onToggle, washerRef }) {
  return (
    <svg
      ref={washerRef}
      className={`pg-washer pg-tool${next ? ' is-next' : ''}`}
      viewBox="0 0 130 160"
      fill="none"
      role="button"
      tabIndex={0}
      aria-label="Pegar a lavadora de alta pressão"
      aria-pressed={active}
      onClick={onToggle}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onToggle())}
    >
      <ellipse cx="62" cy="152" rx="56" ry="6" fill="#000" opacity="0.25" />
      <path d="M28 40 V22 q0 -8 8 -8 h52 q8 0 8 8 v18" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
      <rect x="18" y="38" width="88" height="92" rx="12" fill="#facc15" />
      <rect x="18" y="104" width="88" height="26" rx="8" fill="#ca8a04" />
      <rect x="32" y="52" width="60" height="34" rx="6" fill="#1f2937" />
      <circle cx="46" cy="69" r="7" fill="#34d399" />
      <rect x="60" y="62" width="24" height="5" rx="2" fill="#6b7280" />
      <rect x="60" y="72" width="16" height="5" rx="2" fill="#6b7280" />
      <circle cx="34" cy="136" r="14" fill="#18181b" />
      <circle cx="34" cy="136" r="6" fill="#9ca3af" />
      <circle cx="92" cy="136" r="14" fill="#18181b" />
      <circle cx="92" cy="136" r="6" fill="#9ca3af" />
      <circle cx="106" cy="86" r="16" stroke="#2563eb" strokeWidth="7" />
      <path d="M118 90 q12 14 2 40" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
      <path d="M112 130 h16 v-8 h-6 l-4 -6 h-6 Z" fill="#374151" />
    </svg>
  )
}

function Tires() {
  return (
    <svg className="pg-tires" viewBox="0 0 120 110" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx="60" cy={86 - i * 26} rx="52" ry="16" fill="#18181b" />
          <ellipse cx="60" cy={80 - i * 26} rx="52" ry="16" fill="#27272a" />
          <ellipse cx="60" cy={80 - i * 26} rx="26" ry="7" fill="#0b0b0d" />
        </g>
      ))}
    </svg>
  )
}

/** Box de estética automotiva do PrimeGarage: portão que sobe, espuma saindo e carro brilhando. */
export default function PrimeGarageScene({ project }) {
  const titleId = useId()
  const washerRef = useRef(null)
  const foamRef = useRef(null)
  const [tool, setTool] = useState(null) // 'soap' | 'water' | null
  const [stage, setStage] = useState('soap') // 'soap' | 'rinse' | 'done'
  const [coverage, setCoverage] = useState(0) // fração da lataria com espuma

  const finished = stage === 'soap' ? coverage : 1 - coverage
  const percent = Math.min(100, Math.floor((finished / STAGE_DONE_AT) * 100))
  const nextTool = tool ? null : STAGE_TOOL[stage]

  // cada etapa só aceita a sua ferramenta
  const pick = (name) => {
    if (name === STAGE_TOOL[stage]) setTool((current) => (current === name ? null : name))
  }

  useEffect(() => {
    if (percent < 100 || stage === 'done') return
    setTool(null)
    if (stage === 'soap') {
      foamRef.current.fill()
      setStage('rinse')
    } else {
      foamRef.current.clear()
      setStage('done')
    }
  }, [percent, stage])

  let hint = 'Comece pelo sabão: clique na prateleira.'
  if (tool === 'soap') hint = 'Sabão na mão! Segure e arraste sobre o carro.'
  else if (tool === 'water') hint = 'Lavadora ligada! Segure e arraste para tirar a espuma.'
  else if (stage === 'rinse') hint = 'Sabão completo! Agora pegue a lavadora.'

  // com ferramenta na mão, Esc só larga a ferramenta: não pode chegar na sala, que sairia do cenário
  useEffect(() => {
    if (!tool) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setTool(null)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [tool])

  return (
    <section className="pg" data-tool={tool ?? undefined} data-stage={stage} aria-labelledby={titleId}>
      <div className="pg-wall" aria-hidden="true" />
      <div className="pg-tube" aria-hidden="true" />
      <div className="pg-floor" aria-hidden="true" />

      <div className="pg-decor" aria-hidden="true">
        <div className="pg-neon">
          <span>Prime</span>
          <span>Garage</span>
        </div>
        <div className="pg-poster">
          <img src="/primeGarage.jpg" alt="" />
        </div>
        <Hose />
        <Tires />
        <div className="pg-menu">
          <strong>Serviços</strong>
          <ul>
            <li>Lavagem completa</li>
            <li>Polimento</li>
            <li>Cera e brilho</li>
            <li>Higienização</li>
            <li>Vitrificação</li>
          </ul>
        </div>
      </div>

      <div className="pg-car">
        <Car />
        {/* espuma passada pelo visitante: recortada no formato da lataria */}
        <FoamLayer ref={foamRef} bodyPath={BODY} onCoverage={setCoverage} />
        <div className="pg-foam" aria-hidden="true">
          {FOAM.map(([x, y, size, delay]) => (
            <i key={`${x}-${y}`} style={{ '--x': `${x}%`, '--y': `${y}%`, '--s': `${size}%`, '--d': `${delay}ms` }} />
          ))}
        </div>

        {stage === 'done' && (
          <>
            <div className="pg-sparkles" aria-hidden="true">
              {SPARKLES.map(([x, y, size, delay]) => (
                <svg
                  key={x}
                  viewBox="-10 -10 20 20"
                  style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }}
                >
                  <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" />
                </svg>
              ))}
            </div>
            <div className="pg-done" role="status">
              <strong>Carro brilhando!</strong>
              <p>Lavagem completa, do sabão ao enxágue. Pode vir buscar!</p>
              <button
                type="button"
                className="toon-btn"
                onClick={() => setStage('soap')}
              >
                Lavar de novo
              </button>
            </div>
          </>
        )}
      </div>

      <article className="pg-ticket">
        <span className="pg-clip" aria-hidden="true" />
        <ProjectInfo project={project} titleId={titleId} eyebrow="Ficha de serviço · Box 02">
          <p className="pg-ticket-line" aria-hidden="true">
            <span>Serviço</span>
            <span>{project.tagline}</span>
          </p>
        </ProjectInfo>
      </article>

      {stage !== 'done' && (
        <div className="pg-hint">
          <p role="status">{hint}</p>
          {(tool || percent > 0) && (
            <div className="pg-meter">
              <span
                className="pg-meter-track"
                role="progressbar"
                aria-label={stage === 'soap' ? 'Carro ensaboado' : 'Carro enxaguado'}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <i style={{ width: `${percent}%` }} />
              </span>
              <strong>{percent}%</strong>
            </div>
          )}
          {tool && (
            <button type="button" className="pg-drop" onClick={() => setTool(null)}>
              Soltar <kbd>Esc</kbd>
            </button>
          )}
        </div>
      )}

      {tool && <WashOverlay tool={tool} washerRef={washerRef} foamRef={foamRef} onDrop={() => setTool(null)} />}

      {/* ferramentas: clicar escolhe; depois é segurar e arrastar sobre o carro. Para largar: botão
          Soltar, Esc, botão direito do mouse ou clicar de novo na ferramenta (ficam acima da mira) */}
      <div className="pg-tools">
        <Shelf active={tool === 'soap'} next={nextTool === 'soap'} onToggle={() => pick('soap')} />
        <Washer washerRef={washerRef} active={tool === 'water'} next={nextTool === 'water'} onToggle={() => pick('water')} />
      </div>

      <div className="pg-water" aria-hidden="true" />
      <div className="pg-door" aria-hidden="true" />
    </section>
  )
}
