import { useState } from 'react'
import { Check, Copy, Loader2, Mail, Send } from 'lucide-react'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { profile } from '../data/placeholders'

const INITIAL_FORM = { name: '', email: '', message: '' }
// status: 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

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

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setErrorMessage('Preencha todos os campos antes de enviar.')
      return
    }

    setStatus('submitting')
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
        setStatus('error')
        setErrorMessage(
          body?.error ?? 'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.'
        )
        return
      }

      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
      setErrorMessage('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.')
    }
  }

  return (
    <Section id="contato">
      <SectionHeading
        eyebrow="Contato"
        title="Vamos conversar?"
        description="Preencha o formulário abaixo ou me chame diretamente por e-mail."
        align="center"
      />

      <div className="mx-auto max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-text">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              autoComplete="name"
              className="rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-text">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@email.com"
              autoComplete="email"
              className="rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-text">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Conte um pouco sobre seu projeto ou oportunidade..."
              className="resize-none rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar mensagem
              </>
            )}
          </button>

          {status === 'success' && (
            <p className="text-sm text-emerald-400">
              Mensagem enviada com sucesso! Vou te responder em breve.
            </p>
          )}
          {status === 'error' && <p className="text-sm text-red-400">{errorMessage}</p>}
        </form>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-text-muted">
          <Mail size={16} />
          <a href={`mailto:${profile.email}`} className="hover:text-text">
            {profile.email}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label={copied ? 'E-mail copiado' : 'Copiar e-mail'}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:border-accent/50 hover:text-text"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </Section>
  )
}
