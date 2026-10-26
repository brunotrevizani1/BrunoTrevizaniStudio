import { useId } from 'react'
import Excavator from '../../../Excavator'
import ProjectInfo from '../../ProjectInfo'
import './under-construction.css'

/**
 * Cenário padrão: canteiro de obras com a MESMA escavadeira da tela /em-construcao.
 * Qualquer projeto sem cenário próprio cai aqui e mostra as suas informações normalmente.
 */
export default function UnderConstructionScene({ project }) {
  const titleId = useId()

  return (
    <section className="uc" aria-labelledby={titleId}>
      <div className="caution-tape uc-tape uc-tape-top" aria-hidden="true" />
      <div className="caution-tape uc-tape uc-tape-bottom" aria-hidden="true" />
      <div className="uc-sky bg-grid" aria-hidden="true" />
      <div className="uc-worklight" aria-hidden="true">
        <span />
      </div>

      <div className="uc-content">
        <div className="uc-excavator" aria-hidden="true">
          <Excavator className="uc-drive h-auto w-full" />
        </div>

        <article className="uc-card">
          <ProjectInfo project={project} titleId={titleId} eyebrow={project.placeholder ? 'Em obras' : 'Cenário em construção'} />

          <div className="uc-progress" role="progressbar" aria-label="Novos projetos a caminho">
            <div className="uc-progress-track">
              <div className="build-progress">
                <div className="build-stripes" />
              </div>
            </div>
            <p>Novos projetos a caminho</p>
          </div>
        </article>
      </div>
    </section>
  )
}
