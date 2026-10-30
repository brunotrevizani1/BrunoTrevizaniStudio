import { forwardRef } from 'react'
import { Camera, Car, Construction, DoorClosed } from 'lucide-react'
import { preloadScene } from './sceneRegistry'

const ICONS = { camera: Camera, car: Car, construction: Construction }

// Detalhes que antecipam o tema do projeto (ficam na folha da porta). Motivos novos: basta
// criar aqui e usar `door.motif` no arquivo de dados; sem motivo a porta fica lisa.
const MOTIFS = {
  photo: () => (
    <>
      <span className="srdoor-onair">Em estúdio</span>
      <span className="srdoor-polaroid" style={{ '--r': '-6deg', left: '14%', top: '40%' }} />
      <span className="srdoor-polaroid" style={{ '--r': '5deg', right: '14%', top: '47%' }} />
    </>
  ),
  garage: () => (
    <>
      <span className="srdoor-slats" />
      <span className="srdoor-box">BOX 02</span>
    </>
  ),
  construction: () => (
    <>
      <span className="srdoor-tape" />
      <span className="srdoor-tape srdoor-tape-b" />
    </>
  ),
}

/** Uma porta do corredor; gerada a partir de uma entrada de data/projects.js. */
const Door = forwardRef(function Door({ project, index, entering, onOpen }, ref) {
  const { door } = project
  const Icon = ICONS[door.icon] ?? DoorClosed
  const Motif = MOTIFS[door.motif]

  return (
    <button
      ref={ref}
      type="button"
      data-motif={door.motif}
      className={`srdoor${entering ? ' is-entering' : ''}`}
      style={{ '--door': door.color, '--trim': door.trim, '--glow': door.glow, '--i': index }}
      aria-label={`Abrir a porta de ${project.name}: ${project.tagline}`}
      onClick={(event) =>
        onOpen(project, event.currentTarget.querySelector('.srdoor-frame').getBoundingClientRect())
      }
      onPointerEnter={() => preloadScene(project.scene)}
      onFocus={() => preloadScene(project.scene)}
    >
      <span className="srdoor-lamp" aria-hidden="true">
        <span className="srdoor-lamp-bulb" />
      </span>
      <span className="srdoor-frame" aria-hidden="true">
        <span className="srdoor-room" />
        <span className="srdoor-leaf">
          <span className="srdoor-panel" />
          <span className="srdoor-panel srdoor-panel-b" />
          <Icon className="srdoor-icon" size={30} strokeWidth={1.8} />
          {Motif && <Motif />}
          {door.note && <span className="srdoor-note">{door.note}</span>}
          <span className="srdoor-knob" />
        </span>
      </span>
      <span className="srdoor-plate">
        <em>Porta {index + 1}</em>
        <strong>{project.name}</strong>
      </span>
    </button>
  )
})

export default Door
