import React, { useState } from 'react'
import { motion } from 'motion/react'

export default function PinGate({ pin, onUnlock, onClose }) {
  const [entry, setEntry] = useState('')
  const [shake, setShake] = useState(false)

  const press = (d) => {
    const next = (entry + d).slice(0, 6)
    setEntry(next)
    if (next.length >= pin.length && next === pin) {
      onUnlock()
    } else if (next.length >= pin.length) {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setEntry('')
      }, 400)
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

  return (
    <div className="grid flex-1 place-items-center p-6">
      <motion.div
        className="w-full max-w-xs text-center"
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl">🔒</div>
        <h2 className="font-display mt-2 text-xl font-black text-teal-deep">Grown-ups only</h2>
        <p className="mt-1 text-sm font-semibold text-ink/50">Enter the PIN to continue</p>

        <div className="my-5 flex justify-center gap-2">
          {Array.from({ length: pin.length }).map((_, i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full border-2 ${
                i < entry.length ? 'border-teal bg-teal' : 'border-ink/25'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {keys.map((k, i) =>
            k === '' ? (
              <span key={i} />
            ) : (
              <button
                key={i}
                onClick={() => (k === '⌫' ? setEntry(entry.slice(0, -1)) : press(k))}
                className="font-display h-16 rounded-2xl border-2 border-ink/10 bg-white/70 text-2xl font-black text-ink active:scale-95 active:bg-teal-soft"
              >
                {k}
              </button>
            )
          )}
        </div>

        <button onClick={onClose} className="btn btn-ghost mt-4 w-full">
          ← Back to the app
        </button>
      </motion.div>
    </div>
  )
}
