import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, YoutubeIcon } from './icons/BrandIcons'
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

      <div className="hero-content relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col items-start gap-5">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Olá, eu sou o Bruno</span>

          <h1 className="toon-text font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Bem-vindo ao <span className="text-gradient">{profile.name} Studio</span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-text-muted">
            Quer conhecer um pouco mais sobre minha história e como surgiu minha paixão pela tecnologia? Aqui compartilho experiências, aprendizados e objetivos!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#sobre"
              className="toon-btn"
            >
              Começar a viagem
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              className="toon-btn"
            >
              Entrar em contato
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-text-muted transition-colors hover:text-text"
            >
              <GithubIcon size={22} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-text-muted transition-colors hover:text-text"
            >
              <LinkedinIcon size={22} />
            </a>
            <a
              href={profile.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-text-muted transition-colors hover:text-text"
            >
              <YoutubeIcon size={22} />
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
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
      </div>
    </section>
  )
}
