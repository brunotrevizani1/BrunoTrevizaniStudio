import { useId, useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../../../hooks/usePrefersReducedMotion'
import ProjectInfo from '../../ProjectInfo'
import './photolumi.css'

// Fotos do varal: gradientes simples, exceto a primeira, que usa a imagem do projeto.
const PHOTOS = ['is-logo', 'is-sunset', 'is-portrait', 'is-hills', 'is-flower', 'is-city', 'is-beach']
const SAGS = [10, 22, 30, 32, 30, 22, 10]

// altura da lente dentro do desenho do tripé (viewBox 200 x 330)
const LENS_Y = 106 / 330
const FLIGHT_MS = 1500
const FLIGHT_DELAY_MS = 180
const SHOT_GAP_MS = 500

const slotStyle = (slot) => ({ '--i': slot, '--x': `${3 + slot * 14.6}%`, '--sag': `${SAGS[slot]}px` })

function Tripod({ kick }) {
  return (
    <svg className={`pl-tripod${kick ? ' is-kick' : ''}`} viewBox="0 0 200 330" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="316" rx="82" ry="9" fill="#000" opacity="0.18" />
      <g stroke="#2b2b2b" strokeWidth="7" strokeLinecap="round">
        <line x1="100" y1="168" x2="34" y2="314" />
        <line x1="100" y1="168" x2="100" y2="318" />
        <line x1="100" y1="168" x2="166" y2="314" />
      </g>
      <rect x="92" y="150" width="16" height="30" rx="4" fill="#1a1a1a" />
      <rect x="38" y="60" width="124" height="86" rx="12" fill="#2a2a2a" />
      <rect x="38" y="60" width="124" height="22" rx="10" fill="#3a3a3a" />
      <rect x="62" y="44" width="34" height="20" rx="5" fill="#3a3a3a" />
      <circle cx="136" cy="52" r="6" fill="#cc3b2f" className="pl-led" />
      <circle cx="100" cy="106" r="34" fill="#151515" />
      <circle cx="100" cy="106" r="26" fill="#1f2a3a" stroke="#4a5568" strokeWidth="4" />
      <circle cx="100" cy="106" r="12" fill="#0b1220" />
      <circle cx="92" cy="98" r="5" fill="#fff" opacity="0.7" />
      <rect x="46" y="70" width="14" height="8" rx="3" fill="#ffd36b" />
    </svg>
  )
}

// foto recém-tirada: nasce na lente da câmera e voa até o lugar dela no varal
function ShotPhoto({ slot, kind, cameraRef, reduced }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const camera = cameraRef.current?.getBoundingClientRect()
    if (reduced || !camera) return undefined
    const target = ref.current.getBoundingClientRect()
    const dx = camera.left + camera.width / 2 - (target.left + target.width / 2)
    const dy = camera.top + camera.height * LENS_Y - target.top
    const flight = ref.current.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
        { offset: 0.08, transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 1 },
        { offset: 0.28, transform: `translate(${dx}px, ${dy - 60}px) scale(0.55) rotate(-6deg)`, opacity: 1 },
        { offset: 0.85, transform: 'translate(0, -16px) scale(1.06) rotate(5deg)', opacity: 1 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: FLIGHT_MS, delay: FLIGHT_DELAY_MS, easing: 'ease-in-out', fill: 'backwards' },
    )
    return () => flight.cancel()
  }, [cameraRef, reduced])

  return (
    <figure ref={ref} className="pl-photo pl-photo-shot" style={slotStyle(slot)}>
      <span className="pl-pin" />
      <span className={`pl-img ${kind}`} />
    </figure>
  )
}

/**
 * Estúdio fotográfico do PhotoLumi: as informações ficam numa tela de cavalete no meio e o
 * estúdio (varal, softbox, tripé, sombrinha, rebatedor, fundo infinito) a cerca por todos os lados.
 * O varal começa vazio: cada clique na câmera tira uma foto, que vai para o próximo lugar (com o
 * varal cheio, a mais antiga dá lugar à nova). Sem câmera na tela (até 1000px), ele já vem com as
 * fotos de amostra.
 */
export default function PhotoLumiScene({ project }) {
  const titleId = useId()
  const reduced = usePrefersReducedMotion()
  const [shots, setShots] = useState([])
  const cameraRef = useRef(null)
  const nextShot = useRef(0)
  const lastShotAt = useRef(-SHOT_GAP_MS)
  const lastShot = shots.at(-1)

  const shoot = (event) => {
    if (event.timeStamp - lastShotAt.current < SHOT_GAP_MS) return
    lastShotAt.current = event.timeStamp
    const shot = nextShot.current
    nextShot.current += 1
    const sameSlot = (other) => other % PHOTOS.length === shot % PHOTOS.length
    setShots((list) => [...list.filter((other) => !sameSlot(other)), shot])
  }

  return (
    <section className="pl" aria-labelledby={titleId}>
      <div className="pl-cyc" aria-hidden="true" />
      <div key={`flash-${lastShot}`} className={`pl-flash${lastShot === undefined ? '' : ' is-shot'}`} aria-hidden="true" />
      {lastShot !== undefined && <div key={`shutter-${lastShot}`} className="pl-shutter" aria-hidden="true" />}

      <div className="pl-decor" aria-hidden="true">
        <div className="pl-line">
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" fill="none">
            <path d="M0 4 Q300 46 600 4" stroke="#6b5b3e" strokeWidth="3" />
          </svg>
          {PHOTOS.map((kind, index) => (
            <figure key={kind} className="pl-photo pl-photo-sample" style={slotStyle(index)}>
              <span className="pl-pin" />
              <span className={`pl-img ${kind}`} />
            </figure>
          ))}
          {/* a primeira foto tirada já é uma genérica: o logo do projeto fica por último */}
          {shots.map((shot) => (
            <ShotPhoto
              key={shot}
              slot={shot % PHOTOS.length}
              kind={PHOTOS[(shot + 1) % PHOTOS.length]}
              cameraRef={cameraRef}
              reduced={reduced}
            />
          ))}
        </div>

        <div className="pl-softbox">
          <span className="pl-softbox-face" />
          <span className="pl-softbox-pole" />
        </div>
        <div className="pl-beam" />
        <div className="pl-umbrella">
          <span className="pl-umbrella-canopy" />
          <span className="pl-umbrella-pole" />
        </div>
        <div className="pl-reflector">
          <span className="pl-reflector-disc" />
          <span className="pl-reflector-pole" />
        </div>
      </div>

      <button ref={cameraRef} type="button" className="pl-camera" onClick={shoot} aria-label="Tirar uma foto para o varal">
        {lastShot === undefined && <span className="pl-camera-hint">Clique para fotografar!</span>}
        <Tripod key={lastShot} kick={lastShot !== undefined} />
      </button>

      <article className="pl-easel">
        <span className="pl-clamp" aria-hidden="true" />
        <div className="pl-board">
          {project.image && <img className="pl-shot" src={project.image} alt={`Logo do ${project.name}`} />}
          <ProjectInfo project={project} titleId={titleId} eyebrow={project.tagline} />
        </div>
        <span className="pl-tray" aria-hidden="true" />
        <div className="pl-legs" aria-hidden="true">
          <i className="pl-leg-back" />
          <i className="pl-leg-l" />
          <i className="pl-leg-r" />
        </div>
      </article>
    </section>
  )
}
