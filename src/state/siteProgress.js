import { useSyncExternalStore } from 'react'

// Onde o visitante está dentro das abas que têm "quadros" (estante de skills e sala de projetos).
// Quem controla a câmera/sala publica aqui; a linha do tempo (Timeline) só lê.
let state = { shelf: false, roomOpen: false, project: null, exitDown: false }
const listeners = new Set()

export function setSiteProgress(patch) {
  const next = { ...state, ...patch }
  if (Object.keys(patch).every((key) => next[key] === state[key])) return
  state = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useSiteProgress = () => useSyncExternalStore(subscribe, () => state)
