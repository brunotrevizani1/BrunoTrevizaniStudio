import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SkyTrip from './sky-trip/SkyTrip'
import InkFilter from './icons/InkFilter'
import { createVeil, fitScale, resetZoom, zoomIn, zoomOut } from '../hooks/cameraZoom'

const VIEW_W = 1440
const VIEW_H = 420

function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LAYERS = [
  { name: 'far', seed: 11, minW: 70, maxW: 130, minH: 130, maxH: 260, windows: false },
  { name: 'mid', seed: 23, minW: 70, maxW: 120, minH: 110, maxH: 250, windows: true, lit: 0.3 },
  { name: 'near', seed: 37, minW: 80, maxW: 150, minH: 70, maxH: 190, windows: true, lit: 0.4 },
]

function buildLayer({ seed, minW, maxW, minH, maxH, windows, lit }) {
  const random = createRandom(seed)
  const buildings = []
  let x = -20

  while (x < VIEW_W) {
    const width = minW + random() * (maxW - minW)
    const height = minH + random() * (maxH - minH)
    const top = VIEW_H - height
    const building = { x, width, top, height, windows: [], antenna: null }

    if (windows) {
      const cellW = 16
      const cellH = 22
      const cols = Math.floor((width - 12) / cellW)
      const rows = Math.floor((height - 16) / cellH)
      const offsetX = (width - cols * cellW) / 2 + (cellW - 7) / 2

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          building.windows.push({
            x: offsetX + col * cellW,
            y: 12 + row * cellH,
            lit: random() < lit,
            flicker: random() < 0.015,
          })
        }
      }
    }

    if (height > maxH * 0.8 && random() < 0.7) {
      building.antenna = { x: width / 2, height: 26 + random() * 18 }
    }

    buildings.push(building)
    x += width * (0.82 + random() * 0.2)
  }

  return buildings
}

function createStars() {
  const random = createRandom(91)
  return Array.from({ length: 70 }, () => ({
    left: `${(random() * 100).toFixed(2)}%`,
    top: `${(random() * 58).toFixed(2)}%`,
    size: random() < 0.2 ? 3 : 2,
    delay: `${(random() * 4).toFixed(2)}s`,
    duration: `${(2 + random() * 3).toFixed(2)}s`,
  }))
}

const BIRDS = [
  { top: '19%', delay: '-4s', duration: '30s', scale: 1 },
  { top: '24%', delay: '-6s', duration: '30s', scale: 0.8 },
  { top: '16%', delay: '-17s', duration: '38s', scale: 0.9 },
  { top: '30%', delay: '-26s', duration: '34s', scale: 0.7 },
  { top: '22%', delay: '-31s', duration: '42s', scale: 1.1 },
]

const CLOUDS = [
  { top: '12%', width: 300, delay: '-20s', duration: '110s' },
  { top: '30%', width: 220, delay: '-70s', duration: '140s' },
  { top: '8%', width: 180, delay: '-95s', duration: '170s' },
]

// mergulho no sol / na lua: o véu tem a cor do universo que vai abrir
const TRIP_ZOOM_MS = 1400
const TRIP_BACK_MS = 1100
const TRIP_VEILS = {
  sun: 'radial-gradient(circle, #fff3b0 0%, #ffb627 60%, #e85d04 100%)',
  moon: 'radial-gradient(circle, #2b2d5c 0%, #0d0b24 70%, #05040f 100%)',
}

function Skyline({ buildings, layerName }) {
  return (
    <g className={`city-${layerName}`} filter="url(#city-ink)">
      {buildings.map((building, index) => (
        <g key={index} transform={`translate(${building.x.toFixed(1)} ${building.top.toFixed(1)})`}>
          <rect
            className="city-body"
            x="0"
            y="0"
            width={building.width.toFixed(1)}
            height={building.height + 2}
          />
          {building.antenna && (
            <>
              <line
                className="city-antenna"
                x1={building.antenna.x}
                y1="0"
                x2={building.antenna.x}
                y2={-building.antenna.height}
              />
              <circle
                className="city-beacon"
                cx={building.antenna.x}
                cy={-building.antenna.height}
                r="2.6"
              />
            </>
          )}
          {building.windows.map((win, winIndex) => (
            <rect
              key={winIndex}
              className={`city-window${win.lit ? ' is-lit' : ''}${win.lit && win.flicker ? ' is-flicker' : ''}`}
              x={win.x.toFixed(1)}
              y={win.y}
              width="7"
              height="11"
              rx="1"
            />
          ))}
        </g>
      ))}
    </g>
  )
}

