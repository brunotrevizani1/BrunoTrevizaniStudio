// Transição Hero -> Sobre mim: a câmera dá zoom até uma janela acesa de um prédio e
// "atravessa" a janela. Ao subir, o caminho inverso (a janela encolhe até virar cidade).
// Tudo via DOM/rAF para o useFullPageScroll poder chamar sem passar pelo React.

const ZOOM_MS = 1500
const ZOOM_OUT_MS = 1250
const FADE_BACK_MS = 380
const ARRIVE_MS = 950

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const nextFrames = (count) =>
  new Promise((resolve) => {
    const tick = (left) => (left <= 0 ? resolve() : requestAnimationFrame(() => tick(left - 1)))
    tick(count)
  })
const clamp01 = (value) => Math.max(0, Math.min(1, value))

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Janela acesa do prédio da frente, perto de um ponto agradável da tela.
function pickWindow(scene) {
  const sceneRect = scene.getBoundingClientRect()
  const targetX = sceneRect.left + sceneRect.width * 0.33
  const targetY = sceneRect.top + sceneRect.height * 0.8

  let best = null
  let bestDistance = Infinity
  scene.querySelectorAll('.city-near .city-window.is-lit').forEach((element) => {
    const rect = element.getBoundingClientRect()
    if (rect.width < 1) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    if (cy < sceneRect.top || cy > sceneRect.bottom - 24) return
    const distance = (cx - targetX) ** 2 + (cy - targetY) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      best = { element, rect, cx, cy }
    }
  })
  if (!best) return null

  return {
    element: best.element,
    originX: best.cx - sceneRect.left,
    originY: best.cy - sceneRect.top,
    scale: Math.max(window.innerWidth / best.rect.width, window.innerHeight / best.rect.height) * 1.15,
  }
}

const OVERLAY_BACKGROUND = 'radial-gradient(circle at 50% 50%, #fff7cc 0%, #fde68a 55%, #f5c451 100%)'

// Cada transição liga o painel `index` ao `index + 1`.
const TRANSITIONS = {
  0: { upperId: 'top', lowerId: 'sobre', sceneSelector: '.city-scene', pick: pickWindow },
}

export const hasZoomTransition = (index) => Boolean(TRANSITIONS[index])

function createOverlay() {
  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '60',
    pointerEvents: 'none',
    opacity: '0',
    background: OVERLAY_BACKGROUND,
  })
  document.body.appendChild(overlay)
  return overlay
}

function runFrames(duration, onFrame) {
  return new Promise((resolve) => {
    const start = performance.now()
    const step = (now) => {
      const t = clamp01((now - start) / duration)
      onFrame(t)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

function getParts(index) {
  const transition = TRANSITIONS[index]
  if (!transition) return null
  const upper = document.getElementById(transition.upperId)
  const lower = document.getElementById(transition.lowerId)
  const scene = upper?.querySelector(transition.sceneSelector)
  return upper && lower && scene ? { transition, upper, lower, scene } : null
}

/**
 * Entra na janela e termina na aba de baixo. Retorna null se não der para fazer
 * (o chamador cai no scroll normal) ou uma Promise que resolve ao terminar.
 */
export function zoomForward(index, lowerTop) {
  const parts = getParts(index)
  if (!parts) return null
  const { transition, upper, lower, scene } = parts
  const pick = transition.pick(scene)
  if (!pick) return null

  const overlay = createOverlay()
  const logScale = Math.log(pick.scale)

  upper.dataset.zoom = 'in'
  scene.classList.add('is-zooming')
  pick.element.classList.add('is-target')
  scene.style.transformOrigin = `${pick.originX}px ${pick.originY}px`

  return runFrames(ZOOM_MS, (t) => {
    scene.style.transform = `scale(${Math.exp(logScale * easeInOutCubic(t))})`
    overlay.style.opacity = String(clamp01((t - 0.8) / 0.2))
  }).then(async () => {
    window.scrollTo(0, lowerTop)
    scene.style.transform = ''
    scene.style.transformOrigin = ''
    delete upper.dataset.zoom
    pick.element.classList.remove('is-target')
    scene.classList.remove('is-zooming')

    // chega no Sobre mim sempre de frente para o setup (close-up)
    lower.querySelector('.setup-scene')?.__setupCamera?.set('closeup')

    lower.classList.add('zoom-arrive')
    overlay.style.transition = 'opacity 700ms ease'
    overlay.style.opacity = '0'
    await sleep(ARRIVE_MS)
    lower.classList.remove('zoom-arrive')
    overlay.remove()
  })
}

/** Sai da aba de baixo: a janela "encolhe" e a cidade volta a aparecer. */
export function zoomBackward(index, upperTop) {
  const parts = getParts(index)
  if (!parts) return null
  const { transition, upper, scene } = parts
  const pick = transition.pick(scene)
  if (!pick) return null

  const overlay = createOverlay()
  const logScale = Math.log(pick.scale)

  overlay.style.transition = `opacity ${FADE_BACK_MS}ms ease`
  requestAnimationFrame(() => {
    overlay.style.opacity = '1'
  })

  return sleep(FADE_BACK_MS + 40).then(async () => {
    upper.dataset.zoom = 'in'
    scene.classList.add('is-zooming')
    pick.element.classList.add('is-target')
    scene.style.transformOrigin = `${pick.originX}px ${pick.originY}px`
    window.scrollTo(0, upperTop)

    // Primeiro rasteriza a cena em escala 1 (barato); só depois aplica o zoom enorme.
    // Começar já em scale(~100) faz o navegador rasterizar uma camada gigante e trava.
    scene.style.transform = 'scale(1)'
    await nextFrames(6)
    scene.style.transform = `scale(${pick.scale})`

    overlay.style.transition = 'opacity 800ms ease 120ms'
    overlay.style.opacity = '0'

    await runFrames(ZOOM_OUT_MS, (t) => {
      scene.style.transform = `scale(${Math.exp(logScale * (1 - easeInOutCubic(t)))})`
      if (t > 0.55) delete upper.dataset.zoom
    })

    scene.style.transform = ''
    scene.style.transformOrigin = ''
    delete upper.dataset.zoom
    pick.element.classList.remove('is-target')
    scene.classList.remove('is-zooming')
    overlay.remove()
  })
}
