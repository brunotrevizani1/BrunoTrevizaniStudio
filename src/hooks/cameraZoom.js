// Zoom de câmera no mesmo estilo do mergulho na janela do prédio (windowZoom.js): a escala cresce
// em curva logarítmica com easeInOutCubic, até o alvo preencher a tela, e um véu de cor cobre o
// final. Usado na estante (passagem escura) e nas portas da sala secreta.

const clamp01 = (value) => Math.max(0, Math.min(1, value))

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

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

/** Escala que faz um retângulo (rect) preencher a tela inteira. */
export function fitScale(rect) {
  return Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.15
}

/** Véu de cor em tela cheia (começa invisível, por padrão) para cobrir o fim do zoom. */
export function createVeil(background, opacity = 0) {
  const veil = document.createElement('div')
  Object.assign(veil.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '60',
    pointerEvents: 'none',
    opacity: String(opacity),
    background,
  })
  document.body.appendChild(veil)
  return veil
}

/** Aproxima a câmera de (originX, originY) — coordenadas dentro do elemento — até `scale`. */
export function zoomIn(element, { originX, originY, scale }, duration, veil) {
  const logScale = Math.log(scale)
  element.__zoomScale = scale
  element.style.willChange = 'transform'
  element.style.transformOrigin = `${originX}px ${originY}px`
  return runFrames(duration, (t) => {
    element.style.transform = `scale(${Math.exp(logScale * easeInOutCubic(t))})`
    if (veil) veil.style.opacity = String(clamp01((t - 0.8) / 0.2))
  })
}

export function resetZoom(element) {
  element.style.transform = ''
  element.style.transformOrigin = ''
  element.style.willChange = ''
  delete element.__zoomScale
}

/**
 * Caminho inverso do zoomIn: o elemento está em `scale` (ver zoomIn) e volta a 1 enquanto o véu
 * (que começa opaco) some. O will-change do zoomIn mantém a textura, então a volta é barata.
 */
export function zoomOut(element, duration, veil) {
  const logScale = Math.log(element.__zoomScale ?? 1)
  return runFrames(duration, (t) => {
    element.style.transform = `scale(${Math.exp(logScale * (1 - easeInOutCubic(t)))})`
    if (veil) veil.style.opacity = String(1 - clamp01(t / 0.7))
  })
}