export default function CityScene({ isNight }) {
  const skyline = useMemo(
    () => LAYERS.map((layer) => ({ name: layer.name, buildings: buildLayer(layer) })),
    [],
  )
  const stars = useMemo(createStars, [])
  const sceneRef = useRef(null)
  const busy = useRef(false)
  const [trip, setTrip] = useState(null)

  // fora da tela a cidade não precisa animar (janelas piscando refazem o filtro de contorno)
  useEffect(() => {
    const scene = sceneRef.current
    const observer = new IntersectionObserver(([entry]) => {
      scene.dataset.offscreen = String(entry.intersectionRatio === 0)
    })
    observer.observe(scene)
    return () => observer.disconnect()
  }, [])

  // clicar no sol (de dia) ou na lua (de noite): a câmera mergulha nele e abre um "universo"
  const visit = useCallback(
    async (astro, event) => {
      const scene = sceneRef.current
      if (busy.current || !scene) return
      busy.current = true
      document.documentElement.dataset.modal = 'sky-trip'
      // o texto do Hero some durante o mergulho, como no zoom da janela (windowZoom)
      const hero = scene.closest('.hero-scope')
      if (hero) hero.dataset.zoom = 'in'
      const rect = event.currentTarget.getBoundingClientRect()
      const sceneRect = scene.getBoundingClientRect()
      const veil = createVeil(TRIP_VEILS[astro])
      scene.classList.add('is-zooming')
      await zoomIn(
        scene,
        {
          originX: rect.left + rect.width / 2 - sceneRect.left,
          originY: rect.top + rect.height / 2 - sceneRect.top,
          scale: fitScale({ width: rect.width * 0.4, height: rect.height * 0.4 }),
        },
        TRIP_ZOOM_MS,
        veil,
      )
      setTrip(astro)
      // o universo chega por cima do véu; depois o véu pode sair
      setTimeout(() => veil.remove(), 700)
    },
    [],
  )

  // caminho inverso: o véu cobre a tela e a câmera se afasta do astro enquanto ele some
  const leave = useCallback(async (veil = TRIP_VEILS[trip]) => {
    const scene = sceneRef.current
    const back = createVeil(veil, 1)
    const hero = scene.closest('.hero-scope')
    setTrip(null)
    setTimeout(() => hero && delete hero.dataset.zoom, TRIP_BACK_MS * 0.55)
    await zoomOut(scene, TRIP_BACK_MS, back)
    resetZoom(scene)
    scene.classList.remove('is-zooming')
    back.remove()
    delete document.documentElement.dataset.modal
    busy.current = false
  }, [trip])

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      data-night={isNight}
      className="city-scene pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="city-sky city-sky-day" />
      <div className="city-sky city-sky-night" />

      {/* estrelas e lua (noite) */}
      <div className="city-night-layer">
        {stars.map((star, index) => (
          <span
            key={index}
            className="city-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
        <span className="city-shooting-star" />
      </div>

      <button type="button" tabIndex={-1} className="city-moon" onClick={(event) => visit('moon', event)}>
        <span className="city-moon-crater" style={{ left: '22%', top: '28%', width: '20%', height: '20%' }} />
        <span className="city-moon-crater" style={{ left: '56%', top: '18%', width: '14%', height: '14%' }} />
        <span className="city-moon-crater" style={{ left: '48%', top: '58%', width: '24%', height: '24%' }} />
      </button>

      {/* sol, nuvens e pássaros (dia) */}
      <button type="button" tabIndex={-1} className="city-sun" onClick={(event) => visit('sun', event)}>
        <span className="city-sun-rays" />
        <span className="city-sun-core" />
      </button>

      <div className="city-day-layer">
        {CLOUDS.map((cloud, index) => (
          <span
            key={index}
            className="city-cloud"
            style={{
              top: cloud.top,
              width: cloud.width,
              height: cloud.width * 0.22,
              animationDelay: cloud.delay,
              animationDuration: cloud.duration,
            }}
          />
        ))}
        {BIRDS.map((bird, index) => (
          <span
            key={index}
            className="city-bird"
            style={{
              top: bird.top,
              animationDelay: bird.delay,
              animationDuration: bird.duration,
            }}
          >
            <svg
              viewBox="0 0 26 12"
              width={36 * bird.scale}
              height={17 * bird.scale}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="city-bird-wing"
                d="M1 9 Q7 -1 13 8 Q19 -1 25 9"
                style={{ animationDelay: `${index * -0.17}s` }}
              />
            </svg>
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="city-skyline"
      >
        <defs>
          {/* estilo desenho: contorno escuro em volta de cada camada de prédios */}
          <InkFilter id="city-ink" width={2.5} offset={4} />
        </defs>
        {skyline.map((layer) => (
          <Skyline key={layer.name} layerName={layer.name} buildings={layer.buildings} />
        ))}
      </svg>

      {trip && <SkyTrip astro={trip} onClose={leave} />}
    </div>
  )
}
