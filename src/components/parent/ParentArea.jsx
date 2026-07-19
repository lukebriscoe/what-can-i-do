import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../store-context.jsx'
import PinGate from './PinGate.jsx'
import Rewards from './Rewards.jsx'
import Schedule from './Schedule.jsx'
import Places from './Places.jsx'
import BankAdmin from './BankAdmin.jsx'
import Setup from './Setup.jsx'

const SECTIONS = [
  { id: 'setup', label: 'Setup', icon: '⚙️', C: Setup },
  { id: 'rewards', label: 'Rewards', icon: '🪙', C: Rewards },
  { id: 'schedule', label: 'Schedules', icon: '📋', C: Schedule },
  { id: 'places', label: 'Places', icon: '📍', C: Places },
  { id: 'bank', label: 'Bank', icon: '💷', C: BankAdmin },
]

export default function ParentArea({ onClose }) {
  const { state } = useStore()
  const hasPin = !!state.settings.pin
  const [unlocked, setUnlocked] = useState(!hasPin)
  const [section, setSection] = useState('setup')
  const Active = SECTIONS.find((s) => s.id === section).C

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col bg-paper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {!unlocked ? (
        <PinGate pin={state.settings.pin} onUnlock={() => setUnlocked(true)} onClose={onClose} />
      ) : (
        <div className="mx-auto flex h-full w-full max-w-md flex-col">
          <header className="safe-t flex items-center justify-between border-b-2 border-ink/10 px-4 pb-2 pt-3">
            <h1 className="font-display text-xl font-black text-teal-deep">Grown-up area</h1>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink/10 bg-white/70 text-lg active:scale-95"
              aria-label="Close"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <Active />
          </div>

          <nav className="safe-b border-t-2 border-ink/10 bg-white/70">
            <div className="flex justify-around">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex flex-1 flex-col items-center gap-0.5 py-2 font-display text-[0.7rem] font-extrabold ${
                    section === s.id ? 'text-teal' : 'text-ink/45'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </motion.div>
  )
}
