import { useRef, useState } from 'react'
import { useLamp } from '../../context/LampContext'

const REST_Y = 112
const MAX_PULL = 42
const PULL_THRESHOLD = 22
const VIEW_H = 214

// Corda trançada que desce do topo da tela, com um pingente de sol (de dia) ou de lua (de noite).
// Puxar para baixo (arrastar) troca o dia pela noite e vice-versa; a corda estica e volta ao repouso.
export default function SkyCord({ className = '', style }) {
  const { isOn, toggleLamp } = useLamp()
  const [pull, setPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const svgRef = useRef(null)
  const dragInfo = useRef({ active: false, startY: 0, unitsPerPixel: 1, lastPull: 0 })

  function handlePointerDown(event) {
    event.preventDefault()
    const rect = svgRef.current.getBoundingClientRect()
    dragInfo.current = { active: true, startY: event.clientY, unitsPerPixel: VIEW_H / rect.height, lastPull: 0 }
    setDragging(true)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  function handlePointerMove(event) {
    if (!dragInfo.current.active) return
    const { startY, unitsPerPixel } = dragInfo.current
    const next = Math.max(0, Math.min(MAX_PULL, (event.clientY - startY) * unitsPerPixel))
    dragInfo.current.lastPull = next
    setPull(next)
  }

  function handlePointerUp() {
    if (!dragInfo.current.active) return
    dragInfo.current.active = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    setDragging(false)
    if (dragInfo.current.lastPull >= PULL_THRESHOLD) toggleLamp()
    setPull(0)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleLamp()
    }
  }

  const snap = dragging ? 'none' : 'all 320ms cubic-bezier(0.34, 1.56, 0.64, 1)'
  const ropeLength = REST_Y + pull
  const discY = REST_Y + 16 + pull
  const palette = isOn
    ? { rope: '#d6b07a', twist: '#8f6a35', shine: '#f3deb5', disc: '#fbbf24', discEdge: '#b7791f', icon: '#7c4a03', tassel: '#d97706' }
    : { rope: '#9fb0cf', twist: '#56658a', shine: '#dfe7f8', disc: '#e8edfb', discEdge: '#8b9ac0', icon: '#33406a', tassel: '#8b9ac0' }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 36 ${VIEW_H}`}
      width="36"
      height={VIEW_H}
      fill="none"
      className={`sky-cord ${dragging ? '' : 'sky-cord-sway'} ${className}`}
      style={{ position: 'absolute', zIndex: 20, overflow: 'visible', ...style }}
    >
      <defs>
        <pattern id="sky-cord-twist" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <rect width="7" height="7" fill={palette.rope} />
          <rect width="7" height="3" fill={palette.twist} />
        </pattern>
      </defs>

      <g
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => event.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label={isOn ? 'Puxar a corda para trazer a noite' : 'Puxar a corda para trazer o dia'}
        className="cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ WebkitUserDrag: 'none', WebkitTapHighlightColor: 'transparent' }}
      >
        <rect x="0" y="0" width="36" height={VIEW_H} fill="transparent" />

        {/* sombra, corda trançada e brilho */}
        <rect x="16" y="0" width="8" height={ropeLength + 6} rx="4" fill="rgba(0,0,0,0.18)" style={{ transition: snap }} />
        <rect x="14" y="-4" width="8" height={ropeLength + 6} rx="4" fill="url(#sky-cord-twist)" style={{ transition: snap }} />
        <rect x="15.4" y="-4" width="1.8" height={ropeLength + 6} rx="0.9" fill={palette.shine} opacity="0.7" style={{ transition: snap }} />

        {/* pingente */}
        <g style={{ transform: `translateY(${pull}px)`, transition: snap }}>
          <path d={`M14 ${REST_Y + 4} h8 l-1 7 h-6 Z`} fill={palette.discEdge} />
          <circle cx="18" cy={REST_Y + 16} r="14" fill={palette.discEdge} />
          <circle cx="18" cy={REST_Y + 16} r="12" fill={palette.disc} />
          <ellipse cx="14" cy={REST_Y + 11} rx="5" ry="3" fill="#fff" opacity="0.4" />
          {isOn ? (
            <g stroke={palette.icon} strokeWidth="1.6" strokeLinecap="round">
              <circle cx="18" cy={REST_Y + 16} r="4" fill={palette.icon} stroke="none" />
              <path
                d={[0, 45, 90, 135, 180, 225, 270, 315]
                  .map((deg) => {
                    const a = (deg * Math.PI) / 180
                    const cx = 18
                    const cy = REST_Y + 16
                    return `M${(cx + Math.cos(a) * 6.4).toFixed(2)} ${(cy + Math.sin(a) * 6.4).toFixed(2)} L${(cx + Math.cos(a) * 8.6).toFixed(2)} ${(cy + Math.sin(a) * 8.6).toFixed(2)}`
                  })
                  .join(' ')}
              />
            </g>
          ) : (
            <path
              d={`M21.5 ${REST_Y + 9.5} A7.4 7.4 0 1 0 ${25} ${REST_Y + 19} A5.8 5.8 0 0 1 21.5 ${REST_Y + 9.5} Z`}
              fill={palette.icon}
            />
          )}
          {/* borla */}
          <path d={`M14 ${REST_Y + 30} h8 l3 5 h-14 Z`} fill={palette.discEdge} />
          {[12.5, 15.2, 18, 20.8, 23.5].map((x, i) => (
            <path key={x} d={`M${x} ${REST_Y + 35} q${i % 2 ? 1.5 : -1.5} 9 0 18`} stroke={palette.tassel} strokeWidth="2.2" strokeLinecap="round" />
          ))}
        </g>
      </g>
    </svg>
  )
}
