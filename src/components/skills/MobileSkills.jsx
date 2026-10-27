import { useCallback, useState } from 'react'
import SkillBook from './SkillBook'
import BookViewer from './BookViewer'
import { CATEGORY_COLORS, FALLBACK_DETAILS, groupedSkills, hashOf } from './shelfData'
import { skillDetails } from '../../data/skillDetails'
import SecretRoomButton from '../secret-room/SecretRoomButton'

/** Versão para telas pequenas: as mesmas lombadas, em prateleiras simples (o cômodo só cabe no desktop). */
export default function MobileSkills() {
  const [active, setActive] = useState(null)
  const shelves = groupedSkills()

  const handleOpen = useCallback((skill, rect, color) => setActive({ skill, rect, color }), [])
  const handleClosed = useCallback(() => setActive(null), [])

  return (
    <div id="skills" className="mt-12">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Skills</p>
      <h3 className="mb-1 font-display text-2xl font-bold text-text">
        Cada livro é uma linguagem ou ferramenta usada nos meus projetos
      </h3>
      <p className="mb-5 text-sm text-text-muted">Toque em um livro para abrir.</p>

      <div className="mobile-shelf">
        {shelves.map(([category, items]) => {
          const palette = CATEGORY_COLORS[category] ?? ['#475569']
          return (
            <div key={category} className="mobile-shelf-row">
              <span className="mobile-shelf-label">{category}</span>
              <div className="mobile-shelf-books">
                {items.map((skill, index) => {
                  const hash = hashOf(skill.name)
                  return (
                    <SkillBook
                      key={skill.name}
                      skill={skill}
                      color={palette[index % palette.length]}
                      width={38 + Math.round(hash * 12)}
                      height={0.8 + hash * 0.2}
                      isOut={active?.skill.name === skill.name}
                      onOpen={handleOpen}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm text-text-muted">Tem uma passagem secreta aqui: os meus projetos.</p>
        <SecretRoomButton />
      </div>

      {active && (
        <BookViewer
          skill={active.skill}
          category={active.skill.category}
          details={skillDetails[active.skill.name] ?? FALLBACK_DETAILS}
          color={active.color}
          originRect={active.rect}
          onClosed={handleClosed}
        />
      )}
    </div>
  )
}
