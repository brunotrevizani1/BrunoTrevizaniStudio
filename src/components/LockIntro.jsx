import { useEffect, useRef, useState } from 'react'
import { ClosedPadlock, OpenPadlock } from './icons/Padlocks'

const LINK_SPACING = 30

function useViewport() {
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

function ChainHalf({ side, count, isOpening }) {
  const isLeft = side === 'left'
  const motion = isOpening ? (isLeft ? 'animate-chain-out-left' : 'animate-chain-out-right') : ''

  return (
    <div
      className={`absolute top-1/2 flex -translate-y-1/2 items-center ${
        isLeft ? 'right-1/2 flex-row-reverse' : 'left-1/2'
      } ${motion}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`shrink-0 rounded-full border-[5px] border-zinc-500 ${
            index % 2 === 0 ? 'h-7 w-12 -mx-1.5' : 'h-4 w-6 -mx-1'
          }`}
        />
      ))}
    </div>
  )
}

function Chain({ angle, count, isOpening }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <ChainHalf side="left" count={count} isOpening={isOpening} />
      <ChainHalf side="right" count={count} isOpening={isOpening} />
    </div>
  )
}

export default function LockIntro({ phase, onUnlock }) {
  const { width, height } = useViewport()
  const buttonRef = useRef(null)
  const isOpening = phase === 'opening'

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  const angle = (Math.atan2(height, width) * 180) / Math.PI
  const diagonal = Math.hypot(width, height)
  const count = Math.ceil(diagonal / 2 / LINK_SPACING) + 2

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-bg/50 backdrop-blur-md transition-opacity duration-700 ${
        isOpening ? 'pointer-events-none opacity-0 delay-500' : 'opacity-100'
      }`}
    >
      <Chain angle={angle} count={count} isOpening={isOpening} />
      <Chain angle={-angle} count={count} isOpening={isOpening} />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={onUnlock}
          disabled={isOpening}
          aria-label="Abrir cadeado"
          className={`relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-4 border-[#1e1b3a] bg-white text-accent shadow-[6px_6px_0_#1e1b3a] outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent ${
            isOpening ? 'animate-lock-pop' : 'animate-lock-tremble'
          }`}
        >
          {isOpening ? (
            <OpenPadlock className="h-16 w-16" />
          ) : (
            <ClosedPadlock className="h-16 w-16" />
          )}
        </button>
      </div>
    </div>
  )
}
