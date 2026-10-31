import { memo, useState } from 'react'
import MugViewer from './MugViewer'

// Caneca da mesa (à direita do mouse): clicar traz a caneca para perto, para mexer o café.
function DeskMug() {
  const [originRect, setOriginRect] = useState(null)

  return (
    <>
      <button
        type="button"
        className="setup-mug"
        style={{ visibility: originRect ? 'hidden' : 'visible' }}
        onClick={(event) => setOriginRect(event.currentTarget.getBoundingClientRect())}
        aria-label="Pegar a caneca de café"
        title="Pegar a caneca"
      >
        <div className="desk-steam" aria-hidden="true">
          <span style={{ animationDelay: '0s' }} />
          <span style={{ animationDelay: '0.9s' }} />
          <span style={{ animationDelay: '1.8s' }} />
        </div>
        <svg viewBox="0 0 70 62" fill="none" aria-hidden="true">
          {/* traço de desenho, como os botões: contorno escuro grosso (a sombra sólida vem do CSS) */}
          <path d="M50 22 h6 a11 11 0 0 1 11 11 v2 a11 11 0 0 1 -11 11 h-6" stroke="#1e1b3a" strokeWidth="11" strokeLinecap="round" />
          <path d="M50 22 h6 a11 11 0 0 1 11 11 v2 a11 11 0 0 1 -11 11 h-6" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 12 h46 v34 a12 12 0 0 1 -12 12 h-22 a12 12 0 0 1 -12 -12 Z" fill="#fb923c" />
          <path d="M43 12 h11 v34 a12 12 0 0 1 -12 12 h-5 a12 12 0 0 0 6 -12 Z" fill="#ea580c" />
          <path d="M14 22 v22" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M8 12 h46 v34 a12 12 0 0 1 -12 12 h-22 a12 12 0 0 1 -12 -12 Z"
            stroke="#1e1b3a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse cx="31" cy="12" rx="23" ry="6.5" fill="#fff7ed" stroke="#1e1b3a" strokeWidth="3" />
          <ellipse cx="31" cy="12.5" rx="17" ry="3.8" fill="#6b3f1d" stroke="#1e1b3a" strokeWidth="1.5" />
          {/* ícone </> e nome */}
          <path
            d="M24 27 l-4 4 l4 4 M38 27 l4 4 l-4 4 M33.5 25.5 l-5 11"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="31" y="50" textAnchor="middle" className="setup-mug-name">
            Bruno
          </text>
        </svg>
      </button>

      {originRect && <MugViewer originRect={originRect} onClosed={() => setOriginRect(null)} />}
    </>
  )
}

export default memo(DeskMug)
