import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Check, Copy, Loader2, Mail, Send, X } from 'lucide-react'
import YardScene, { MAILBOX, STAGE_H, STAGE_W } from './contact/YardScene'
import LetterFlight from './contact/LetterFlight'
import { useLamp } from '../context/LampContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { profile } from '../data/placeholders'
import './contact/yard.css'

const INITIAL_FORM = { name: '', email: '', message: '' }
const ZOOM_MS = 1300
const SEAL_MS = 700

// Enquadramento do palco do quintal: "cover" na tela, sempre mostrando a caixa de correio
// (em telas estreitas o recorte desliza para a direita); com zoom, a câmera chega na caixa.
function cameraFor(width, height, zoomed) {
  const cover = Math.max(width / STAGE_W, height / STAGE_H)
  let scale = cover
  let cx = STAGE_W / 2
  let cy = STAGE_H / 2
  if (zoomed) {
    scale = Math.max(cover * 2, Math.min(cover * 3.6, (width * 0.42) / 132))
    cx = MAILBOX.x
    cy = MAILBOX.y - 16
  } else {
    const visibleW = width / cover
    cx = Math.max(cx, MAILBOX.x + 120 - visibleW / 2)
  }
  return `translate(${width / 2 - cx * scale}px, ${height / 2 - cy * scale}px) scale(${scale})`
}

// phase: 'yard' (quintal) -> 'zooming' (câmera chega na caixa) -> 'writing' (carta aberta)
//        -> 'sending' (carta selada, pássaro leva) -> 'done'
export default function Contact() {
  const { isOn } = useLamp()
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [phase, setPhase] = useState('yard')
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  const night = !isOn
  const zoomed = phase === 'zooming' || phase === 'writing'

  useLayoutEffect(() => {
    const section = sectionRef.current
    const measure = () => setSize({ w: section.clientWidth, h: section.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  // com a câmera na caixa ou a carta aberta, o scroll de abas pausa
  useEffect(() => {
    if (!zoomed) return undefined
    document.documentElement.dataset.modal = 'contact-letter'
    return () => {
      delete document.documentElement.dataset.modal
    }
  }, [zoomed])

  const openMailbox = useCallback(() => {
    if (phase !== 'yard' && phase !== 'done') return
    setErrorMessage('')
    setPhase('zooming')
    timer.current = setTimeout(() => setPhase('writing'), reduced ? 100 : ZOOM_MS - 200)
  }, [phase, reduced])

  const closeLetter = useCallback(() => {
    if (phase !== 'writing' || submitting) return
    setPhase('yard')
  }, [phase, submitting])

  useEffect(() => {
    if (phase !== 'writing') return undefined
    const onKey = (event) => event.key === 'Escape' && closeLetter()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, closeLetter])

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard indisponível nesse navegador; o link mailto continua funcionando
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleDelivered() {
    setForm(INITIAL_FORM)
    setPhase('done')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Preencha todos os campos antes de enviar.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setErrorMessage(body?.error ?? 'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.')
        return
      }

      // a carta é selada e volta para a caixa enquanto a câmera se afasta; o pássaro leva (LetterFlight)
      if (reduced) handleDelivered()
      else setPhase('sending')
    } catch {
      setErrorMessage('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.')
    } finally {
      setSubmitting(false)
    }
  }

  const subtitle = phase === 'done' ? 'Carta entregue! Vou te responder em breve.' : 'Abra a caixa de correio e deixe sua carta. O pássaro entrega!'
  const showLetter = phase === 'writing' || phase === 'sending'

  return (
    <section id="contato" ref={sectionRef} data-panel aria-label="Contato" className="relative min-h-dvh snap-start overflow-hidden">
      <div className="yard" data-night={night}>
        <div
          className="yard-stage"
          style={{ transform: size.w ? cameraFor(size.w, size.h, zoomed) : undefined, transitionDuration: reduced ? '0ms' : undefined }}
        >
          <YardScene open={zoomed || phase === 'sending'} flagUp={phase === 'sending' || phase === 'done'} sealed={phase === 'sending'} />
          <button
            type="button"
            className="yard-mailbox-btn"
            onClick={openMailbox}
            disabled={phase !== 'yard' && phase !== 'done'}
            aria-label="Abrir a caixa de correio e escrever uma carta"
          />
          {phase === 'sending' && <LetterFlight onDone={handleDelivered} />}
        </div>
      </div>

      <div className="yard-title" data-night={night} data-hidden={zoomed}>
        <span className="yard-title-eyebrow">Contato</span>
        <h2>Vamos conversar?</h2>
        <p data-done={phase === 'done'} aria-live="polite">
          {subtitle}
        </p>
      </div>

      <div className="yard-email" data-hidden={phase !== 'writing'}>
        <Mail size={16} />
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <button type="button" onClick={handleCopyEmail} aria-label={copied ? 'E-mail copiado' : 'Copiar e-mail'}>
          {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
        </button>
      </div>

      {showLetter && (
        <div className="yard-letter" data-sealing={phase === 'sending'}>
          <form onSubmit={handleSubmit} className="letter-paper" aria-label="Carta para o Bruno">
            <button type="button" className="letter-close" onClick={closeLetter} aria-label="Guardar a carta">
              <X size={15} strokeWidth={2.6} />
            </button>
            <span className="letter-stamp" aria-hidden="true">
              <Mail size={18} strokeWidth={2.2} />
            </span>

            <p className="letter-greeting">Querido Bruno,</p>

            <label htmlFor="message" className="sr-only">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="letter-body"
            />

            <div className="letter-sign">
              <label htmlFor="name">Atenciosamente,</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="seu nome"
                autoComplete="name"
                className="letter-line"
              />
            </div>

            <div className="letter-sign">
              <label htmlFor="email">Seu e-mail:</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@email.com"
                autoComplete="email"
                className="letter-line"
              />
            </div>

            <button type="submit" disabled={submitting || phase === 'sending'} className="letter-send">
              {submitting || phase === 'sending' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Selando a carta...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar carta
                </>
              )}
            </button>

            {errorMessage && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      )}
    </section>
  )
}
