import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

// Interação do lava-jato: a mão com esponja passa espuma na lataria e a lavadora (mangueira de
// verdade, com comprimento limitado) joga água em gotas, no mesmo estilo do regador da planta.

const INK = '#1e1b3a'

// gotas: mesmas cores/forma do regador (ver PlantViewer)
const DROPS_PER_S = 260
const GRAVITY = 1500
const FLIGHT_S = [0.26, 0.38]
const SPREAD_PX = 9
const ERASE_UNITS = 26 // raio da água sobre a lataria (unidades do desenho do carro)

const GUN_STANDOFF = 150 // a pistola fica um pouco antes do ponto mirado
const GUN_LENGTH = 30

// a lataria é dividida em pedacinhos: cada um tocado pela esponja ganha uma bolha. Isso dá a
// porcentagem de cobertura e um limite natural de bolhas, sem nada sumir para dar lugar ao novo
const FOAM_CELL = 13
const SPONGE_UNITS = 26 // raio da esponja sobre a lataria (unidades do desenho do carro)

/**
 * Espuma passada pelo visitante, recortada no formato da lataria (viewBox do carro 566 x 214).
 * onCoverage recebe a fração da lataria com espuma (0 a 1) sempre que ela muda.
 */
export const FoamLayer = forwardRef(function FoamLayer({ bodyPath, onCoverage }, ref) {
  const svgRef = useRef(null)
  const bodyRef = useRef(null)
  const nextId = useRef(0)
  const cells = useRef([])
  const [foam, setFoam] = useState([])

  useLayoutEffect(() => {
    const body = bodyRef.current
    const found = []
    for (let x = FOAM_CELL / 2; x < 566; x += FOAM_CELL) {
      for (let y = FOAM_CELL / 2; y < 214; y += FOAM_CELL) {
        if (body.isPointInFill(new DOMPoint(x, y))) found.push({ key: `${x}:${y}`, x, y })
      }
    }
    cells.current = found
  }, [])

  useEffect(() => {
    onCoverage(cells.current.length ? foam.length / cells.current.length : 0)
  }, [foam, onCoverage])

  const foamCells = (chosen) => {
    const bubbles = chosen.map((cell) => ({
      id: nextId.current++,
      key: cell.key,
      x: cell.x + (Math.random() - 0.5) * 12,
      y: cell.y + (Math.random() - 0.5) * 12,
      r: 11 + Math.random() * 7,
    }))
    setFoam((current) => {
      const taken = new Set(current.map((bubble) => bubble.key))
      const fresh = bubbles.filter((bubble) => !taken.has(bubble.key))
      return fresh.length ? [...current, ...fresh] : current
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      toCar(clientX, clientY) {
        const matrix = svgRef.current?.getScreenCTM()
        return matrix ? new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse()) : null
      },
      onBody: (point) => bodyRef.current.isPointInFill(point),
      dab(point) {
        foamCells(cells.current.filter((cell) => Math.hypot(cell.x - point.x, cell.y - point.y) <= SPONGE_UNITS))
      },
      fill: () => foamCells(cells.current),
      clear: () => setFoam([]),
      erase(point) {
        setFoam((current) => {
          const next = current.filter((bubble) => Math.hypot(bubble.x - point.x, bubble.y - point.y) > bubble.r + ERASE_UNITS)
          return next.length === current.length ? current : next
        })
      },
    }),
    [],
  )

  return (
    <svg ref={svgRef} className="pg-foam-layer" viewBox="0 0 566 214" aria-hidden="true">
      <defs>
        <clipPath id="pg-user-clip">
          <path d={bodyPath} />
        </clipPath>
      </defs>
      <path ref={bodyRef} d={bodyPath} fill="none" />
      <g clipPath="url(#pg-user-clip)">
        {foam.map((bubble) => (
          <circle key={bubble.id} className="pg-dab" cx={bubble.x} cy={bubble.y} r={bubble.r} />
        ))}
      </g>
    </svg>
  )
})

// luva de borracha: coordenadas com a origem nos nós dos dedos e os dedos para cima; o conjunto
// é desenhado duas vezes (contorno e cor) para virar uma silhueta só, sem linhas entre as partes
const GLOVE_SHAPE = (
  <>
    <rect x="-25" y="-30" width="13" height="38" rx="6.5" />
    <rect x="-12" y="-36" width="13" height="44" rx="6.5" />
    <rect x="1" y="-34" width="13" height="42" rx="6.5" />
    <rect x="14" y="-26" width="13" height="34" rx="6.5" />
    <rect x="-46" y="8" width="32" height="15" rx="7.5" transform="rotate(25 -14 16)" />
    <rect x="-27" y="-4" width="56" height="46" rx="18" />
    <rect x="-17" y="36" width="36" height="16" />
  </>
)

