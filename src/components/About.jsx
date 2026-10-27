import { Code, Coffee, Flag, Lightbulb, Mountain, Rocket, TrendingUp } from 'lucide-react'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import DeskScene from './DeskScene'
import SetupStage from './setup/SetupStage'
import MobileSkills from './skills/MobileSkills'
import { useLamp } from '../context/LampContext'
import { about } from '../data/placeholders'

// Versão para telas pequenas: post-its simples (o setup completo só cabe no desktop).
// Visual de cada post-it, na mesma ordem de about.sections.
const NOTES = [
  { icon: Rocket, color: 'postit-yellow', rotation: '-2deg' },
  { icon: Code, color: 'postit-green', rotation: '1deg' },
  { icon: Coffee, color: 'postit-pink', rotation: '1.5deg' },
  { icon: TrendingUp, color: 'postit-orange', rotation: '-1.5deg' },
  { icon: Flag, color: 'postit-blue', rotation: '2deg' },
  { icon: Mountain, color: 'postit-yellow', rotation: '-1deg' },
  { icon: Lightbulb, color: 'postit-pink', rotation: '1.5deg' },
]

const STICKER_ROTATIONS = ['-3deg', '2deg', '-1.5deg']

function MobileAbout() {
  return (
    <div className="lg:hidden">
      <SectionHeading
        eyebrow="Sobre mim"
        title="Quem escreve o código"
        description="Um pouco da minha trajetória e do que me move no dia a dia."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {about.sections.map((section, index) => {
          const note = NOTES[index % NOTES.length]
          const Icon = note.icon
          return (
            <article
              key={index}
              className={`postit ${note.color}`}
              style={{ '--r': note.rotation }}
            >
              <h3 className="postit-title">
                <Icon size={20} className="mr-1.5 inline-block -translate-y-0.5" strokeWidth={2.5} />
                {section.title}
              </h3>
              <p className="postit-text">{section.text}</p>
            </article>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {about.highlights.map((item, index) => (
          <div
            key={item.label}
            className="sticker"
            style={{ '--r': STICKER_ROTATIONS[index % STICKER_ROTATIONS.length] }}
          >
            <p className="font-display text-base font-bold leading-tight">{item.value}</p>
            <p className="text-xs opacity-70">{item.label}</p>
          </div>
        ))}
      </div>

      <MobileSkills />
    </div>
  )
}

export default function About() {
  const { isOn } = useLamp()
  const isNight = !isOn

  return (
    <Section
      id="sobre"
      data-night={isNight}
      className="about-scope"
      contentClassName="lg:absolute lg:inset-0 lg:mx-0 lg:max-w-none lg:px-0"
      background={
        <>
          <div className="lg:hidden">
            <DeskScene isNight={isNight} />
          </div>
          <div
            aria-hidden="true"
            data-night={isNight}
            className="desk-scene pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
          >
            <div className="desk-wall" />
            <div className="desk-wall-glow" />
          </div>
        </>
      }
    >
      <MobileAbout />
      <div className="hidden h-full lg:block" data-night={isNight}>
        <SetupStage isNight={isNight} />
      </div>
    </Section>
  )
}
