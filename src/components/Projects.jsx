import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from './icons/BrandIcons'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Tag from './ui/Tag'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { fallbackProjects } from '../data/placeholders'

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [loading, setLoading] = useState(true)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const trackRef = useRef(null)
  const { ref: revealRef, isVisible } = useScrollReveal({ threshold: 0.1 })

  useEffect(() => {
    let isMounted = true

    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')

        if (!isMounted) return

        if (!response.ok) {
          console.error('[projects] falha ao buscar da API, usando fallback:', response.status)
        } else {
          const data = await response.json()
          if (data && data.length > 0) {
            setProjects(data)
          }
        }
      } catch (error) {
        if (!isMounted) return
        console.error('[projects] falha ao buscar da API, usando fallback:', error.message)
      }

      if (isMounted) setLoading(false)
    }

    fetchProjects()
    return () => {
      isMounted = false
    }
  }, [])

  const isCarousel = projects.length > 3

  function updateScrollState() {
    const el = trackRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    if (loading || !isCarousel) return
    updateScrollState()
  }, [loading, isCarousel, projects])

  function scrollByPage(direction) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.92, behavior: 'smooth' })
  }

  return (
    <Section id="projetos">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Projetos"
          title="Trabalhos recentes"
          description="Uma seleção de projetos que desenvolvi. Os dados vêm do banco — enquanto ele não é configurado, você está vendo exemplos."
        />

        {!loading && isCarousel && (
          <div className="flex items-center gap-2 pb-12">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              aria-label="Projetos anteriores"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent/50 hover:bg-surface-hover disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label="Próximos projetos"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent/50 hover:bg-surface-hover disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div ref={revealRef}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-surface" />
            ))}
          </div>
        ) : isCarousel ? (
          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
                className={`w-[85%] shrink-0 snap-start transition-all duration-500 ease-out sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
                className={`transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-accent/50">
      <div className="flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-accent-from/20 to-accent-to/20">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-display text-4xl font-bold text-gradient">
            {project.title?.[0] ?? '·'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-lg font-semibold text-text">{project.title}</h3>
        <p className="flex-1 text-sm text-text-muted">{project.description}</p>

        {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <ExternalLink size={16} />
              Ver projeto
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
            >
              <GithubIcon size={16} />
              Código
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
