import { useCallback, useEffect, useRef, useState } from 'react'
import SkillBook from './SkillBook'
import BookViewer from './BookViewer'
import { CATEGORY_COLORS, FALLBACK_DETAILS, groupedSkills, hashOf } from './shelfData'
import { skillDetails } from '../../data/skillDetails'
import { useSecretRoom } from '../secret-room/SecretRoomContext'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { createVeil, fitScale, resetZoom, zoomIn, zoomOut } from '../../hooks/cameraZoom'
import {
  Basket,
  Frame,
  Globe,
  Hourglass,
  HorizontalStack,
  Plant,
  Trophy,
} from '../setup/ShelfDecor'

// Enfeites no fim de cada prateleira de livros.
function DecorSvg({ width, children }) {
  return (
    <svg viewBox={`0 0 ${width} 110`} width={width} height="110" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

const ROW_DECOR = {
  Frontend: (
    <DecorSvg width={150}>
      <Plant x={6} floorY={110} />
      <Frame x={86} floorY={110} />
    </DecorSvg>
  ),
  Backend: (
    <DecorSvg width={150}>
      <HorizontalStack x={4} floorY={110} seed={5} />
      <Trophy x={86} floorY={110} />
    </DecorSvg>
  ),
  Ferramentas: (
    <DecorSvg width={150}>
      <Basket x={0} floorY={110} />
      <Plant x={92} floorY={110} />
    </DecorSvg>
  ),
}

// tempos da cena da alavanca (ms): livro inclina -> estante gira devagar -> câmera mergulha no escuro
const LEVER_MS = 700
const SWING_MS = 2300
const ZOOM_MS = 1600
const PASSAGE_VEIL = '#0a0709'
const ROOM_FADE_MS = 700
const ZOOM_BACK_MS = 1500
const SHELF_CLOSE_MS = 1500

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Estante de skills do cômodo: prateleira de enfeites no topo + uma prateleira por categoria.
 * O livro "Projetos" é uma alavanca: ao puxá-lo (clique, ou rolar para baixo no useFullPageScroll)
 * a estante gira nas dobradiças, revela a passagem e a câmera entra na sala secreta.
 */
export default function SkillsShelf() {
  const [active, setActive] = useState(null)
  const [swing, setSwing] = useState('closed')
  const shelfRef = useRef(null)
  const swingRef = useRef('closed')
  const passageRef = useRef(null)
  const { openRoom, preload } = useSecretRoom()
  const reduced = usePrefersReducedMotion()
  const shelves = groupedSkills()

  const handleOpen = useCallback((skill, rect, color) => setActive({ skill, rect, color }), [])
  const handleClosed = useCallback(() => setActive(null), [])

  const pull = useCallback(() => {
    const shelf = shelfRef.current
    const scene = shelf?.closest('.setup-scene')
    if (!shelf || !scene || swingRef.current !== 'closed') return Promise.resolve()
    swingRef.current = 'opening'
    if (shelf.__lever) shelf.__lever.used = true

    const run = async () => {
      preload()
      setSwing('pulling')
      await wait(reduced ? 250 : LEVER_MS)
      setSwing('open')
      await wait(reduced ? 1300 : SWING_MS)

      // mergulha no escuro da passagem, como no zoom da janela do prédio
      const passage = passageRef.current.getBoundingClientRect()
      const sceneRect = scene.getBoundingClientRect()
      const veil = createVeil(PASSAGE_VEIL)
      await zoomIn(
        scene,
        {
          originX: passage.left + passage.width * 0.62 - sceneRect.left,
          originY: passage.top + passage.height * 0.55 - sceneRect.top,
          scale: fitScale({ width: passage.width * 0.1, height: passage.height * 0.1 }),
        },
        ZOOM_MS,
        veil,
      )

      swingRef.current = 'open'
      let leaving = Promise.resolve()
      openRoom({
        onClosing: ({ quick } = {}) => {
          // veio de um link do cabeçalho: a página vai seguir para outra aba, então só desfaz o zoom
          if (quick) {
            resetZoom(scene)
            return
          }
          // caminho inverso do mergulho: a sala some, a câmera sai da passagem (zoom out, como na
          // janela do prédio) e só então a estante fecha
          if (shelf.__lever) shelf.__lever.busy = true
          leaving = (async () => {
            const back = createVeil(PASSAGE_VEIL, 1)
            await wait(ROOM_FADE_MS)
            await zoomOut(scene, ZOOM_BACK_MS, back)
            resetZoom(scene)
            back.remove()
          })()
        },
        onClosed: () => {
          leaving.then(() => {
            swingRef.current = 'closed'
            setSwing('closed')
            setTimeout(() => {
              if (shelf.__lever) shelf.__lever.busy = false
            }, SHELF_CLOSE_MS)
          })
        },
      })
      // a sala chega saindo do preto: o véu some por baixo dela
      setTimeout(() => {
        veil.style.transition = 'opacity 500ms ease'
        veil.style.opacity = '0'
        setTimeout(() => veil.remove(), 550)
      }, 200)
    }
    return run()
  }, [openRoom, preload, reduced])

  // o useFullPageScroll puxa a alavanca quando o visitante rola para baixo na estante
  useEffect(() => {
    const shelf = shelfRef.current
    shelf.__lever = { used: shelf.__lever?.used ?? false, busy: shelf.__lever?.busy ?? false, pull }
    return () => {
      delete shelf.__lever
    }
  }, [pull])

  return (
    <>
      <div ref={passageRef} className={`skshelf-passage${swing === 'open' ? ' is-lit' : ''}`} aria-hidden="true" />
      <div ref={shelfRef} className={`skshelf${swing === 'closed' ? '' : swing === 'pulling' ? ' is-pulling' : ' is-open'}`}>
        <div className="skshelf-lights" aria-hidden="true" />
        <div className="skshelf-crown">
          <span className="skshelf-sign">Cada livro é uma linguagem ou ferramenta usada nos meus projetos</span>        </div>

        <div className="skshelf-inner">
          {/* prateleira de enfeites */}
          <div className="skshelf-row skshelf-row-display">
            <svg viewBox="0 0 684 108" width="684" height="108" fill="none" aria-hidden="true">
              <Plant x={22} floorY={108} />
              <Frame x={92} floorY={108} />
              <Globe x={168} floorY={108} />
              <Trophy x={256} floorY={108} />
              <Hourglass x={330} floorY={108} />
              <HorizontalStack x={398} floorY={108} seed={9} />
              <Plant x={590} floorY={108} />
            </svg>
            <button
              type="button"
              className="book-lever"
              onClick={pull}
              aria-label="Puxar o livro Projetos e abrir a passagem secreta"
            >
              <span className="book-lever-body">
                <span className="book-lever-tag" aria-hidden="true">Puxe</span>
                <span className="book-spine-title">Projetos</span>
              </span>
            </button>
          </div>
          <div className="skshelf-plank" />

          {shelves.map(([category, items]) => {
            const palette = CATEGORY_COLORS[category] ?? ['#475569']
            return (
              <div key={category}>
                <div className="skshelf-row">
                  <span className="skshelf-plaque">{category}</span>
                  <div className="skshelf-books">
                    {items.map((skill, index) => {
                      const hash = hashOf(skill.name)
                      return (
                        <SkillBook
                          key={skill.name}
                          skill={skill}
                          color={palette[index % palette.length]}
                          width={40 + Math.round(hash * 16)}
                          height={0.78 + hash * 0.22}
                          isOut={active?.skill.name === skill.name}
                          onOpen={handleOpen}
                        />
                      )
                    })}
                  </div>
                  <div className="skshelf-decor">{ROW_DECOR[category]}</div>
                </div>
                <div className="skshelf-plank" />
              </div>
            )
          })}
        </div>
        <div className="skshelf-base" />

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
    </>
  )
}
