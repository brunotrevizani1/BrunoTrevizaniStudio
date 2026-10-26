import { Fragment, useCallback, useEffect, useRef } from 'react'
import { Code2, PenTool } from 'lucide-react'
import Door from './Door'
import { projects } from '../../data/projects'

/** Corredor da sala secreta: uma porta por projeto da lista (lista vertical no celular). */
export default function Hub({ enteringId, focusId, onOpen }) {
  const refs = useRef(new Map())

  // focusId: undefined = não mexe no foco; null = primeira porta; id = porta de onde o visitante voltou
  useEffect(() => {
    if (focusId === undefined) return
    const target = (focusId && refs.current.get(focusId)) || refs.current.get(projects[0]?.id)
    target?.focus()
  }, [focusId])

  const handleKeyDown = useCallback((event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    const buttons = projects.map((project) => refs.current.get(project.id)).filter(Boolean)
    const index = buttons.indexOf(document.activeElement)
    if (index === -1) return
    event.preventDefault()
    buttons[(index + step + buttons.length) % buttons.length].focus()
  }, [])

  return (
    <div className="srhub">
      <div className="srhub-wall" aria-hidden="true" />
      <div className="srhub-ceiling" aria-hidden="true" />
      <div className="srhub-wainscot" aria-hidden="true" />
      <div className="srhub-frame srhub-frame-l" aria-hidden="true">
        <Code2 size={44} strokeWidth={1.5} />
        <small>{'{ código }'}</small>
      </div>
      <div className="srhub-frame srhub-frame-r" aria-hidden="true">
        <PenTool size={44} strokeWidth={1.5} />
        <small>rascunhos</small>
      </div>
      <div className="srhub-title">
        <span className="srhub-eyebrow">Sala secreta</span>
        <h2>Escolha uma porta</h2>
        <div className="srhub-orn" aria-hidden="true">✦</div>
        <p>Cada porta guarda um projeto. Pode entrar!</p>
      </div>

      <ul className="srhub-doors" onKeyDown={handleKeyDown}>
        <li className="srhub-sconce" role="presentation" style={{ '--i': 0 }}>
          <span className="srhub-flame" />
        </li>
        {projects.map((project, index) => (
          <Fragment key={project.id}>
            <li>
              <Door
                ref={(node) => {
                  if (node) refs.current.set(project.id, node)
                  else refs.current.delete(project.id)
                }}
                project={project}
                index={index}
                entering={enteringId === project.id}
                onOpen={onOpen}
              />
            </li>
            <li className="srhub-sconce" role="presentation" style={{ '--i': index + 1 }}>
              <span className="srhub-flame" />
            </li>
          </Fragment>
        ))}
      </ul>
      <div className="srhub-floor" aria-hidden="true">
        <div className="srhub-runner" />
      </div>
    </div>
  )
}
