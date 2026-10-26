import { useEffect } from 'react'
import { hasZoomTransition, zoomBackward, zoomForward } from './windowZoom'
import { OPEN_SECRET_ROOM } from '../components/secret-room/events'

const DURATION = 850
const COOLDOWN = 120
const WHEEL_PAUSE = 120
// Links que levam ao Sobre mim e ao quadro certo da câmera (#skills = estante).
const ABOUT_STAGES = { sobre: 'closeup', skills: 'shelf' }
// sobra de conteúdo menor que isso não vale rolar por dentro: troca de aba direto
const INNER_SCROLL_MIN = 120

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Transforma cada elemento [data-panel] em uma "aba" de tela cheia no desktop:
 * um gesto de scroll (roda do mouse, setas, PageUp/PageDown, Home/End ou clique em
 * link #âncora) anima a página até a aba seguinte/anterior e a enquadra no topo.
 * Abas mais altas que a tela rolam normalmente por dentro antes de trocar.
 * Em telas touch o scroll nativo continua valendo (com CSS snap).
 */
export function useFullPageScroll() {
  useEffect(() => {
    const root = document.documentElement
    let animating = false
    let lastWheelTime = 0
    let lastWheelDelta = 0
    let frame = 0

    const getPanels = () => Array.from(document.querySelectorAll('[data-panel]'))
    const maxScroll = () => root.scrollHeight - window.innerHeight
    const clamp = (value) => Math.max(0, Math.min(value, maxScroll()))
    const absTop = (panel) => panel.getBoundingClientRect().top + window.scrollY

    function currentIndex(panels) {
      if (window.scrollY >= maxScroll() - 2) return panels.length - 1
      let index = 0
      panels.forEach((panel, i) => {
        if (absTop(panel) <= window.scrollY + 2) index = i
      })
      return index
    }

    function animateTo(target, direction) {
      const from = window.scrollY
      const to = clamp(target)
      if (Math.abs(to - from) < 2) return

      root.dataset.scrollDir = direction
      animating = true
      const start = performance.now()

      cancelAnimationFrame(frame)
      const step = (now) => {
        const progress = Math.min((now - start) / DURATION, 1)
        window.scrollTo(0, from + (to - from) * easeInOutCubic(progress))
        if (progress < 1) {
          frame = requestAnimationFrame(step)
        } else {
          setTimeout(() => {
            animating = false
          }, COOLDOWN)
        }
      }
      frame = requestAnimationFrame(step)
    }

    function targetFor(panels, index, direction) {
      const panel = panels[index]
      const top = absTop(panel)
      const height = panel.getBoundingClientRect().height
      if (direction < 0 && height > window.innerHeight) {
        return top + height - window.innerHeight
      }
      return top
    }

    // Hero <-> Sobre mim usam o zoom na janela do prédio em vez do scroll vertical.
    function tryZoom(panels, from, to) {
      const upper = Math.min(from, to)
      if (Math.abs(from - to) !== 1 || !hasZoomTransition(upper)) return false

      const forward = to > from
      root.dataset.scrollDir = forward ? 'down' : 'up'
      const run = forward ? zoomForward(upper, absTop(panels[to])) : zoomBackward(upper, absTop(panels[to]))
      if (!run) return false

      animating = true
      run.finally(() => {
        setTimeout(() => {
          animating = false
        }, COOLDOWN)
      })
      return true
    }

    // A aba Sobre mim tem dois "quadros": o close-up do setup e a estante de skills.
    // Antes de sair da aba, o scroll panoramiza a câmera de um quadro para o outro.
    function aboutCamera() {
      const scene = document.querySelector('#sobre .setup-scene')
      return scene && scene.offsetParent !== null ? scene.__setupCamera : null
    }

    function runCamera(promise, direction) {
      root.dataset.scrollDir = direction
      animating = true
      promise.finally(() => {
        setTimeout(() => {
          animating = false
        }, COOLDOWN)
      })
    }

    function tryCameraStep(panels, direction) {
      if (panels[currentIndex(panels)]?.id !== 'sobre') return false
      const camera = aboutCamera()
      if (!camera) return false

      if (direction > 0 && camera.stage === 'closeup') {
        runCamera(camera.goTo('shelf'), 'down')
        return true
      }
      // na estante, o primeiro scroll para baixo puxa o livro "Projetos" e abre a sala secreta;
      // depois que ela fecha, o scroll seguinte segue para a próxima aba
      if (direction > 0 && camera.stage === 'shelf') {
        const lever = document.querySelector('#sobre .skshelf')?.__lever
        if (lever && !lever.used) {
          runCamera(lever.pull(), 'down')
          return true
        }
      }
      if (direction < 0 && camera.stage === 'shelf') {
        runCamera(camera.goTo('closeup'), 'up')
        return true
      }
      return false
    }

    function go(direction) {
      // a estante ainda está saindo da passagem e fechando (ver SkillsShelf)
      if (document.querySelector('#sobre .skshelf')?.__lever?.busy) return
      const panels = getPanels()
      if (panels.length === 0) return
      if (tryCameraStep(panels, direction)) return
      const next = currentIndex(panels) + direction
      if (next < 0 || next >= panels.length) return
      if (tryZoom(panels, next - direction, next)) return
      animateTo(targetFor(panels, next, direction), direction > 0 ? 'down' : 'up')
    }

    function panelHasRoom(direction) {
      const panels = getPanels()
      if (panels.length === 0) return false
      const rect = panels[currentIndex(panels)].getBoundingClientRect()
      return direction > 0 ? rect.bottom > window.innerHeight + INNER_SCROLL_MIN : rect.top < -INNER_SCROLL_MIN
    }

    function onWheel(event) {
      if (event.ctrlKey) return
      if (root.dataset.modal) {
        event.preventDefault()
        return
      }
      const direction = Math.sign(event.deltaY)
      if (!direction) return

      if (animating) {
        event.preventDefault()
        lastWheelTime = performance.now()
        lastWheelDelta = Math.abs(event.deltaY)
        return
      }

      if (panelHasRoom(direction)) return

      event.preventDefault()

      // ignora a "cauda" de inércia do trackpad logo após uma troca de aba
      const now = performance.now()
      const delta = Math.abs(event.deltaY)
      const isFreshGesture = now - lastWheelTime > WHEEL_PAUSE || delta > lastWheelDelta * 1.3
      lastWheelTime = now
      lastWheelDelta = delta
      if (!isFreshGesture) return

      go(direction)
    }

    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || root.dataset.modal) return
      if (event.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) return

      const panels = getPanels()
      if (panels.length === 0) return

      let direction = 0
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        direction = 1
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        direction = -1
      } else if (event.key === 'Home') {
        event.preventDefault()
        if (!animating) animateTo(0, 'up')
        return
      } else if (event.key === 'End') {
        event.preventDefault()
        if (!animating) animateTo(maxScroll(), 'down')
        return
      } else {
        return
      }

      if (animating) {
        event.preventDefault()
        return
      }
      if (panelHasRoom(direction)) return
      event.preventDefault()
      go(direction)
    }

    // "Projetos" é a sala secreta: o link vai até a estante e puxa o livro-alavanca
    function pullLever() {
      return document.querySelector('#sobre .skshelf')?.__lever?.pull()
    }

    function openSecretRoom(panels, camera) {
      const aboutPanel = document.getElementById('sobre')
      if (currentIndex(panels) === panels.indexOf(aboutPanel)) {
        const move = camera.stage === 'shelf' ? Promise.resolve() : camera.goTo('shelf')
        runCamera(move.then(pullLever), 'down')
        return
      }
      camera.set('shelf')
      const aboutTop = absTop(aboutPanel)
      const direction = aboutTop > window.scrollY ? 'down' : 'up'
      animateTo(aboutTop, direction)
      runCamera(new Promise((resolve) => setTimeout(resolve, DURATION + 100)).then(pullLever), direction)
    }

    function onClick(event) {
      const link = event.target.closest?.('a[href^="#"]')
      if (!link || event.defaultPrevented) return
      const id = link.getAttribute('href').slice(1)

      if (id === 'projetos') {
        event.preventDefault()
        if (animating) return
        const camera = aboutCamera()
        if (camera) openSecretRoom(getPanels(), camera)
        else window.dispatchEvent(new Event(OPEN_SECRET_ROOM))
        return
      }
      const target = id ? document.getElementById(id) : null
      if (!target) return

      event.preventDefault()
      if (animating) return
      const panels = getPanels()

      const stage = ABOUT_STAGES[id]
      const camera = stage ? aboutCamera() : null
      if (camera) {
        const aboutPanel = document.getElementById('sobre')
        const current = currentIndex(panels)
        if (current === panels.indexOf(aboutPanel)) {
          if (camera.stage !== stage) runCamera(camera.goTo(stage), stage === 'shelf' ? 'down' : 'up')
          return
        }
        if (current === 0 && stage === 'closeup' && tryZoom(panels, 0, 1)) return
        camera.set(stage)
        const aboutTop = absTop(aboutPanel)
        animateTo(aboutTop, aboutTop > window.scrollY ? 'down' : 'up')
        return
      }

      const targetIndex = panels.indexOf(target)
      if (targetIndex !== -1 && tryZoom(panels, currentIndex(panels), targetIndex)) return
      const top = absTop(target)
      animateTo(top, top > window.scrollY ? 'down' : 'up')
    }

    const isTouch = window.matchMedia('(pointer: coarse)').matches

    if (!isTouch) {
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('keydown', onKeyDown)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
      delete root.dataset.scrollDir
    }
  }, [])
}
