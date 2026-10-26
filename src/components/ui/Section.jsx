import { useScrollReveal } from '../../hooks/useScrollReveal'

// Cada seção é uma "aba" de tela cheia: o scroll anima de uma aba para a outra
// (useFullPageScroll) e cada uma pode ter o próprio tema, passando um fundo em
// `background` e classes de cor em `className`.
export default function Section({
  id,
  className = '',
  contentClassName = '',
  background = null,
  children,
  ...rest
}) {
  const { ref, isVisible } = useScrollReveal({
    once: false,
    threshold: 0,
    rootMargin: '-35% 0px -35% 0px',
  })

  return (
    <section
      id={id}
      ref={ref}
      data-panel
      {...rest}
      className={`relative flex min-h-dvh snap-start items-center overflow-hidden py-24 ${className}`}
    >
      {background}
      <div
        className={`reveal-content relative z-10 mx-auto w-full max-w-6xl px-6 ${contentClassName} ${
          isVisible ? '' : 'is-hidden'
        }`}
      >
        {children}
      </div>
    </section>
  )
}
