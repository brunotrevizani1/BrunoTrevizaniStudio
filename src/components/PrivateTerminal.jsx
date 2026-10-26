import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/placeholders'

const DENIED_OUTPUT = [
  { text: 'remote: Repository is private.', tone: 'error' },
  { text: 'fatal: repository access denied.', tone: 'error' },
]

const initialHistory = [
  {
    command: 'git clone projeto-privado.git',
    output: [{ text: "Cloning into 'projeto-privado'...", tone: 'muted' }, ...DENIED_OUTPUT],
  },
  {
    output: [{ text: 'Dica: digite /help para ver os comandos disponíveis.', tone: 'hint' }],
  },
]

const toneClass = {
  muted: 'text-text-muted',
  error: 'text-red-400',
  hint: 'text-accent',
  warn: 'text-yellow-400',
  ok: 'text-green-400',
  text: 'text-text',
}

const SUDO_OUTPUT = [
  { text: 'Boa tentativa 😏', tone: 'warn' },
  { text: 'Acesso continua negado 🔒', tone: 'error' },
]

function buildOutput(command) {
  const normalized = command.toLowerCase().replace(/\s+/g, ' ').replace(/^\//, '')

  if (normalized.startsWith('sudo git clone')) return SUDO_OUTPUT

  switch (normalized) {
    case 'help':
      return [
        { text: 'Comandos disponíveis:', tone: 'text' },
        { text: 'contato', tone: 'text' },
        { text: 'clear', tone: 'text' },
      ]
    case 'contato':
      return [
        { text: 'Vamos conversar?', tone: 'text' },
        { text: `  email     ${profile.email}`, tone: 'ok', href: `mailto:${profile.email}`, linkFrom: 12 },
        { text: `  linkedin  ${profile.linkedin}`, tone: 'muted', href: profile.linkedin, linkFrom: 12 },
        { text: `  github    ${profile.github}`, tone: 'muted', href: profile.github, linkFrom: 12 },
      ]
    default:
      return DENIED_OUTPUT
  }
}

function OutputLine({ line }) {
  if (!line.href) {
    return <p className={`break-all ${toneClass[line.tone]}`}>{line.text}</p>
  }

  const label = line.text.slice(0, line.linkFrom)
  const link = line.text.slice(line.linkFrom)

  return (
    <p className={`break-all ${toneClass[line.tone]}`}>
      <span className="whitespace-pre">{label}</span>
      <a
        href={line.href}
        target={line.href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-text"
      >
        {link}
      </a>
    </p>
  )
}

export default function PrivateTerminal({ active }) {
  const [history, setHistory] = useState(initialHistory)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    // Em telas touch o foco automático abriria o teclado sem a pessoa pedir.
    if (active && window.matchMedia('(hover: hover)').matches) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [active])

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [history])

  function handleSubmit(event) {
    event.preventDefault()
    const command = value.trim()
    setValue('')

    if (command.toLowerCase().replace(/^\//, '') === 'clear') {
      setHistory([])
      return
    }

    setHistory((prev) => [
      ...prev,
      { command, output: command ? buildOutput(command) : [] },
    ])
  }

  return (
    <div
      className="animate-fade-in-up w-full overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-2xl shadow-black/20"
      style={{ animationDelay: '200ms' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-text-muted">terminal</span>
      </div>

      <div ref={bodyRef} className="h-56 space-y-1.5 overflow-y-auto p-5 font-mono text-sm">
        {history.map((entry, index) => (
          <div key={index} className="space-y-1.5">
            {entry.command !== undefined && (
              <p className="break-all text-text">
                <span className="text-accent">$</span> {entry.command}
              </p>
            )}
            {entry.output.map((line, lineIndex) => (
              <OutputLine key={lineIndex} line={line} />
            ))}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="private-terminal-input" className="text-accent">
            $
          </label>
          <input
            id="private-terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            type="text"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal"
            className="min-w-0 flex-1 bg-transparent text-text caret-accent outline-none"
          />
        </form>
      </div>
    </div>
  )
}
