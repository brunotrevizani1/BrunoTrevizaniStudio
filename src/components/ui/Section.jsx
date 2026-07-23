import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Section({ id, className = '', children }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-24 py-20 sm:py-28 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  )
}
