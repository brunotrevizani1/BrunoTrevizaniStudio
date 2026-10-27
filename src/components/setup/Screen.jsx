import { useEffect, useRef, useState } from 'react'
import { Folder, TerminalSquare } from 'lucide-react'
import DesktopWindow from './DesktopWindow'
import { about, profile } from '../../data/placeholders'

const FOLDERS = about.sections

function FolderIcon({ size = 48 }) {
  return (
    <svg viewBox="0 0 64 52" width={size} height={size * 0.82} aria-hidden="true">
      <path d="M4 10 a6 6 0 0 1 6 -6 h14 l7 8 h23 a6 6 0 0 1 6 6 v28 a6 6 0 0 1 -6 6 H10 a6 6 0 0 1 -6 -6 Z" fill="#f59e0b" />
      <path d="M4 20 a6 6 0 0 1 6 -6 h44 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 H10 a6 6 0 0 1 -6 -6 Z" fill="#fbbf24" />
      <path d="M8 22 h48" stroke="#fff" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    </svg>
  )
}

function TerminalIcon({ size = 48 }) {
  return (
    <svg viewBox="0 0 64 52" width={size} height={size * 0.82} aria-hidden="true">
      <rect x="6" y="4" width="52" height="44" rx="9" fill="#0b1020" stroke="#fb923c" strokeWidth="3" />
      <rect x="6" y="4" width="52" height="11" rx="9" fill="#1e2740" />
      <path d="M17 27 l9 6 l-9 6" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M31 40 h14" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function highlightLines() {
  return about.highlights.map((item) => ({ text: `${item.label.padEnd(15)} ${item.value}`, tone: 'ok' }))
}

const INITIAL_HISTORY = [
  {
    command: 'cat sobre.txt',
    output: [...highlightLines(), { text: 'Dica: digite help para ver os comandos.', tone: 'hint' }],
  },
]

function buildOutput(command) {
  const name = command.toLowerCase().replace(/\s+/g, ' ')

  switch (name) {
    case 'help':
      return [
        { text: 'whoami   quem é você?', tone: 'muted' },
        { text: 'stack    tecnologias principais', tone: 'muted' },
        { text: 'status   disponibilidade e localização', tone: 'muted' },
        { text: 'ls       pastas da área de trabalho', tone: 'muted' },
        { text: 'contato  como falar comigo', tone: 'muted' },
        { text: 'clear    limpa o terminal', tone: 'muted' },
      ]
    case 'whoami':
      return [{ text: `${profile.name} · ${profile.title}`, tone: 'ok' }]
    case 'stack': {
      const stack = about.highlights.find((item) => item.label === 'Stack principal')
      return [{ text: stack ? stack.value : 'React · Node · PostgreSQL', tone: 'ok' }]
    }
    case 'status':
      return highlightLines()
    case 'ls':
      return [{ text: FOLDERS.map((folder) => `${folder.title.toLowerCase().replace(/ /g, '-')}/`).join('  '), tone: 'hint' }]
    case 'contato':
      return [
        { text: `email     ${profile.email}`, tone: 'ok', href: `mailto:${profile.email}`, linkFrom: 10 },
        { text: `linkedin  ${profile.linkedin}`, tone: 'muted', href: profile.linkedin, linkFrom: 10 },
        { text: `github    ${profile.github}`, tone: 'muted', href: profile.github, linkFrom: 10 },
      ]
    default:
      return [{ text: `bash: ${command}: comando não encontrado (digite help)`, tone: 'error' }]
  }
}

const TONE = {
  ok: 'text-emerald-300',
  muted: 'text-slate-400',
  hint: 'text-orange-300',
  error: 'text-red-400',
}

function OutputLine({ line }) {
  if (!line.href) {
    return <p className={`whitespace-pre-wrap break-all ${TONE[line.tone]}`}>{line.text}</p>
  }
  return (
    <p className={`whitespace-pre-wrap break-all ${TONE[line.tone]}`}>
      {line.text.slice(0, line.linkFrom)}
      <a
        href={line.href}
        target={line.href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-white"
      >
        {line.text.slice(line.linkFrom)}
      </a>
    </p>
  )
}

function MiniTerminal({ onKey }) {
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [history])

  function handleSubmit(event) {
    event.preventDefault()
    const command = value.trim()
    setValue('')

    if (command.toLowerCase() === 'clear') {
      setHistory([])
      return
    }

    setHistory((prev) => [...prev, { command, output: command ? buildOutput(command) : [] }])
  }

  return (
    <div
      ref={bodyRef}
      className="setup-terminal-body"
      onClick={() => inputRef.current?.focus()}
    >
        {history.map((entry, index) => (
          <div key={index}>
            <p className="break-all text-slate-100">
              <span className="text-orange-400">$</span> {entry.command}
            </p>
            {entry.output.map((line, lineIndex) => (
              <OutputLine key={lineIndex} line={line} />
            ))}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="setup-terminal-input" className="text-orange-400">
            $
          </label>
          <input
            id="setup-terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKey}
            type="text"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal"
            className="min-w-0 flex-1 bg-transparent text-slate-100 caret-orange-400 outline-none"
          />
        </form>
    </div>
  )
}

function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 20000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
  )
}

const START_GEOMS = {
  terminal: { x: 140, y: 14, w: 674, h: 322 },
  folder: { x: 92, y: 52, w: 520, h: 250 },
}

export default function Screen({ on, cursorRef, onMove, onPress, onKey }) {
  const [openFolder, setOpenFolder] = useState(null)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [geoms, setGeoms] = useState(START_GEOMS)
  const [maximized, setMaximized] = useState({ terminal: false, folder: false })
  const [minimized, setMinimized] = useState({ terminal: false, folder: false })
  const [order, setOrder] = useState(['folder', 'terminal']) // do fundo para a frente
  const [ripple, setRipple] = useState(null)
  const screenRef = useRef(null)

  function fractionOf(event) {
    const rect = screenRef.current.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    }
  }

  // A tela é escalada junto com o palco: converte px da tela em px lógicos.
  function getScale() {
    const screen = screenRef.current
    return screen ? screen.getBoundingClientRect().width / screen.offsetWidth : 1
  }

  function handlePointerMove(event) {
    const { x, y } = fractionOf(event)
    onMove(x, y)
  }

  function handlePointerDown(event) {
    const { x, y } = fractionOf(event)
    onMove(x, y)
    onPress()
    if (on) setRipple({ x, y, id: Date.now() })
  }

  const focusWindow = (id) => setOrder((prev) => [...prev.filter((item) => item !== id), id])
  const setGeom = (id, geom) => setGeoms((prev) => ({ ...prev, [id]: geom }))
  const setFlag = (setter, id, value) => setter((prev) => ({ ...prev, [id]: value }))
  const toggleMaximize = (id) => setMaximized((prev) => ({ ...prev, [id]: !prev[id] }))
  const topWindow = order[order.length - 1]
  const zOf = (id) => 4 + order.indexOf(id)

  function openFolderWindow(index) {
    setOpenFolder(index)
    setFlag(setMinimized, 'folder', false)
    focusWindow('folder')
  }

  function openTerminalWindow() {
    setTerminalOpen(true)
    setFlag(setMinimized, 'terminal', false)
    focusWindow('terminal')
  }

  // Botão da barra de tarefas: restaura, minimiza (se já está na frente) ou traz para a frente.
  function toggleFromTaskbar(id) {
    if (minimized[id]) {
      setFlag(setMinimized, id, false)
      focusWindow(id)
    } else if (topWindow === id) {
      setFlag(setMinimized, id, true)
    } else {
      focusWindow(id)
    }
  }

  const windowProps = (id) => ({
    geom: geoms[id],
    maximized: maximized[id],
    minimized: minimized[id],
    z: zOf(id),
    getScale,
    onGeom: (geom) => setGeom(id, geom),
    onFocus: () => focusWindow(id),
    onMinimize: () => setFlag(setMinimized, id, true),
    onToggleMaximize: () => toggleMaximize(id),
  })

  return (
    <div
      ref={screenRef}
      data-on={on}
      className="setup-screen"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <div className="setup-screen-content">
        <div className="setup-wallpaper" />

        <div className="setup-brand" aria-hidden="true">
          <span className="setup-brand-name">
            BrunoTrevizani<em>Studio</em>
          </span>
          <span className="setup-brand-sub">{profile.title}</span>
        </div>

        <div className="setup-icons">
          {FOLDERS.map((folder, index) => (
            <button
              key={folder.title}
              type="button"
              onClick={() => openFolderWindow(index)}
              className={`setup-icon${openFolder === index ? ' is-open' : ''}`}
            >
              <FolderIcon />
              <span>{folder.title}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={openTerminalWindow}
            className={`setup-icon${terminalOpen ? ' is-open' : ''}`}
          >
            <TerminalIcon />
            <span>Terminal</span>
          </button>
        </div>

        {/* o terminal fica montado (só escondido) para guardar o histórico ao fechar */}
        <DesktopWindow
          {...windowProps('terminal')}
          minimized={!terminalOpen || minimized.terminal}
          title="bruno@studio: ~"
          icon={<TerminalSquare size={13} className="mr-1.5 inline-block -translate-y-px" />}
          className="setup-window-terminal"
          onClose={() => setTerminalOpen(false)}
        >
          <MiniTerminal onKey={onKey} />
        </DesktopWindow>

        {openFolder !== null && (
          <DesktopWindow
            key={openFolder}
            {...windowProps('folder')}
            title={FOLDERS[openFolder].title}
            icon={<Folder size={13} className="mr-1.5 inline-block -translate-y-px" />}
            className="setup-window-folder"
            onClose={() => setOpenFolder(null)}
          >
            <div className="setup-folder-body">
              <p>{FOLDERS[openFolder].text}</p>
            </div>
          </DesktopWindow>
        )}

        <div className="setup-taskbar">
          <span className="setup-start" />
          {terminalOpen && (
            <button
              type="button"
              className={`setup-task-chip${minimized.terminal ? ' is-minimized' : ''}`}
              onClick={() => toggleFromTaskbar('terminal')}
            >
              <TerminalSquare size={12} className="mr-1 inline-block -translate-y-px" />
              terminal
            </button>
          )}
          {openFolder !== null && (
            <button
              type="button"
              className={`setup-task-chip${minimized.folder ? ' is-minimized' : ''}`}
              onClick={() => toggleFromTaskbar('folder')}
            >
              <Folder size={12} className="mr-1 inline-block -translate-y-px" />
              {FOLDERS[openFolder].title}
            </button>
          )}
          <span className="ml-auto text-[11px] text-slate-300">
            <Clock />
          </span>
        </div>

        {ripple && (
          <span
            key={ripple.id}
            className="setup-ripple"
            style={{ left: `${ripple.x * 100}%`, top: `${ripple.y * 100}%` }}
          />
        )}

        <div ref={cursorRef} className="setup-cursor" style={{ left: '52%', top: '58%' }}>
          <svg viewBox="0 0 20 28" width="20" height="28" aria-hidden="true">
            <path d="M2 2 L2 22 L7 17.5 L10.5 25.5 L14 24 L10.6 16.2 L17.5 16 Z" fill="#fff" stroke="#111827" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
