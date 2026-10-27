import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Power } from 'lucide-react'
import SkillsShelf from '../skills/SkillsShelf'
import RoomDecor from '../skills/RoomDecor'
import Keyboard from './Keyboard'
import { keyIdFromEvent } from './keyIds'
import DeskMouse from './DeskMouse'
import DeskMug from './DeskMug'
import Screen from './Screen'
import { STAGE_H, STAGE_W, cameraTransform, computeCameras, easeInOutCubic, mixCameras } from './camera'

const PAD_W = 170
const PAD_H = 78
const MOUSE_W = 26
const MOUSE_H = 42
const KEY_HOLD_MS = 150
const CLICK_HOLD_MS = 110

/**
 * Câmera do palco: guarda a posição atual, aplica o transform direto no DOM (sem re-render)
 * e publica { set, goTo, stage } no elemento da cena, para o useFullPageScroll conduzir a
 * panorâmica entre o close-up do setup e a estante de skills.
 */
const PAN_MS = 1900
const PAN_ARC = 0.5

function useStageCamera(containerRef, stageRef, captionRef) {
  useLayoutEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    const caption = captionRef.current
    if (!container || !stage) return undefined

    let cameras = computeCameras(container.clientWidth, container.clientHeight)
    let name = 'closeup'
    let current = { ...cameras.closeup }
    let frame = 0

    const apply = (camera) => {
      current = camera
      stage.style.transform = cameraTransform(camera, container.clientWidth, container.clientHeight)
      if (caption) {
        caption.style.opacity = String(Math.max(0, Math.min(1, (camera.cx - 300) / 300)))
      }
    }

    // voltar ao close-up rearma a alavanca da estante (rolar para baixo volta a abrir a sala secreta)
    const rearmLever = (always) => {
      const lever = container.querySelector('.skshelf')?.__lever
      if (lever && always) lever.used = false
    }

    const api = {
      get stage() {
        return name
      },
      set(target) {
        cancelAnimationFrame(frame)
        rearmLever(true)
        name = target
        apply({ ...cameras[target] })
      },
      goTo(target, duration = PAN_MS) {
        cancelAnimationFrame(frame)
        rearmLever(target === 'closeup')
        name = target
        const from = { ...current }
        const start = performance.now()
        return new Promise((resolve) => {
          const step = (now) => {
            const t = Math.min((now - start) / duration, 1)
            apply(mixCameras(from, cameras[target], easeInOutCubic(t), PAN_ARC))
            if (t < 1) frame = requestAnimationFrame(step)
            else resolve()
          }
          frame = requestAnimationFrame(step)
        })
      },
    }
    container.__setupCamera = api
    apply({ ...cameras.closeup })

    const observer = new ResizeObserver(() => {
      cameras = computeCameras(container.clientWidth, container.clientHeight)
      apply({ ...cameras[name] })
    })
    observer.observe(container)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      delete container.__setupCamera
    }
  }, [containerRef, stageRef, captionRef])
}

export default function SetupStage({ isNight }) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const mouseRef = useRef(null)
  const stageRef = useRef(null)
  const captionRef = useRef(null)
  useStageCamera(containerRef, stageRef, captionRef)

  const [monitorOn, setMonitorOn] = useState(true)
  const [clicking, setClicking] = useState(false)
  const [pressed, setPressed] = useState(() => new Set())
  const clickTimer = useRef(0)

  // O cursor da tela e o mouse da mesa se movem juntos, direto no DOM (sem re-render).
  const handleMove = useCallback((x, y) => {
    const cursor = cursorRef.current
    if (cursor) {
      cursor.style.left = `${x * 100}%`
      cursor.style.top = `${y * 100}%`
    }
    const mouse = mouseRef.current
    if (mouse) {
      const tx = x * (PAD_W - MOUSE_W - 16) + 8
      const ty = y * (PAD_H - MOUSE_H + 14)
      mouse.style.transform = `translate(${tx}px, ${ty}px) rotate(${(x - 0.5) * 10}deg)`
    }
  }, [])

  useEffect(() => {
    handleMove(0.52, 0.58)
  }, [handleMove])

  const handlePress = useCallback(() => {
    window.clearTimeout(clickTimer.current)
    setClicking(true)
    clickTimer.current = window.setTimeout(() => setClicking(false), CLICK_HOLD_MS)
  }, [])

  const handleKey = useCallback((event) => {
    const id = keyIdFromEvent(event)
    if (!id) return
    setPressed((prev) => new Set(prev).add(id))
    window.setTimeout(() => {
      setPressed((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, KEY_HOLD_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(clickTimer.current), [])

  return (
    <div
      ref={containerRef}
      data-night={isNight}
      data-monitor={monitorOn ? 'on' : 'off'}
      className="setup-scene absolute inset-0 overflow-hidden"
    >
      <div ref={captionRef} className="setup-caption">
        <span className="setup-caption-eyebrow">Sobre mim</span>
        <h2 className="setup-caption-title">Quem escreve o código</h2>
      </div>

      <div
        ref={stageRef}
        className="absolute"
        style={{ width: STAGE_W, height: STAGE_H, left: 0, top: 0, transformOrigin: '0 0' }}
      >

        <RoomDecor />
        <SkillsShelf />

        <div className="setup-monitor-glow" />

        {/* mesa (estende além do palco para preencher telas largas) */}
        <div className="setup-desk-top" />
        <div className="setup-desk-front" />

        {/* monitor */}
        <div className="setup-monitor">
          <div className="setup-monitor-bezel">
            <Screen on={monitorOn} cursorRef={cursorRef} onMove={handleMove} onPress={handlePress} onKey={handleKey} />
            <div className="setup-monitor-chin">
              <span className="setup-monitor-led" />
              <button
                type="button"
                className="setup-power"
                onClick={() => setMonitorOn((value) => !value)}
                aria-pressed={monitorOn}
                aria-label={monitorOn ? 'Desligar monitor' : 'Ligar monitor'}
                title={monitorOn ? 'Desligar monitor' : 'Ligar monitor'}
              >
                <Power size={11} strokeWidth={3} />
              </button>
            </div>
          </div>
          <div className="setup-monitor-neck" />
          <div className="setup-monitor-base" />
        </div>

        <Keyboard pressed={pressed} />
        <DeskMouse mouseRef={mouseRef} clicking={clicking} />
        <DeskMug />

        <div className="setup-floor" />
      </div>
    </div>
  )
}
