import { useEffect } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import Excavator from './Excavator'
import { profile } from '../data/placeholders'
import { backLink } from '../data/projects'

export default function UnderConstruction() {
  const back = backLink()
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = `Em construção · ${profile.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="toon-page relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-12 lg:h-dvh lg:py-8">
      <div className="caution-tape absolute inset-x-0 top-0 h-3 opacity-90" aria-hidden="true" />
      <div className="caution-tape absolute inset-x-0 bottom-0 h-3 opacity-90" aria-hidden="true" />

      <div className="relative flex w-full max-w-2xl flex-col items-center gap-5 text-center">
        <div className="animate-fade-in-up w-full">
          <Excavator />
        </div>

        <h1
          className="toon-text animate-fade-in-up font-display text-4xl font-bold leading-tight sm:text-5xl"
          style={{ animationDelay: '100ms' }}
        >
          Projeto em <span className="text-gradient">construção</span>
        </h1>

        <p
          className="animate-fade-in-up max-w-md text-base text-text-muted sm:text-lg"
          style={{ animationDelay: '150ms' }}
        >
          Este projeto ainda não tem uma versão no ar. A obra está a todo vapor, volte em breve!
        </p>

        <div
          className="animate-fade-in-up w-full max-w-sm"
          style={{ animationDelay: '200ms' }}
          role="progressbar"
          aria-label="Obras em andamento"
        >
          <div className="toon-track">
            <div className="build-progress h-full rounded-full bg-[#fb923c]">
              <div className="build-stripes h-full w-full rounded-full" />
            </div>
          </div>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-text-muted">
            Obras em andamento
          </p>
        </div>

        <div
          className="animate-fade-in-up flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '250ms' }}
        >
          <a
            href={back.href}
            className="toon-btn"
          >
            <ArrowLeft size={18} />
            {back.label}
          </a>
          <a
            href="/#contato"
            className="toon-btn"
          >
            <Mail size={18} />
            Falar comigo
          </a>
        </div>
      </div>
    </main>
  )
}
