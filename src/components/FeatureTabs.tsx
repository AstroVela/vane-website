import type {KeyboardEvent} from 'react'

type Option = {id: string; label: string}

/** Shared keyboard behavior for the product-page example tabs. */
export default function FeatureTabs({options, value, onChange, label, panelId}: {
  options: readonly Option[]; value: string; onChange: (value: string) => void
  label: string; panelId: string
}) {
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % options.length
      : event.key === 'ArrowLeft' ? (index + options.length - 1) % options.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : -1
    if (next < 0) return
    event.preventDefault()
    onChange(options[next].id)
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus()
  }
  return <div className="feature-tabs" role="tablist" aria-label={label}>
    {options.map((option, index) => <button key={option.id} type="button" role="tab"
      id={`${panelId}-${option.id}`} aria-controls={panelId} aria-selected={value === option.id}
      tabIndex={value === option.id ? 0 : -1} onClick={() => onChange(option.id)} onKeyDown={event => move(event, index)}>
      {option.label}
    </button>)}
  </div>
}
