import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Quadros ao lado da estante: na parede mostram uma "capa" genérica; clicar vira o quadro
// enquanto ele vem para perto, e do outro lado está a foto (arquivos em public/fotos).
const PHOTOS = [
  { src: '/fotos/foto-1.jpg', width: 688, height: 404, cover: 'a', alt: 'Foto de família no boliche' },
  { src: '/fotos/foto-2.jpg', width: 575, height: 423, cover: 'b', alt: 'Foto de família num restaurante' },
  { src: '/fotos/foto-3.jpg', width: 575, height: 401, cover: 'c', alt: 'Foto de família num passeio à noite' },
  { src: '/fotos/foto-4.jpg', width: 720, height: 960, cover: 'd', alt: 'Foto de infância no banco de trás do carro' },
]

const FLIP_MS = 900
// as fotos são pequenas: não amplia muito além do tamanho original para não borrar
const MAX_UPSCALE = 1.3

function targetSize(photo) {
  const scale = Math.min(
    (window.innerWidth - 48) / photo.width,
    (window.innerHeight - 140) / photo.height,
    MAX_UPSCALE,
  )
  return { width: Math.round(photo.width * scale), height: Math.round(photo.height * scale) }
}

/** Fases: start (no lugar do quadro) -> in (virado, no centro) -> out -> (onClosed) */
function PhotoViewer({ photo, originRect, onClosed }) {
  const [phase, setPhase] = useState('start')
  const [size, setSize] = useState(() => targetSize(photo))

  useEffect(() => {
    const update = () => setSize(targetSize(photo))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [photo])

  useEffect(() => {
    document.documentElement.dataset.modal = 'photo'
    return () => {
      delete document.documentElement.dataset.modal
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (phase !== 'out') return undefined
    const timer = setTimeout(onClosed, FLIP_MS)
    return () => clearTimeout(timer)
  }, [phase, onClosed])

  const close = useCallback(() => setPhase('out'), [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const onWall = phase !== 'in'
  const dx = originRect.left + originRect.width / 2 - window.innerWidth / 2
  const dy = originRect.top + originRect.height / 2 - window.innerHeight / 2

  const cardStyle = {
    width: size.width,
    height: size.height,
    marginLeft: -size.width / 2,
    marginTop: -size.height / 2,
    transform: onWall
      ? `translate(${dx}px, ${dy}px) scale(${originRect.width / size.width}, ${originRect.height / size.height}) rotateY(0deg)`
      : 'translate(0px, 0px) scale(1, 1) rotateY(180deg)',
    transition: phase === 'start' ? 'none' : `transform ${FLIP_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`,
  }

  return createPortal(
    <div className="photo-scene" role="dialog" aria-modal="true" aria-label={photo.alt}>
      <div className="book-backdrop" style={{ opacity: onWall ? 0 : 1 }} onClick={close} />

      <button
        type="button"
        className="toon-btn toon-btn-icon book-close"
        style={{ opacity: onWall ? 0 : 1, pointerEvents: onWall ? 'none' : 'auto' }}
        onClick={close}
        aria-label="Devolver o quadro para a parede"
      >
        <X size={18} strokeWidth={3} />
      </button>

      <div className="photo-card" style={cardStyle} onClick={close}>
        <div className={`photo-face photo-front room-frame-cover-${photo.cover}`} />
        <div className="photo-face photo-back">
          <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} draggable={false} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function PhotoFrames() {
  const [open, setOpen] = useState(null)

  // a foto já vem carregada antes do clique, para aparecer pronta quando o quadro virar
  useEffect(() => {
    PHOTOS.forEach((photo) => {
      const image = new Image()
      image.src = photo.src
    })
  }, [])

  return (
    <>
      {PHOTOS.map((photo, index) => (
        <button
          key={photo.src}
          type="button"
          className={`room-frame room-frame-${index + 1} room-frame-cover-${photo.cover}`}
          style={{ visibility: open?.index === index ? 'hidden' : 'visible' }}
          onClick={(event) => setOpen({ index, rect: event.currentTarget.getBoundingClientRect() })}
          aria-label={`Ver foto: ${photo.alt}`}
          title="Ver foto"
        />
      ))}

      {open && <PhotoViewer photo={PHOTOS[open.index]} originRect={open.rect} onClosed={() => setOpen(null)} />}
    </>
  )
}
