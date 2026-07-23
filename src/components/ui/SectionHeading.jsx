export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-3 mb-12 ${alignment}`}>
      {eyebrow && (
        <span className="text-sm font-semibold tracking-widest uppercase text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">{title}</h2>
      {description && (
        <p className="max-w-2xl text-text-muted text-base sm:text-lg">{description}</p>
      )}
    </div>
  )
}
