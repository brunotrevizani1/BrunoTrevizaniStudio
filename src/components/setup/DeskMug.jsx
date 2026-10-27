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
          <path d="M52 20 h6 a9 9 0 0 1 0 22 h-8" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
          <path d="M8 14 h46 v28 a16 16 0 0 1 -16 16 h-14 a16 16 0 0 1 -16 -16 Z" fill="#f8fafc" />
          <ellipse cx="31" cy="15" rx="23" ry="5" fill="#7c4a24" />
          {/* ícone </> e nome */}
          <path
            d="M25 27 l-3.5 3.5 l3.5 3.5 M37 27 l3.5 3.5 l-3.5 3.5 M33 26 l-4 9"
            stroke="#fb923c"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="31" y="47" textAnchor="middle" className="setup-mug-name">
            Bruno
          </text>
        </svg>
      </button>

      {originRect && <MugViewer originRect={originRect} onClosed={() => setOriginRect(null)} />}
    </>
  )
}

export default memo(DeskMug)
