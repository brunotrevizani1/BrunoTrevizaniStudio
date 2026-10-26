import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** true quando o sistema pede menos movimento; acompanha mudanças em tempo real. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}
