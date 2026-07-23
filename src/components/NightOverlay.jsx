import { useLamp } from '../context/LampContext'

const STARS = [
  { top: '8%', left: '12%', size: 2, delay: '0s' },
  { top: '15%', left: '82%', size: 3, delay: '0.4s' },
  { top: '22%', left: '45%', size: 2, delay: '0.9s' },
  { top: '30%', left: '68%', size: 2, delay: '1.3s' },
  { top: '38%', left: '20%', size: 3, delay: '0.2s' },
  { top: '48%', left: '90%', size: 2, delay: '1.6s' },
  { top: '55%', left: '8%', size: 2, delay: '0.7s' },
  { top: '62%', left: '58%', size: 3, delay: '1.1s' },
  { top: '70%', left: '30%', size: 2, delay: '1.9s' },
  { top: '78%', left: '75%', size: 2, delay: '0.5s' },
  { top: '86%', left: '15%', size: 3, delay: '1.4s' },
  { top: '92%', left: '50%', size: 2, delay: '0.1s' },
]

export default function NightOverlay() {
  const { isOn } = useLamp()

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-700 ease-out ${
        isOn ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)',
      }}
    >
      {STARS.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: '2.2s',
          }}
        />
      ))}
    </div>
  )
}
