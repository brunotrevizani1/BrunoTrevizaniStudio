import { useEffect, useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons/BrandIcons'
import LockIntro from './LockIntro'
import PrivateTerminal from './PrivateTerminal'
import { ClosedPadlock } from './icons/Padlocks'
import { profile } from '../data/placeholders'

const reasons = [
  'Projeto desenvolvido sob contrato, com código de propriedade do cliente.',
  'Contém regras de negócio e integrações que não podem ser expostas.',
  'Você pode ver o projeto funcionando pelo botão "Ver projeto" no card.',
]

function LockedSeal() {
  return (
    <div className="animate-fade-in-up relative flex h-40 w-40 items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        fill="none"
        className="animate-spin-slow absolute inset-0 h-full w-full text-accent/50"
        aria-hidden="true"
      >
        <circle cx="80" cy="80" r="77" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 9" />
      </svg>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        className="animate-spin-slow-reverse absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-red-400/60"
        aria-hidden="true"
      >
        <circle cx="80" cy="80" r="77" stroke="currentColor" strokeWidth="2" strokeDasharray="36 12 6 12" />
      </svg>
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-border bg-surface">
        <ClosedPadlock className="animate-lock-shake h-14 w-14 text-accent" />
      </div>
    </div>
  )
}

export default function PrivateRepo() {
  const [phase, setPhase] = useState('locked')

  useEffect(() => {
    if (phase !== 'opening') return
    const timer = setTimeout(() => setPhase('open'), 1300)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = `Código privado · ${profile.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-grid px-6 py-12 lg:h-dvh lg:py-8">
      {phase !== 'open' && (
        <LockIntro phase={phase} onUnlock={() => setPhase('opening')} />
      )}
      <div className="caution-tape absolute inset-x-0 top-0 h-3 opacity-90" aria-hidden="true" />
      <div className="caution-tape absolute inset-x-0 bottom-0 h-3 opacity-90" aria-hidden="true" />

      <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-14">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:justify-between lg:text-left">
        <h1
          className="animate-fade-in-up font-display text-4xl font-bold leading-tight text-text sm:text-5xl"
          style={{ animationDelay: '100ms' }}
        >
          Este código é <span className="text-gradient">privado</span>
        </h1>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <div className="shrink-0">
            <LockedSeal />
          </div>
          <p
            className="animate-fade-in-up max-w-sm text-base text-text-muted sm:text-lg"
            style={{ animationDelay: '150ms' }}
          >
            Este trabalho não possui código aberto no GitHub. O projeto está no ar e funcionando,
            mas o repositório é fechado.
          </p>
        </div>

        <div
          className="animate-fade-in-up flex flex-col items-center gap-5 lg:items-start"
          style={{ animationDelay: '400ms' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <ArrowLeft size={18} />
              Voltar para o início
            </a>
            <a
              href="/#contato"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface"
            >
              <Mail size={18} />
              Falar comigo
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">Veja meus projetos abertos:</span>
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
          </div>
        </div>
        </div>

        <div className="flex flex-col gap-5">
          <PrivateTerminal active={phase === 'open'} />

          <ul
            className="animate-fade-in-up w-full space-y-2.5 text-left"
            style={{ animationDelay: '300ms' }}
          >
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-from to-accent-to" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
