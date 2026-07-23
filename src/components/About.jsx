import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { about } from '../data/placeholders'

export default function About() {
  return (
    <Section id="sobre" className="min-h-screen flex items-center">
      <SectionHeading
        eyebrow="Sobre mim"
        title="Quem escreve o código"
        description="Um pouco da minha trajetória e do que me move no dia a dia."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg leading-relaxed text-text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {about.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
