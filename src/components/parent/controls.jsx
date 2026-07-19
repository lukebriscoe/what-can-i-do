import React from 'react'

export function Section({ title, hint, children }) {
  return (
    <section className="card mb-4 p-4">
      <h2 className="font-display text-base font-black text-teal-deep">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs font-semibold text-ink/50">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </section>
  )
}

export function Row({ label, children }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm font-bold text-ink/80">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`rounded-xl border-2 border-ink/15 bg-white px-3 py-2 font-body font-bold text-ink outline-none focus:border-teal ${props.className || ''}`}
    />
  )
}

export function NumberInput({ value, onChange, step = 0.5, min = 0, prefix, className = '' }) {
  return (
    <div className="flex items-center gap-1">
      {prefix && <span className="font-display font-black text-ink/60">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className={`w-24 rounded-xl border-2 border-ink/15 bg-white px-3 py-2 text-right font-body font-bold text-ink outline-none focus:border-teal ${className}`}
      />
    </div>
  )
}

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-teal' : 'bg-ink/20'}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
          checked ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  )
}

export function Button({ children, variant = 'primary', ...props }) {
  const cls =
    variant === 'amber' ? 'btn btn-amber' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary'
  return (
    <button {...props} className={`${cls} ${props.className || ''}`}>
      {children}
    </button>
  )
}