// mão de luva segurando a esponja (o centro da esponja fica na ponta do ponteiro; o braço entra
// pela direita, de baixo, para não cobrir o que está sendo lavado)
function SpongeHand() {
  const outline = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg className="pg-sponge-svg" viewBox="0 0 130 130" aria-hidden="true">
      <defs>
        <clipPath id="pg-sponge-clip">
          <rect x="14" y="50" width="72" height="46" rx="12" />
        </clipPath>
      </defs>
      {/* esponja */}
      <rect x="14" y="50" width="72" height="46" rx="12" fill="#facc15" {...outline} />
      <g clipPath="url(#pg-sponge-clip)">
        <rect x="14" y="50" width="72" height="16" fill="#34d399" />
        <circle cx="30" cy="80" r="3.5" fill="#ca8a04" />
        <circle cx="50" cy="86" r="3" fill="#ca8a04" />
        <circle cx="68" cy="78" r="3.5" fill="#ca8a04" />
        <circle cx="60" cy="72" r="2.5" fill="#ca8a04" />
      </g>
      <rect x="14" y="50" width="72" height="46" rx="12" fill="none" {...outline} />
      <g transform="translate(82 92) rotate(-38)">
        {/* manga */}
        <rect x="-18" y="62" width="38" height="90" fill="#ffffff" {...outline} />
        <g fill={INK} stroke={INK} strokeWidth="8" strokeLinejoin="round">
          {GLOVE_SHAPE}
        </g>
        <g fill="#60a5fa">{GLOVE_SHAPE}</g>
        {/* divisão dos dedos, brilho e punho da luva */}
        <path d="M-12 -22 V8 M1 -24 V8 M14 -20 V8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M-17 12 Q-16 26 -7 30" fill="none" stroke="#bfdbfe" strokeWidth="4" strokeLinecap="round" />
        <rect x="-24" y="46" width="50" height="20" rx="6" fill="#2563eb" {...outline} />
      </g>
    </svg>
  )
}

/**
 * Camada que cobre a cena quando uma ferramenta está na mão: captura o ponteiro, mostra a mão com
 * esponja (sabão) ou a mangueira com a pistola e as gotas (lavadora).
 */
