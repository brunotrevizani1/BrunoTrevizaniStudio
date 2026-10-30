import { useEffect } from 'react'

/**
 * Marca cada aba [data-panel] fora da tela com data-offscreen="true"; o CSS (index.css) pausa
 * todas as animações dentro dela. Sem isso cidade, quintal, estante e gato animam o tempo todo,
 * mesmo escondidos, e o navegador recalcula estilo de centenas de elementos a cada quadro.
 * Mede no scroll (e não com IntersectionObserver) porque as abas podem ser remontadas e o
 * observer ficaria preso ao elemento antigo.
 */
export function usePausedOffscreen() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      document.querySelectorAll('[data-panel]').forEach((panel) => {
        const rect = panel.getBoundingClientRect()
        const offscreen = String(rect.bottom <= 0 || rect.top >= window.innerHeight)
        if (panel.dataset.offscreen !== offscreen) panel.dataset.offscreen = offscreen
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // abas remontadas depois do primeiro render
    const settle = setTimeout(update, 600)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
}
