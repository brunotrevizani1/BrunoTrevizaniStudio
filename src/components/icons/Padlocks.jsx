export function ClosedPadlock({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 28v-7a12 12 0 0 1 24 0v7"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="12" y="28" width="40" height="28" rx="7" fill="currentColor" />
      <circle cx="32" cy="41" r="4" fill="var(--color-bg)" />
      <rect x="30" y="43" width="4" height="7" rx="2" fill="var(--color-bg)" />
    </svg>
  )
}

export function OpenPadlock({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 26v-6a12 12 0 0 1 23.5-3.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="12" y="28" width="40" height="28" rx="7" fill="currentColor" />
      <circle cx="32" cy="41" r="4" fill="var(--color-bg)" />
      <rect x="30" y="43" width="4" height="7" rx="2" fill="var(--color-bg)" />
    </svg>
  )
}
