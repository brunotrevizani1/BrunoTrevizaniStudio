// Lombada de um livro da estante; clicar abre o livro (BookViewer).
export default function SkillBook({ skill, color, width, height, isOut, onOpen }) {
  // nomes longos usam fonte menor para caber na altura da lombada
  const fontSize = Math.max(10, Math.min(13.6, 13.6 - Math.max(0, skill.name.length - 6) * 0.4))

  return (
    <button
      type="button"
      className={`book-spine${isOut ? ' is-out' : ''}`}
      style={{ '--bw': `${width}px`, '--bh': `${height}`, '--bc': color, '--fs': `${fontSize}px` }}
      onClick={(event) => onOpen(skill, event.currentTarget.getBoundingClientRect(), color)}
      aria-label={`Abrir livro de ${skill.name}`}
    >
      <span className="book-spine-title">{skill.name}</span>
    </button>
  )
}
