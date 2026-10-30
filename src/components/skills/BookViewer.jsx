import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const BOOK_W = 360
const BOOK_H = 470

/**
 * Livro aberto em tela cheia: sai da estante (voando até o centro), a capa abre e mostra
 * as especificações da ferramenta. Fecha com Esc, clique fora ou no X (faz o caminho inverso).
 * Fases: start -> fly -> open -> closing -> back -> (onClosed)
 */
export default function BookViewer({ skill, category, details, color, originRect, onClosed }) {
  const [phase, setPhase] = useState('start')
  const [fit, setFit] = useState(1)

  useEffect(() => {
    const update = () =>
      setFit(Math.min(1, (window.innerWidth - 32) / (BOOK_W * 2 + 40), (window.innerHeight - 110) / BOOK_H))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // enquanto o livro está aberto, a página por trás não troca de aba
  useEffect(() => {
    document.documentElement.dataset.modal = 'book'
    return () => {
      delete document.documentElement.dataset.modal
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('fly')))
    const timer = setTimeout(() => setPhase((current) => (current === 'fly' ? 'open' : current)), 950)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (phase === 'closing') {
      const timer = setTimeout(() => setPhase('back'), 760)
      return () => clearTimeout(timer)
    }
    if (phase === 'back') {
      const timer = setTimeout(onClosed, 800)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [phase, onClosed])

  const close = useCallback(() => {
    setPhase((current) => (current === 'open' || current === 'fly' ? 'closing' : current))
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const atShelf = phase === 'start' || phase === 'back'
  const isOpen = phase === 'open'
  const dx = originRect.left + originRect.width / 2 - window.innerWidth / 2
  const dy = originRect.top + originRect.height / 2 - window.innerHeight / 2
  const fromScale = Math.max(0.12, originRect.height / BOOK_H)

  const stageStyle = {
    width: BOOK_W,
    height: BOOK_H,
    marginLeft: -BOOK_W / 2,
    marginTop: -BOOK_H / 2,
    transform: atShelf
      ? `translate(${dx}px, ${dy}px) scale(${fromScale}) rotateY(72deg)`
      : `translate(0px, 0px) scale(${fit}) rotateY(0deg)`,
    transition:
      phase === 'start'
        ? 'none'
        : phase === 'back'
          ? 'transform 760ms cubic-bezier(0.5, 0, 0.8, 0.4)'
          : 'transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  }

  const initial = skill.name.trim().charAt(0).toUpperCase()

  return createPortal(
    <div
      className="book-scene"
      role="dialog"
      aria-modal="true"
      aria-label={`Livro: ${skill.name}`}
      style={{ '--book-color': color }}
    >
      <div
        className="book-backdrop"
        style={{ opacity: atShelf ? 0 : 1 }}
        onClick={close}
      />

      <button
        type="button"
        className="toon-btn toon-btn-icon book-close"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={close}
        aria-label="Fechar livro"
      >
        <X size={18} strokeWidth={3} />
      </button>

      <div className="book-stage" style={stageStyle}>
        <div className="book3d" style={{ transform: `translateX(${isOpen ? BOOK_W / 2 : 0}px)` }}>
          <div className="book3d-shadow" />

          {/* página da direita (por baixo da capa) */}
          <div className="book3d-page book3d-page-right">
            <span className="book3d-ribbon" />
            <p className="book3d-kicker">Especificações</p>
            <p className="book3d-text">{details.description}</p>
            <dl className="book3d-facts">
              {details.facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <span className="book3d-folio">{category}</span>
          </div>

          {/* capa: frente = capa fechada, verso = página da esquerda */}
          <div className="book3d-cover" style={{ transform: `rotateY(${isOpen ? -180 : 0}deg)` }}>
            <div className="book3d-face book3d-front">
              <div className="book3d-frame">
                <span className="book3d-category">{category}</span>
                <span className="book3d-ornament" />
                <h3 className="book3d-title">{skill.name}</h3>
                <span className="book3d-ornament" />
                <span className="book3d-sub">{details.tagline}</span>
              </div>
            </div>

            <div className="book3d-face book3d-back book3d-page">
              <span className="book3d-emblem">{initial}</span>
              <h3 className="book3d-name">{skill.name}</h3>
              <p className="book3d-tagline">{details.tagline}</p>
              <span className="book3d-divider" />
              <span className="book3d-chip">{category}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="book-hint" style={{ opacity: isOpen ? 1 : 0 }}>
        Esc ou clique fora para fechar
      </p>
    </div>,
    document.body,
  )
}
