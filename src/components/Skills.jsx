import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skills } from '../data/placeholders'

export default function Skills() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <Section id="skills" className="bg-surface/30">
      <SectionHeading
        eyebrow="Skills"
        title="Tecnologias que uso"
        description="Ferramentas e linguagens que fazem parte do meu dia a dia de trabalho."
      />

      <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            style={
              isVisible
                ? { animation: `fade-in-up 500ms ease-out ${index * 60}ms both` }
                : { opacity: 0 }
            }
            className="group flex flex-col gap-1 rounded-xl border border-border bg-surface px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-surface-hover"
          >
            <span className="font-display font-semibold text-text">{skill.name}</span>
            <span className="text-xs text-text-muted">{skill.category}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
