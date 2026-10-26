import { GithubIcon, LinkedinIcon, YoutubeIcon } from './icons/BrandIcons'
import { profile } from '../data/placeholders'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer data-panel className="snap-end border-t border-border bg-surface/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <a href="#top" className="font-display text-base font-bold text-text">
          Bruno<span className="text-gradient">Trevizani</span>
        </a>

        <div className="flex items-center gap-5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-text-muted transition-colors hover:text-text"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-text-muted transition-colors hover:text-text"
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href={profile.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="text-text-muted transition-colors hover:text-text"
          >
            <YoutubeIcon size={20} />
          </a>
        </div>

        <p className="text-sm text-text-muted">
          © {year} {profile.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
