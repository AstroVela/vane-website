/* Vane rotor mark — grayscale (the only non-B&W pixels allowed in the system).
   Tonal grays per the design tokens: #9BA0AB / #5B5F6B / #23262F + ink hub. */
export default function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 16 L16 3 L25.83 9.12 Z" fill="#9BA0AB" />
      <path d="M16 16 L27.26 22.5 L17.05 27.95 Z" fill="#5B5F6B" />
      <path d="M16 16 L4.74 22.5 L5.13 10.93 Z" fill="#23262F" />
      <circle cx="16" cy="16" r="2.4" fill="#15171E" />
    </svg>
  )
}
