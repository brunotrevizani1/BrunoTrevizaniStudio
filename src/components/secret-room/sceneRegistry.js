import { lazy } from 'react'
import { FALLBACK_SCENE } from '../../data/projects'

// Todo cenário é descoberto pela pasta: scenes/<nome>/index.jsx. Sem eager, então cada um
// vira um chunk separado (com o próprio CSS) e só é baixado quando a porta é aberta.
const loaders = import.meta.glob('./scenes/*/index.jsx')

const pathOf = (sceneKey) => `./scenes/${sceneKey}/index.jsx`
const resolveKey = (sceneKey) => (loaders[pathOf(sceneKey)] ? sceneKey : FALLBACK_SCENE)

const cache = new Map()

/** Componente (lazy) do cenário; chaves desconhecidas caem no cenário "em construção". */
export function getScene(sceneKey) {
  const key = resolveKey(sceneKey)
  if (!cache.has(key)) cache.set(key, lazy(loaders[pathOf(key)]))
  return cache.get(key)
}

/** Começa a baixar o cenário antes do clique (hover/foco na porta). */
export function preloadScene(sceneKey) {
  loaders[pathOf(resolveKey(sceneKey))]()
}
