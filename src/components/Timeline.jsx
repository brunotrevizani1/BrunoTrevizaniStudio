import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { projects } from '../data/projects'
import { useSiteProgress } from '../state/siteProgress'

// Linha do tempo fixa na esquerda: uma parada por etapa do site (inclusive os quadros dentro de
// Sobre mim: estante de skills e sala de projetos). Os projetos aparecem como sub-paradas quando a
// sala está aberta, e o projeto em que o visitante entrou fica destacado.
const STOPS = [
  { id: 'top', label: 'Tela inicial' },
  { id: 'sobre', label: 'Sobre mim' },
  { id: 'skills', label: 'Skills' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
]
const PROJECT_STOP = 3

// posição fracionária entre as três abas reais (top, sobre, contato), a partir do scroll
function readPanelProgress() {
  const ids = ['top', 'sobre', 'contato']
  const tops = ids.map((id) => {
    const el = document.getElementById(id)
    return el ? el.getBoundingClientRect().top + window.scrollY : 0
  })
  const y = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  if (y >= maxScroll - 2) return ids.length - 1
  let index = 0
  tops.forEach((top, i) => {
    if (top <= y + 2) index = i
  })
  if (index === ids.length - 1) return index
  const span = tops[index + 1] - tops[index]
  return index + (span > 0 ? Math.min(1, (y - tops[index]) / span) : 0)
}

// converte para a posição na linha do tempo: depois de Sobre mim vêm Skills e Projetos
function toTimeline(panel, { shelf }, inProjects) {
  if (inProjects) return PROJECT_STOP
  if (panel <= 0) return 0
  if (panel < 1) return panel
  if (panel === 1) return shelf ? 2 : 1
  return PROJECT_STOP + (panel - 1)
}

export default function Timeline() {
  const [panel, setPanel] = useState(0)
  const site = useSiteProgress()

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPanel(readPanelProgress()))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // depois de sair da sala para baixo a câmera ainda volta da estante à mesa antes de a página seguir para Contato;
  // a linha segura em Projetos nesse intervalo, em vez de recuar para Skills ou Sobre mim
  const [afterRoom, setAfterRoom] = useState(false)
  // subindo de Contato, a página chega em Sobre mim um instante antes de a sala reabrir: segura em Projetos
  const [fromBelow, setFromBelow] = useState(false)
  const holdFromBelow = !site.roomOpen && (panel > 1 || (fromBelow && panel === 1))
  if (holdFromBelow !== fromBelow) setFromBelow(holdFromBelow)

  const inProjects = site.roomOpen || (afterRoom && panel === 1 && site.exitDown) || (fromBelow && panel === 1)
  if (inProjects !== afterRoom) setAfterRoom(inProjects)

  const progress = toTimeline(panel, site, inProjects)
  const current = Math.round(progress)

  // fica num portal para continuar visível por cima da sala secreta (a página por trás fica inerte)
  return createPortal(
    <nav className="timeline" aria-label="Linha do tempo do site" data-room={site.roomOpen}>
      <ol>
        {STOPS.map((stop, index) => (
          <li key={stop.id} className="timeline-item">
            {index < STOPS.length - 1 && (
              <span className="timeline-segment" aria-hidden="true">
                <span className="timeline-fill" style={{ height: `${Math.max(0, Math.min(1, progress - index)) * 100}%` }} />
              </span>
            )}
            <a
              href={`#${stop.id}`}
              className={`timeline-stop${index === current ? ' is-current' : ''}${index < current ? ' is-past' : ''}`}
              aria-current={index === current ? 'location' : undefined}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <span className="timeline-label">{stop.label}</span>
            </a>

            {index === PROJECT_STOP && (
              <div className="timeline-sub" data-open={site.roomOpen}>
                <ol>
                  {projects.map((project) => (
                    <li key={project.id}>
                      <span
                        className={`timeline-substop${site.project === project.id ? ' is-current' : ''}`}
                        aria-current={site.project === project.id ? 'location' : undefined}
                      >
                        <span className="timeline-subdot" aria-hidden="true" />
                        <span className="timeline-sublabel">{project.name}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>,
    document.body,
  )
}
