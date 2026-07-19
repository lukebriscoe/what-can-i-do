import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from './store-context.jsx'
import Today from './components/child/Today.jsx'
import WeekMap from './components/child/WeekMap.jsx'
import Bank from './components/child/Bank.jsx'
import ParentArea from './components/parent/ParentArea.jsx'

const TABS = [
  { id: 'today', label: 'Today', icon: '🧭' },
  { id: 'week', label: 'Week', icon: '🗺️' },
  { id: 'bank', label: 'Bank', icon: '🪙' },
]

export default function App() {
  const { state, ready } = useStore()
  const [tab, setTab] = useState('today')
  const [parentOpen, setParentOpen] = useState(false)

  if (!ready) {
    return (
      <div className="grid min-h-full place-items-center">
        <div className="animate-pulse text-center">
          <div className="text-5xl">🧭</div>
          <p className="font-display mt-2 text-lg font-bold text-teal-deep">Loading your day…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      {/* Header */}
      <header className="safe-t flex items-center justify-between px-4 pb-1 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden>
            {state.child.avatar}
          </span>
          <div className="leading-tight">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
              What Can I Do?
            </p>
            <p className="font-display text-lg font-black text-ink">{state.child.name}</p>
          </div>
        </div>
        <button
          onClick={() => setParentOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/10 bg-white/60 text-xl active:scale-95"
          aria-label="Grown-up area"
        >
          ⚙️
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === 'today' && <Today />}
            {tab === 'week' && <WeekMap onGoToday={() => setTab('today')} />}
            {tab === 'bank' && <Bank />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom tab bar */}
      <nav className="safe-b fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md">
        <div className="mx-3 mb-2 flex items-stretch justify-around rounded-chunk border-2 border-ink/10 bg-white/85 p-1.5 shadow-card backdrop-blur">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 font-display text-xs font-extrabold transition ${
                  active ? 'text-white' : 'text-ink/55'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl bg-teal"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative text-xl">{t.icon}</span>
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <AnimatePresence>
        {parentOpen && <ParentArea onClose={() => setParentOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
