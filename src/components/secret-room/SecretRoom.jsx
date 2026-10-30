import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import Hub from './Hub'
import { getScene, preloadScene } from './sceneRegistry'
import { useLamp } from '../../context/LampContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { fitScale, resetZoom, zoomIn } from '../../hooks/cameraZoom'
import { CONTINUE_DOWN } from './events'
import { setSiteProgress } from '../../state/siteProgress'
import './secret-room.css'

// Fases: arriving -> hub -> entering -> scene -> leaving -> returning -> hub ... -> closing
// (as durações têm que bater com as transições de secret-room.css)
const MS = { arrive: 1500, leave: 450, returning: 700, close: 700 }
const REDUCED_MS = { arriving: 500, leaving: 300, returning: 300, closing: 300 }
// a fase "entering" não é por tempo: a porta abre e o zoom (cameraZoom) termina na fase "scene"
const DOOR_OPEN_MS = 1300
const DOOR_ZOOM_MS = 1500
const AUTO_NEXT = { arriving: ['hub', 'arrive'], leaving: ['returning', 'leave'], returning: ['hub', 'returning'], closing: [null, 'close'] }
// no corredor, rolar para cima (roda, setas, PageUp ou deslizar o dedo para baixo) volta para a estante;
// rolar para baixo (roda, setas, PageDown, espaço) sai da sala e segue para a próxima aba.
// A "cauda" de inércia da roda logo depois de chegar no corredor não conta como gesto.
const HUB_SETTLE_MS = 500
const SWIPE_PX = 60

/**
 * Overlay da sala secreta: corredor com uma porta por projeto e, ao clicar, a câmera atravessa
 * a porta e entra no cenário do projeto (carregado sob demanda). O corredor mostra o cabeçalho do
 * site; os cenários não. Esc volta um passo e rolar para cima no corredor volta para a estante.
 */
export default function SecretRoom({ initialProject, onClosing, onClosed }) {
  const { isOn, toggleLamp } = useLamp()
  const reduced = usePrefersReducedMotion()
  // initialProject: abre direto no cenário (voltando da tela de código privado / em construção)
  const [phase, setPhase] = useState(initialProject ? 'scene' : 'arriving')
  const [active, setActive] = useState(initialProject ?? null)
  const [origin, setOrigin] = useState({ x: '50%', y: '55%' })
  const backRef = useRef(null)
  const worldRef = useRef(null)
  const curtainRef = useRef(null)
  const zoomTimer = useRef(0)
  const lastDoor = useRef(initialProject?.id ?? null)
  const leaveTo = useRef(null)
  const continueDown = useRef(false)
  const hubAt = useRef(0)
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
    const timer = setTimeout(() => (next ? setPhase(next) : onClosed(leaveTo.current ?? (continueDown.current ? CONTINUE_DOWN : null))), reduced ? REDUCED_MS[phase] : MS[key])
    return () => clearTimeout(timer)
  }, [phase, reduced, onClosed])

  useEffect(() => () => clearTimeout(zoomTimer.current), [])

  // ao voltar da cena o corredor reaparece na escala normal
  useEffect(() => {
    if (phase === 'returning' && worldRef.current) resetZoom(worldRef.current)
  }, [phase])

  useEffect(() => {
    if (phase === 'hub') hubAt.current = performance.now()
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
  const close = useCallback(({ down = false } = {}) => {
    if (phaseRef.current !== 'hub') return
    continueDown.current = down
    setSiteProgress({ exitDown: down })
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
      } else if (
        (['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey)) &&
        phaseRef.current === 'hub' &&
        !event.target.closest?.('a, button, input, textarea, select')
      ) {
        event.preventDefault()
        close({ down: true })
      }
    }
    const onWheel = (event) => {
      if (phaseRef.current !== 'hub') return
      if (event.deltaY < 0) close()
      else if (event.deltaY > 0 && performance.now() - hubAt.current > HUB_SETTLE_MS) close({ down: true })
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

  // linha do tempo: a sala está aberta e, dentro de um cenário, qual é o projeto
  const inProject = phase === 'entering' || inScene
  useEffect(() => {
    setSiteProgress({ roomOpen: true, project: inProject && active ? active.id : null })
  }, [inProject, active])
  useEffect(() => {
    setSiteProgress({ exitDown: false })
    return () => setSiteProgress({ roomOpen: false, project: null })
  }, [])
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
      </div>

      <div className="sr-bar">
        {inScene ? (
          <button ref={backRef} type="button" className="toon-btn sr-btn sr-btn-back" onClick={backToHub}>
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar à sala secreta
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="toon-btn toon-btn-icon sr-btn sr-btn-icon"
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
