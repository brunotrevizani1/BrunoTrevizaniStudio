import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon, YoutubeIcon } from './icons/BrandIcons'
import DeskLamp from './icons/DeskLamp'
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
  const showPhoto = Boolean(profile.photoUrl) && !photoFailed

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-grid pt-24"
    >
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text">
            Bem-vindo ao{' '}
            <span className="text-gradient">{profile.name} Studio</span>
          </h1>

          <p className="font-display text-xl sm:text-2xl font-medium text-text-muted">
            {profile.title}
          </p>

          <p className="max-w-xl text-base sm:text-lg text-text-muted">{profile.tagline}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projetos"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Ver projetos
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface"
            >
              Entrar em contato
            </a>
          </div>

          <div className="flex items-center gap-4 pt-4">
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
          <div className="flex items-end">
            <div className="relative shrink-0 sm:-mr-6 lg:-mr-12 xl:-mr-16">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-from to-accent-to blur-2xl opacity-40"
                aria-hidden="true"
              />
              {showPhoto ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  onError={() => setPhotoFailed(true)}
                  className="relative h-56 w-56 sm:h-72 sm:w-72 rounded-full border border-border object-cover object-[50%_30%]"
                />
              ) : (
                <div className="relative flex h-56 w-56 sm:h-72 sm:w-72 items-center justify-center rounded-full border border-border bg-surface font-display text-6xl sm:text-7xl font-bold text-gradient">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>

            <DeskLamp className="hidden sm:block h-72 sm:h-[26rem] w-auto shrink-0 text-text-muted/80" />
          </div>
        </div>
      </div>
    </section>
  )
}
