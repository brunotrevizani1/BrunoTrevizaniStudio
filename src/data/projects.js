// Lista central dos projetos da SALA SECRETA. Cada entrada vira uma porta no corredor
// (automaticamente) e abre o cenário indicado em `scene`.
//
// Para adicionar um projeto novo:
//   1. crie a pasta  src/components/secret-room/scenes/<nome>/index.jsx  (export default do cenário);
//   2. adicione uma entrada abaixo com  scene: '<nome>'.
// Sem `scene` (ou com um nome que não existe) o projeto usa o cenário "under-construction".
import { PRIVATE_REPO_ROUTE } from './placeholders'

export const FALLBACK_SCENE = 'under-construction'

/*
 * Campos:
 *  id          identificador único (usado em chaves e no foco do teclado)
 *  name        nome exibido na placa e no cenário
 *  tagline     frase curta (placa da porta / card no celular)
 *  description descrição do projeto
 *  tech        tecnologias usadas
 *  liveUrl     link do projeto no ar ('' = ainda não está no ar -> tela "em construção")
 *  repoUrl     link do código aberto
 *  privateCode true = código fechado: "Ver código" abre a tela /codigo-privado
 *  image       imagem/logo opcional (usada pelos cenários que quiserem)
 *  placeholder true = não é um projeto de verdade (esconde os botões)
 *  scene       pasta do cenário em components/secret-room/scenes
 *  door        aparência da porta: color (pintura), trim (batente), glow (luz que vaza),
 *              icon (camera | car | construction | ...), motif (photo | garage | construction),
 *              note (bilhetinho escrito à mão pendurado na porta)
 */
export const projects = [
  {
    id: 'photolumi',
    name: 'PhotoLumi',
    tagline: 'SaaS para fotógrafas',
    description:
      'Sistema de gestão para fotógrafas, onde facilita sua rotina e permite uma experiência única para o cliente da fotógrafa.',
    tech: ['Next.js', 'React', 'PostgreSQL', 'Cloudflare', 'Resend'],
    liveUrl: 'https://photolumi.com.br',
    repoUrl: '',
    privateCode: true,
    image: '/photoLumi.jpg',
    scene: 'photolumi',
    door: { color: '#5b5a45', trim: '#d9d4b8', glow: '#ffe7a3', icon: 'camera', motif: 'photo', note: 'silêncio, fotografando' },
  },
  {
    id: 'primegarage',
    name: 'PrimeGarage',
    tagline: 'Estética automotiva e lava-jato',
    description:
      'Sistema de gestão para lava-jatos, que centraliza os atendimentos, serviços, equipe e fluxo de clientes em um só lugar.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Express 5'],
    liveUrl: 'https://youtu.be/3iCAtry303U?si=acA8PlMHtZuiaizK',
    repoUrl: 'https://github.com/brunotrevizani1/primeGarage.git',
    privateCode: false,
    image: '/primeGarage.jpg',
    scene: 'primegarage',
    door: { color: '#1f4a3c', trim: '#9ec9b0', glow: '#9dffd0', icon: 'car', motif: 'garage', note: 'piso molhado!' },
  },
  {
    id: 'em-breve',
    name: 'Novos projetos',
    tagline: 'Obra em andamento',
    description: 'Tem coisa nova sendo construída por aqui. Os próximos projetos ganham a sua própria porta assim que ficarem prontos.',
    tech: [],
    liveUrl: '',
    repoUrl: '',
    privateCode: false,
    placeholder: true,
    scene: FALLBACK_SCENE,
    door: { color: '#a16207', trim: '#fde047', glow: '#ffd24a', icon: 'construction', motif: 'construction', note: 'volto já' },
  },
]

// As telas /codigo-privado e /em-construcao recebem ?projeto=<id> para o "Voltar" reabrir a sala
// secreta já no cenário daquele projeto (ver ResumeProject em SecretRoomContext).
const PROJECT_PARAM = 'projeto'

/** Rota interna marcada com o projeto de onde o visitante saiu. */
export function withProject(route, project) {
  return `${route}?${PROJECT_PARAM}=${encodeURIComponent(project.id)}`
}

/** Projeto indicado no ?projeto= da URL atual (ou null). */
export function projectFromUrl() {
  const id = new URLSearchParams(window.location.search).get(PROJECT_PARAM)
  return projects.find((project) => project.id === id && !project.placeholder) ?? null
}

/** Para onde o "Voltar" das telas internas leva: o projeto de origem ou o início. */
export function backLink() {
  const project = projectFromUrl()
  return project
    ? { href: withProject('/', project), label: `Voltar para o ${project.name}` }
    : { href: '/', label: 'Voltar para o início' }
}

/** Destino do botão "Ver código" de um projeto (ou null quando não há código para mostrar). */
export function codeLink(project) {
  if (project.privateCode) return { href: withProject(PRIVATE_REPO_ROUTE, project), external: false }
  if (project.repoUrl) return { href: project.repoUrl, external: true }
  return null
}
