import { skills } from '../../data/placeholders'

export const CATEGORY_ORDER = ['Frontend', 'Backend', 'Ferramentas']

// Cores de capa por categoria (cada prateleira tem a sua família de cores).
export const CATEGORY_COLORS = {
  Frontend: ['#1e3a8a', '#1d4ed8', '#0e7490', '#0f766e'],
  Backend: ['#9f1239', '#be123c', '#7c2d12', '#b45309'],
  Ferramentas: ['#166534', '#365314', '#4d7c0f', '#a16207'],
}

export const FALLBACK_DETAILS = {
  tagline: 'Ferramenta do meu dia a dia',
  description: 'Tecnologia que faz parte do meu conjunto de ferramentas de trabalho.',
  facts: [['Categoria', '—']],
}

// Hash simples do nome para variar largura e altura de cada lombada de forma estável.
export function hashOf(text) {
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 9973
  }
  return hash / 9973
}

/** [[categoria, skills[]], ...] na ordem das prateleiras (categorias vazias ficam de fora). */
export function groupedSkills() {
  const groups = new Map(CATEGORY_ORDER.map((category) => [category, []]))
  skills.forEach((skill) => {
    if (!groups.has(skill.category)) groups.set(skill.category, [])
    groups.get(skill.category).push(skill)
  })
  return Array.from(groups.entries()).filter(([, items]) => items.length > 0)
}
