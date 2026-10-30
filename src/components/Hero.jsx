import { useState } from 'react'
import SkyCord from './icons/SkyCord'
import CityScene from './CityScene'
import { useLamp } from '../context/LampContext'
import { profile } from '../data/placeholders'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

// avião de desenho puxando uma faixa; o texto é um <text> do próprio SVG, então escala junto
function PlaneBanner({ text }) {
  const ink = { stroke: '#1e1b3a', strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 1180 190" className="hero-plane-svg">
      <g className="hero-plane-banner">
        <path d="M6 40 Q70 22 130 40 T250 40 T370 40 T490 40 T610 40 T730 40 L730 150 Q670 168 610 150 T490 150 T370 150 T250 150 T130 150 T6 150 L40 95 Z" fill="#ffffff" {...ink} />
        <text
          x="395"
          y="112"
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="700"
          fontSize="58"
          fill="#1e1b3a"
          textLength="620"
          lengthAdjust="spacingAndGlyphs"
        >
          Bem-vindo ao <tspan fill="#ea580c">{text}</tspan>
        </text>
      </g>
      <path d="M730 95 Q780 95 830 100" fill="none" stroke="#1e1b3a" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(830 20)">
        <path d="M22 66 L2 14 L44 14 L84 62 Z" fill="#ea580c" {...ink} />
        <path d="M0 76 Q0 52 30 52 L246 52 Q326 52 326 88 Q326 124 246 124 L30 124 Q0 124 0 100 Z" fill="#fb923c" {...ink} />
        <path d="M110 108 L84 150 L176 150 L206 108 Z" fill="#fdba74" {...ink} />
        <ellipse cx="206" cy="82" rx="28" ry="19" fill="#bfe3ff" {...ink} />
        <path d="M40 98 H290" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <g className="hero-plane-prop">
          <ellipse cx="334" cy="88" rx="6" ry="42" fill="#1e1b3a" />
        </g>
      </g>
    </svg>
  )
}

// outdoor menor, só com uma frase; clicar também dá a volta no lugar
function SideBillboard({ text, className }) {
  const [spinning, setSpinning] = useState(false)
  return (
    <div className={`hero-billboard hero-billboard-side shrink-0 ${className}`}>
      <span className="hero-billboard-legs" aria-hidden="true">
        <i />
      </span>
      <span className="hero-billboard-deck" aria-hidden="true" />
      <button
        type="button"
        className={`hero-photo${spinning ? ' is-spinning' : ''}`}
        onClick={() => setSpinning(true)}
        onAnimationEnd={(event) => event.target === event.currentTarget && setSpinning(false)}
        aria-label="Girar o outdoor"
      >
        <span className="hero-billboard-lamps" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="hero-sign">{text}</span>
      </button>
    </div>
  )
}

export default function Hero() {
  const [photoFailed, setPhotoFailed] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const showPhoto = Boolean(profile.photoUrl) && !photoFailed
  const { isOn } = useLamp()
  const isNight = !isOn

  return (
    <section
      id="top"
      data-panel
      data-night={isNight}
      className="hero-scope relative flex min-h-dvh snap-start items-center overflow-hidden py-12"
    >
      <CityScene isNight={isNight} />

      {/* corda no canto superior direito: puxar troca o dia pela noite */}
      <SkyCord style={{ right: 'clamp(20px, 4vw, 64px)', top: 0 }} />

      <h1 className="sr-only">Bem-vindo ao {profile.name} Studio</h1>

      {/* avião com faixa: cruza a tela da esquerda pra direita e, ao sair, volta pela esquerda */}
      <div className="hero-content hero-plane-lane" aria-hidden="true">
        <div className="hero-plane">
          <PlaneBanner text={`${profile.name} Studio`} />
        </div>
      </div>

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-6xl items-start justify-center gap-6 px-6 pt-24 lg:gap-10">
        <SideBillboard text="Quer conhecer minha história?" className="hero-billboard-left hidden md:block" />
        <div className="flex justify-center">
          {/* outdoor na frente dos prédios: sobe do pé da tela; as colunas descem até o fim da aba */}
          <div className="hero-billboard shrink-0">
            <span className="hero-billboard-legs" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="hero-billboard-deck" aria-hidden="true" />

            {/* clicar no painel faz ele dar uma volta no lugar */}
            <button
              type="button"
              className={`hero-photo${spinning ? ' is-spinning' : ''}`}
              onClick={() => setSpinning(true)}
              onAnimationEnd={(event) => event.target === event.currentTarget && setSpinning(false)}
              aria-label="Girar o outdoor"
            >
              <span className="hero-billboard-lamps" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {showPhoto ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  onError={() => setPhotoFailed(true)}
                  draggable={false}
                  className="hero-photo-img"
                />
              ) : (
                <span className="hero-photo-img flex items-center justify-center bg-surface font-display text-5xl font-bold text-gradient">
                  {getInitials(profile.name)}
                </span>
              )}
            </button>
          </div>
        </div>
        <SideBillboard text="Aqui apresento um pouco sobre minha vida e aprendizados!" className="hero-billboard-right hidden md:block" />
      </div>
    </section>
  )
}
