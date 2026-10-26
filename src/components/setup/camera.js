// Câmera do "cômodo" da aba Sobre mim. O palco tem coordenadas lógicas fixas e a câmera
// decide qual pedaço dele aparece: close-up do setup ou a estante de skills.

export const STAGE_W = 1200
export const STAGE_H = 730
export const NAV_H = 68

// Centro do close-up (monitor + teclado + mouse) e da estante (ver .skshelf no CSS).
const CLOSEUP_CENTER = { x: 750, y: 377 }
const SHELF_CENTER = { x: -820, y: 392 }

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))

/** Câmeras nomeadas para a área visível W x H (a faixa NAV_H do topo é da barra de navegação). */
export function computeCameras(width, height) {
  const availableH = height - NAV_H - 24
  return {
    closeup: {
      cx: CLOSEUP_CENTER.x,
      cy: CLOSEUP_CENTER.y,
      scale: clamp(Math.min(width / 960, (availableH - 70) / 564), 0.35, 1.6),
      offsetY: 34,
    },
    shelf: {
      cx: SHELF_CENTER.x,
      cy: SHELF_CENTER.y,
      scale: clamp(Math.min(width / 1180, availableH / 770), 0.3, 1.3),
      offsetY: 0,
    },
  }
}

/** transform do palco para que (cx, cy) fique no centro da área visível. */
export function cameraTransform(camera, width, height) {
  const tx = width / 2 - camera.cx * camera.scale
  const ty = NAV_H + (height - NAV_H) / 2 + camera.offsetY - camera.cy * camera.scale
  return `translate(${tx}px, ${ty}px) scale(${camera.scale})`
}

/**
 * Posição da câmera entre `from` e `to` (t de 0 a 1). `arc` afasta a câmera no meio do
 * caminho (zoom out e volta), para a panorâmica revelar o cômodo em vez de só deslizar.
 */
export function mixCameras(from, to, t, arc = 0) {
  const logScale = Math.log(from.scale) + (Math.log(to.scale) - Math.log(from.scale)) * t
  return {
    cx: from.cx + (to.cx - from.cx) * t,
    cy: from.cy + (to.cy - from.cy) * t,
    offsetY: from.offsetY + (to.offsetY - from.offsetY) * t,
    // o zoom interpola em escala logarítmica para a velocidade parecer constante
    scale: Math.exp(logScale - arc * Math.sin(Math.PI * t)),
  }
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