export function WashOverlay({ tool, washerRef, foamRef, onDrop }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const spongeRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0, inside: false, down: false, lastDab: null })

  const local = (event) => {
    const rect = rootRef.current.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, left: rect.left, top: rect.top }
  }

  const dabAt = (event) => {
    const foam = foamRef.current
    const point = foam?.toCar(event.clientX, event.clientY)
    if (!point || !foam.onBody(point)) return
    const last = pointer.current.lastDab
    if (last && Math.hypot(point.x - last.x, point.y - last.y) < 11) return
    pointer.current.lastDab = point
    foam.dab(point)
  }

  const onPointerMove = (event) => {
    const { x, y } = local(event)
    const state = pointer.current
    state.x = x
    state.y = y
    state.inside = true
    if (spongeRef.current) spongeRef.current.style.transform = `translate(${x - 50}px, ${y - 78}px)`
    if (tool === 'soap' && state.down) dabAt(event)
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    onPointerMove(event)
    pointer.current.down = true
    pointer.current.lastDab = null
    rootRef.current.dataset.down = 'true'
    if (tool === 'soap') dabAt(event)
  }

  const onPointerUp = () => {
    pointer.current.down = false
    delete rootRef.current.dataset.down
  }

  const onPointerLeave = () => {
    if (!pointer.current.down) pointer.current.inside = false
  }

  // lavadora: mangueira, pistola, gotas e respingos desenhados num canvas
  useEffect(() => {
    if (tool !== 'water') return undefined
    const canvas = canvasRef.current
    const root = rootRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0
    const resize = () => {
      const rect = root.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(root)

    let drops = []
    let splashes = []
    let pending = 0
    let prev = performance.now()
    let frame = 0

    const step = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      const state = pointer.current
      const rootRect = root.getBoundingClientRect()
      const washer = washerRef.current.getBoundingClientRect()
      const anchor = { x: washer.left - rootRect.left + washer.width * 0.82, y: washer.top - rootRect.top + washer.height * 0.54 }
      const maxHose = width * 0.5
      const maxRange = width * 0.3

      // pistola na mão do visitante (sempre ligada à lavadora pela mangueira, com comprimento limitado)
      let gun
      let hit = null
      if (state.inside) {
        const dx = state.x - anchor.x
        const dy = state.y - anchor.y
        const dist = Math.hypot(dx, dy) || 1
        const ux = dx / dist
        const uy = dy / dist
        const gunDist = Math.max(0, Math.min(dist - GUN_STANDOFF, maxHose))
        gun = { x: anchor.x + ux * gunDist, y: anchor.y + uy * gunDist, ux, uy }
        const reach = Math.min(dist - gunDist, maxRange)
        hit = { x: gun.x + ux * (reach + GUN_LENGTH), y: gun.y + uy * (reach + GUN_LENGTH) }
      } else {
        gun = { x: anchor.x - 90, y: anchor.y + 12, ux: -1, uy: -0.2 }
      }
      const tip = { x: gun.x + gun.ux * GUN_LENGTH, y: gun.y + gun.uy * GUN_LENGTH }

      if (state.down && hit) {
        pending += DROPS_PER_S * dt
        while (pending >= 1) {
          pending -= 1
          const flight = FLIGHT_S[0] + Math.random() * (FLIGHT_S[1] - FLIGHT_S[0])
          const tx = hit.x + (Math.random() * 2 - 1) * SPREAD_PX
          const ty = hit.y + (Math.random() * 2 - 1) * SPREAD_PX
          drops.push({
            x: tip.x,
            y: tip.y,
            vx: (tx - tip.x) / flight,
            vy: (ty - tip.y) / flight - 0.5 * GRAVITY * flight,
            life: flight,
            r: 1.6 + Math.random() * 1.6,
          })
        }
        const point = foamRef.current?.toCar(rootRect.left + hit.x, rootRect.top + hit.y)
        if (point) foamRef.current.erase(point)
      } else {
        pending = 0
      }

      const kept = []
      for (const drop of drops) {
        drop.vy += GRAVITY * dt
        drop.x += drop.vx * dt
        drop.y += drop.vy * dt
        drop.life -= dt
        if (drop.life > 0) kept.push(drop)
        else if (Math.random() < 0.3) splashes.push({ x: drop.x, y: drop.y, life: 1 })
      }
      drops = kept
      splashes = splashes.filter((splash) => (splash.life -= dt * 3) > 0)

      ctx.clearRect(0, 0, width, height)

      // mangueira: cai em curva e estica quando chega no limite
      const length = Math.hypot(gun.x - anchor.x, gun.y - anchor.y)
      const slack = Math.max(0, maxHose - length)
      const sag = Math.min(190, slack * 0.55)
      const cx = (anchor.x + gun.x) / 2
      const cy = (anchor.y + gun.y) / 2 + sag
      const hose = () => {
        ctx.beginPath()
        ctx.moveTo(anchor.x, anchor.y)
        ctx.quadraticCurveTo(cx, cy, gun.x, gun.y)
      }
      ctx.lineCap = 'round'
      hose()
      ctx.strokeStyle = INK
      ctx.lineWidth = 15
      ctx.stroke()
      hose()
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 9
      ctx.stroke()
      hose()
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.85)'
      ctx.lineWidth = 3
      ctx.setLineDash([26, 22])
      ctx.stroke()
      ctx.setLineDash([])

      // pistola
      ctx.save()
      ctx.translate(gun.x, gun.y)
      ctx.rotate(Math.atan2(gun.uy, gun.ux))
      ctx.fillStyle = '#facc15'
      ctx.strokeStyle = INK
      ctx.lineWidth = 3.5
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.roundRect(-12, -9, 28, 18, 5)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#9ca3af'
      ctx.beginPath()
      ctx.roundRect(14, -5, GUN_LENGTH - 12, 10, 3)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.roundRect(-6, 7, 10, 14, 3)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // gotas (esticadas na direção em que caem) e respingos
      ctx.fillStyle = 'rgba(127, 209, 255, 0.92)'
      for (const drop of drops) {
        const stretch = Math.min(3, 1 + Math.hypot(drop.vx, drop.vy) / 260)
        ctx.beginPath()
        ctx.ellipse(drop.x, drop.y, drop.r * stretch, drop.r, Math.atan2(drop.vy, drop.vx), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)'
      ctx.lineWidth = 1.5
      for (const splash of splashes) {
        ctx.globalAlpha = splash.life
        ctx.beginPath()
        ctx.ellipse(splash.x, splash.y, 3 + (1 - splash.life) * 9, 1.5 + (1 - splash.life) * 3, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [tool, washerRef, foamRef])

  return (
    <div
      ref={rootRef}
      className="pg-aim"
      data-tool={tool}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      // a etapa pode acabar com o botão ainda pressionado: sem isto o arraste seguiria selecionando a página
      onMouseDown={(event) => event.preventDefault()}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      onContextMenu={(event) => {
        event.preventDefault()
        onDrop()
      }}
    >
      {tool === 'water' && <canvas ref={canvasRef} className="pg-spray" />}
      {tool === 'soap' && (
        <div ref={spongeRef} className="pg-sponge">
          <SpongeHand />
        </div>
      )}
    </div>
  )
}
