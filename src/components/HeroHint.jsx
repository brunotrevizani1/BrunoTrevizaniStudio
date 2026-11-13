import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MousePointerClick, X } from 'lucide-react'

// Objetos interativos do portfólio (todos existem de verdade nas cenas)
const THINGS = [
  { icon: '☕', name: 'Xícaras' },
  { icon: '🪟', name: 'Janelas e cortinas' },
  { icon: '📚', name: 'Livros' },
  { icon: '🖼️', name: 'Quadros' },
  { icon: '🪴', name: 'Plantas' },
  { icon: '💡', name: 'Cordinhas' },
  { icon: '🐱', name: 'O gato' },
  { icon: '📷', name: 'Câmera' },
  { icon: '📬', name: 'Caixa de correio' },
  { icon: '🕰️', name: 'Relógio' },
]

function HintModal({ onClosed }) {
  const [shown, setShown] = useState(false)
  const closeRef = useRef(null)

  const close = useCallback(() => {
    setShown(false)
    setTimeout(onClosed, 220)
  }, [onClosed])

  useEffect(() => {
    document.documentElement.dataset.modal = 'hero-hint'
    const raf = requestAnimationFrame(() => setShown(true))
    closeRef.current?.focus()
    return () => {
      cancelAnimationFrame(raf)
      delete document.documentElement.dataset.modal
    }
  }, [])

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return createPortal(
    <div className="hint-scene" data-shown={shown} role="dialog" aria-modal="true" aria-labelledby="hint-title">
      <div className="hint-backdrop" onClick={close} />

      <div className="hint-card">
        <span className="hint-tape" aria-hidden="true" />
        <button type="button" className="toon-btn toon-btn-icon hint-close" onClick={close} aria-label="Fechar">
          <X size={16} strokeWidth={3} />
        </button>

        <p className="hint-eyebrow">Um aviso do estúdio</p>
        <h2 id="hint-title" className="hint-title">
          Psiu! Aqui <span>tudo</span> é clicável.
        </h2>
        <p className="hint-lead">
          Quis fazer um portfólio diferente: em vez de uma página parada, um lugar vivo! Cada objeto das cenas é
          interativo, então explore à vontade. Se parece um objeto, provavelmente dá para mexer nele!
        </p>

        <ul className="hint-grid">
          {THINGS.map((thing, index) => (
            <li key={thing.name} className="hint-item" style={{ '--d': `${index * 45}ms` }}>
              <span className="hint-icon" aria-hidden="true">
                {thing.icon}
              </span>
              <strong>{thing.name}</strong>
            </li>
          ))}
        </ul>

        <button ref={closeRef} type="button" className="toon-btn hint-go" onClick={close}>
          Entendi, vou explorar!
        </button>
      </div>
    </div>,
    document.body,
  )
}

/** Botão "Clique aqui" do início: abre um aviso dizendo que tudo no portfólio é interativo. */
export default function HeroHint() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="toon-btn hero-hint-btn" onClick={() => setOpen(true)}>
        <MousePointerClick size={18} />
        Clique aqui
      </button>
      {open && <HintModal onClosed={() => setOpen(false)} />}
    </>
  )
}
