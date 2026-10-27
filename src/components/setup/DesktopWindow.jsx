import { useRef, useState } from 'react'
import { Maximize2, Minimize2, Minus, X } from 'lucide-react'

// Tamanho lógico da tela do monitor e da barra de tarefas (ver .setup-screen no CSS).
export const SCREEN_W = 740
export const SCREEN_H = 350
export const TASKBAR_H = 34
export const AREA_H = SCREEN_H - TASKBAR_H

const MIN_W = 300
const MIN_H = 150
const GRAB = 80

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))

/**
 * Janela da área de trabalho: arrasta pela barra de título, redimensiona pelas bordas
 * (direita, baixo e canto), minimiza, maximiza (também com duplo clique) e fecha.
 * A geometria fica no pai, em px lógicos; getScale() converte px da tela para lógicos.
 */
export default function DesktopWindow({
  title,
  icon,
  geom,
  maximized,
  minimized,
  z,
  getScale,
  onGeom,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onClose,
  className = '',
  children,
}) {
  const [interacting, setInteracting] = useState(false)
  const dragRef = useRef(null)

  function begin(event, mode, dir) {
    if (event.button !== 0 || maximized) return
    if (mode === 'drag' && event.target.closest('button')) return

    event.preventDefault()
    onFocus()
    dragRef.current = { mode, dir, px: event.clientX, py: event.clientY, start: { ...geom } }
    setInteracting(true)

    const handleMove = (moveEvent) => {
      const info = dragRef.current
      if (!info) return
      const scale = getScale()
      const dx = (moveEvent.clientX - info.px) / scale
      const dy = (moveEvent.clientY - info.py) / scale

      if (info.mode === 'drag') {
        onGeom({
          ...info.start,
          x: clamp(info.start.x + dx, GRAB - info.start.w, SCREEN_W - GRAB),
          y: clamp(info.start.y + dy, 0, AREA_H - 30),
        })
        return
      }

      const next = { ...info.start }
      if (info.dir.includes('e')) {
        next.w = clamp(info.start.w + dx, MIN_W, SCREEN_W - info.start.x)
      }
      if (info.dir.includes('s')) {
        next.h = clamp(info.start.h + dy, MIN_H, AREA_H - info.start.y)
      }
      onGeom(next)
    }

    const handleUp = () => {
      dragRef.current = null
      setInteracting(false)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
  }

  const frame = maximized ? { x: 0, y: 0, w: SCREEN_W, h: AREA_H } : geom

  return (
    <div
      className={`setup-window ${className}${interacting ? ' is-interacting' : ''}${maximized ? ' is-maximized' : ''}`}
      style={{
        left: frame.x,
        top: frame.y,
        width: frame.w,
        height: frame.h,
        zIndex: z,
        display: minimized ? 'none' : 'flex',
      }}
      onPointerDownCapture={onFocus}
    >
      <div
        className="setup-window-bar"
        onPointerDown={(event) => begin(event, 'drag')}
        onDoubleClick={(event) => {
          if (!event.target.closest('button')) onToggleMaximize()
        }}
      >
        <span className="setup-window-title">
          {icon}
          {title}
        </span>

        <span className="setup-win-btns">
          <button type="button" className="setup-win-btn" onClick={onMinimize} aria-label="Minimizar">
            <Minus size={13} strokeWidth={3} />
          </button>
          <button
            type="button"
            className="setup-win-btn"
            onClick={onToggleMaximize}
            aria-label={maximized ? 'Restaurar' : 'Maximizar'}
          >
            {maximized ? <Minimize2 size={12} strokeWidth={2.6} /> : <Maximize2 size={12} strokeWidth={2.6} />}
          </button>
          <button
            type="button"
            className="setup-win-btn setup-win-btn-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={13} strokeWidth={3} />
          </button>
        </span>
      </div>

      <div className="setup-window-content">{children}</div>

      {!maximized && (
        <>
          <span className="setup-resize setup-resize-e" onPointerDown={(event) => begin(event, 'resize', 'e')} />
          <span className="setup-resize setup-resize-s" onPointerDown={(event) => begin(event, 'resize', 's')} />
          <span className="setup-resize setup-resize-se" onPointerDown={(event) => begin(event, 'resize', 'se')} />
        </>
      )}
    </div>
  )
}
