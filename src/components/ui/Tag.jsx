export default function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
      {children}
    </span>
  )
}
