import { memo } from 'react'

// Mouse de mesa: quem move é o SetupStage (via ref, sem re-render); o clique vem por prop.
function DeskMouse({ mouseRef, clicking }) {
  return (
    <div className="setup-pad">
      <div ref={mouseRef} className="setup-mouse">
        <span className={`setup-mouse-btn setup-mouse-btn-left${clicking ? ' is-down' : ''}`} />
        <span className="setup-mouse-btn setup-mouse-btn-right" />
        <span className="setup-mouse-wheel" />
      </div>
    </div>
  )
}

export default memo(DeskMouse)
