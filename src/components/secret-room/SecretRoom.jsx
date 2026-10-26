import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import Navbar from '../Navbar'
import Hub from './Hub'
import { getScene, preloadScene } from './sceneRegistry'
import { useLamp } from '../../context/LampContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { fitScale, resetZoom, zoomIn } from '../../hooks/cameraZoom'
import './secret-room.css'

// Fases: arriving -> hub -> entering -> scene -> leaving -> returning -> hub ... -> closing
// (as durações têm que bater com as transições de secret-room.css)
const MS = { arrive: 1500, leave: 450, returning: 700, close: 700 }
const REDUCED_MS = { arriving: 500, leaving: 300, returning: 300, closing: 300 }
// a fase "entering" não é por tempo: a porta abre e o zoom (cameraZoom) termina na fase "scene"
const DOOR_OPEN_MS = 1300
const DOOR_ZOOM_MS = 1500
const AUTO_NEXT = { arriving: ['hub', 'arrive'], leaving: ['returning', 'leave'], returning: ['hub', 'returning'], closing: [null, 'close'] }
// no corredor, rolar para cima (roda, setas, PageUp ou deslizar o dedo para baixo) sai da sala
const SWIPE_PX = 60

/**
 * Overlay da sala secreta: corredor com uma porta por projeto e, ao clicar, a câmera atravessa
 * a porta e entra no cenário do projeto (carregado sob demanda). O corredor mostra o cabeçalho do
 * site; os cenários não. Esc volta um passo e rolar para cima no corredor volta para a estante.
 */
export default function SecretRoom({ onClosing, onClosed }) {
  const { isOn, toggleLamp } = useLamp()
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState('arriving')
  const [active, setActive] = useState(null)
  const [origin, setOrigin] = useState({ x: '50%', y: '55%' })
  const backRef = useRef(null)
  const worldRef = useRef(null)
  const curtainRef = useRef(null)
  const zoomTimer = useRef(0)
  const lastDoor = useRef(null)
  const leaveTo = useRef(null)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  // a página por trás fica inerte (sem foco/leitor de tela) e o scroll de abas pausa
  useEffect(() => {
    const root = document.getElementById('root')
    const previousFocus = document.activeElement
    document.documentElement.dataset.modal = 'secret-room'
    if (root) root.inert = true
    return () => {
      delete document.documentElement.dataset.modal
      if (root) root.inert = false
      previousFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  // fases que avançam sozinhas, depois do tempo da animação
  useEffect(() => {
    const auto = AUTO_NEXT[phase]
    if (!auto) return undefined
    const [next, key] = auto
    const timer = setTimeout(() => (next ? setPhase(next) : onClosed(leaveTo.current)), reduced ? REDUCED_MS[phase] : MS[key])
    return () => clearTimeout(timer)
  }, [phase, reduced, onClosed])

  useEffect(() => () => clearTimeout(zoomTimer.current), [])

  // ao voltar da cena o corredor reaparece na escala normal
  useEffect(() => {
    if (phase === 'returning' && worldRef.current) resetZoom(worldRef.current)
  }, [phase])

  useEffect(() => {
    if (phase === 'scene') backRef.current?.focus({ preventScroll: true })
  }, [phase])

  const enter = useCallback((project, rect) => {
    if (phaseRef.current !== 'hub') return
    lastDoor.current = project.id
    preloadScene(project.scene)
    setOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setActive(project)
    setPhase('entering')

    // 1) a porta abre  2) zoom no vão iluminado, igual ao da janela do prédio  3) véu de luz e cenário
    zoomTimer.current = setTimeout(async () => {
      await zoomIn(
        worldRef.current,
        { originX: rect.left + rect.width / 2, originY: rect.top + rect.height / 2, scale: fitScale(rect) },
        DOOR_ZOOM_MS,
        curtainRef.current,
      )
      curtainRef.current.style.opacity = '0'
      setPhase('scene')
    }, reduced ? 850 : DOOR_OPEN_MS)
  }, [reduced])

  const backToHub = useCallback(() => {
    if (phaseRef.current === 'scene') setPhase('leaving')
  }, [])

  // sair da sala: só pelo corredor (rolando para cima, Esc ou um link do cabeçalho)
  const close = useCallback(() => {
    if (phaseRef.current !== 'hub') return
    onClosing?.({ quick: Boolean(leaveTo.current) })
    setPhase('closing')
  }, [onClosing])

  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'Escape') {
        if (phaseRef.current === 'scene') backToHub()
        else close()
      } else if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) && phaseRef.current === 'hub') {
        event.preventDefault()
        close()
      }
    }
    const onWheel = (event) => {
      if (event.deltaY < 0 && phaseRef.current === 'hub') close()
    }
    let touchStartY = null
    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
    }
    const onTouchMove = (event) => {
      if (touchStartY === null || phaseRef.current !== 'hub') return
      if (event.touches[0].clientY - touchStartY > SWIPE_PX) {
        touchStartY = null
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [backToHub, close])

  // links do cabeçalho: "Projetos" já é aqui; os outros fecham a sala e depois seguem para a aba
  const handleNavClick = useCallback(
    (event) => {
      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return
      event.preventDefault()
      event.stopPropagation()
      const href = link.getAttribute('href')
      if (href === '#projetos' || phaseRef.current !== 'hub') return
      leaveTo.current = href
      close()
    },
    [close],
  )

  const inScene = phase === 'scene' || phase === 'leaving'
  const Scene = active ? getScene(active.scene) : null
  // ao voltar ao corredor o foco vai para a porta de onde o visitante veio (ou a primeira)
  const focusId = phase === 'hub' ? lastDoor.current : undefined

  return createPortal(
    <div
      className="sr"
      data-night={!isOn}
      data-phase={phase}
      data-reduced={reduced}
      role="dialog"
      aria-modal="true"
      aria-label="Sala secreta de projetos"
      style={{ '--ox': origin.x, '--oy': origin.y, '--glow': active?.door.glow ?? '#fff' }}
    >
      <div ref={worldRef} className="sr-world" aria-hidden={inScene || undefined} inert={inScene || undefined}>
        <Hub enteringId={phase === 'entering' ? active?.id : null} focusId={focusId} onOpen={enter} />
      </div>

      {inScene && Scene && (
        <div className="sr-stage" role="region" aria-label={`Projeto ${active.name}`}>
          <Suspense fallback={<div className="sr-loading" role="status">Abrindo a porta…</div>}>
            <Scene project={active} />
          </Suspense>
        </div>
      )}

      <div ref={curtainRef} className="sr-curtain" aria-hidden="true" />

      {/* cabeçalho do site: aparece só no corredor (os cenários dos projetos ficam sem ele) */}
      <div className="sr-nav" onClickCapture={handleNavClick} inert={inScene || undefined}>
        <Navbar />
      </div>

      <div className="sr-bar">
        {inScene ? (
          <button ref={backRef} type="button" className="sr-btn sr-btn-back" onClick={backToHub}>
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar à sala secreta
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="sr-btn sr-btn-icon"
          onClick={toggleLamp}
          aria-label={isOn ? 'Apagar a luz (modo noite)' : 'Acender a luz (modo dia)'}
        >
          {isOn ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>,
    document.body,
  )
}
