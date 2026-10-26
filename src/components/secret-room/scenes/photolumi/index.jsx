import { useId } from 'react'
import ProjectInfo from '../../ProjectInfo'
import './photolumi.css'

// Fotos do varal: gradientes simples, exceto a primeira, que usa a imagem do projeto.
const PHOTOS = ['is-logo', 'is-sunset', 'is-portrait', 'is-hills', 'is-flower', 'is-city', 'is-beach']

function Tripod() {
  return (
    <svg className="pl-tripod" viewBox="0 0 200 330" fill="none">
      <ellipse cx="100" cy="316" rx="82" ry="9" fill="#000" opacity="0.18" />
      <g stroke="#2b2b2b" strokeWidth="7" strokeLinecap="round">
        <line x1="100" y1="168" x2="34" y2="314" />
        <line x1="100" y1="168" x2="100" y2="318" />
        <line x1="100" y1="168" x2="166" y2="314" />
      </g>
      <rect x="92" y="150" width="16" height="30" rx="4" fill="#1a1a1a" />
      <rect x="38" y="60" width="124" height="86" rx="12" fill="#2a2a2a" />
      <rect x="38" y="60" width="124" height="22" rx="10" fill="#3a3a3a" />
      <rect x="62" y="44" width="34" height="20" rx="5" fill="#3a3a3a" />
      <circle cx="136" cy="52" r="6" fill="#cc3b2f" className="pl-led" />
      <circle cx="100" cy="106" r="34" fill="#151515" />
      <circle cx="100" cy="106" r="26" fill="#1f2a3a" stroke="#4a5568" strokeWidth="4" />
      <circle cx="100" cy="106" r="12" fill="#0b1220" />
      <circle cx="92" cy="98" r="5" fill="#fff" opacity="0.7" />
      <rect x="46" y="70" width="14" height="8" rx="3" fill="#ffd36b" />
    </svg>
  )
}

/**
 * Estúdio fotográfico do PhotoLumi: as informações ficam numa tela de cavalete no meio e o
 * estúdio (varal, softbox, tripé, sombrinha, rebatedor, fundo infinito) a cerca por todos os lados.
 */
export default function PhotoLumiScene({ project }) {
  const titleId = useId()

  return (
    <section className="pl" aria-labelledby={titleId}>
      <div className="pl-cyc" aria-hidden="true" />
      <div className="pl-flash" aria-hidden="true" />

      <div className="pl-decor" aria-hidden="true">
        <div className="pl-line">
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" fill="none">
            <path d="M0 4 Q300 46 600 4" stroke="#6b5b3e" strokeWidth="3" />
          </svg>
          {PHOTOS.map((kind, index) => (
            <figure
              key={kind}
              className="pl-photo"
              style={{ '--i': index, '--x': `${3 + index * 14.6}%`, '--sag': `${[10, 22, 30, 32, 30, 22, 10][index]}px` }}
            >
              <span className="pl-pin" />
              <span className={`pl-img ${kind}`} />
            </figure>
          ))}
        </div>

        <div className="pl-softbox">
          <span className="pl-softbox-face" />
          <span className="pl-softbox-pole" />
        </div>
        <div className="pl-beam" />
        <Tripod />
        <div className="pl-umbrella">
          <span className="pl-umbrella-canopy" />
          <span className="pl-umbrella-pole" />
        </div>
        <div className="pl-reflector">
          <span className="pl-reflector-disc" />
          <span className="pl-reflector-pole" />
        </div>
      </div>

      <article className="pl-easel">
        <span className="pl-clamp" aria-hidden="true" />
        <div className="pl-board">
          {project.image && <img className="pl-shot" src={project.image} alt={`Logo do ${project.name}`} />}
          <ProjectInfo project={project} titleId={titleId} eyebrow={project.tagline} />
        </div>
        <span className="pl-tray" aria-hidden="true" />
        <div className="pl-legs" aria-hidden="true">
          <i className="pl-leg-back" />
          <i className="pl-leg-l" />
          <i className="pl-leg-r" />
        </div>
      </article>
    </section>
  )
}
