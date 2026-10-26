import { useEffect, useRef, useState } from 'react'

/**
 * Revela um elemento (fade + slide) quando ele entra na viewport.
 * Usa IntersectionObserver puro, sem dependências externas.
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -80px 0px',
  once = true,
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
