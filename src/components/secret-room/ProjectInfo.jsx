import { ExternalLink, Lock } from 'lucide-react'
import { GithubIcon } from '../icons/BrandIcons'
import { codeLink } from '../../data/projects'
import { UNDER_CONSTRUCTION_ROUTE } from '../../data/placeholders'

/** Botões "Ver projeto" / "Ver código" iguais para todos os cenários. */
export function ProjectActions({ project }) {
  if (project.placeholder) return null

  // Sem link no ar o projeto ainda está em obras: leva para a tela de construção (como no card).
  const hasLive = Boolean(project.liveUrl) && project.liveUrl !== '#'
  const code = codeLink(project)

  return (
    <div className="pinfo-actions">
      <a
        className="pinfo-btn pinfo-btn-primary"
        href={hasLive ? project.liveUrl : UNDER_CONSTRUCTION_ROUTE}
        {...(hasLive && { target: '_blank', rel: 'noreferrer' })}
      >
        <ExternalLink size={16} aria-hidden="true" />
        Ver projeto
      </a>
      {code && (
        <a
          className="pinfo-btn"
          href={code.href}
          {...(code.external && { target: '_blank', rel: 'noreferrer' })}
        >
          {project.privateCode ? <Lock size={16} aria-hidden="true" /> : <GithubIcon size={16} />}
          Ver código
        </a>
      )}
    </div>
  )
}

export function TechList({ tech }) {
  if (!tech?.length) return null
  return (
    <ul className="pinfo-tech" aria-label="Tecnologias usadas">
      {tech.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/**
 * Bloco de informações do projeto: nome, descrição, tecnologias e botões. Cada cenário o
 * coloca dentro do objeto que combina com ele (polaroid, ficha de serviço...) e ajusta as
 * cores pelas variáveis CSS --pinfo-*.
 */
export default function ProjectInfo({ project, titleId, eyebrow, children }) {
  return (
    <div className="pinfo">
      {eyebrow && <p className="pinfo-eyebrow">{eyebrow}</p>}
      <h2 id={titleId} className="pinfo-title">
        {project.name}
      </h2>
      <p className="pinfo-desc">{project.description}</p>
      {children}
      <TechList tech={project.tech} />
      <ProjectActions project={project} />
    </div>
  )
}
