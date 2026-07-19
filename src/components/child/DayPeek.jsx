import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { niceDate } from '../../lib/date.js'
import { locationForDay, activitiesForDay, isEarningDay } from '../../state/rewards.js'

// A friendly read-only "what's happening" sheet for any day, so kids can see
// what's coming up this week and beyond.
export default function DayPeek({ state, dayKey, onClose }) {
  return (
    <AnimatePresence>
      {dayKey && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-teal-deep/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card mx-3 mb-3 max-h-[80vh] w-full max-w-md overflow-y-auto p-4 safe-b"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Peek state={state} dayKey={dayKey} />
            <button onClick={onClose} className="btn btn-primary mt-4 w-full">
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Peek({ state, dayKey }) {
  const loc = locationForDay(state, dayKey)
  const activities = activitiesForDay(state, dayKey)
  const earns = isEarningDay(state, dayKey)
  const done = state.days[dayKey]?.completed || {}
  const complete = state.days[dayKey]?.dayComplete

  return (
    <div>
      <p className="font-display text-center text-xs font-bold uppercase tracking-wide text-teal">
        {niceDate(dayKey)}
      </p>
      <div className="mb-3 mt-1 flex items-center justify-center gap-2">
        <span className="text-3xl">{loc.icon}</span>
        <span className="font-display text-2xl font-black text-ink">{loc.name}</span>
      </div>

      {complete && (
        <p className="mb-2 text-center font-display font-black text-moss">Finished this day! 🎉</p>
      )}
      {!earns && (
        <p className="mb-2 text-center text-sm font-bold text-ink/50">A day off — just have fun! 😎</p>
      )}

      <div className="space-y-1.5">
        {activities.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-2.5 rounded-xl border-2 px-2.5 py-2 ${
              done[a.id] ? 'border-moss/40 bg-moss/10' : 'border-ink/10 bg-white/70'
            }`}
          >
            <span className="text-xl">{a.icon}</span>
            <span className={`flex-1 text-sm font-bold ${done[a.id] ? 'line-through decoration-2' : ''}`}>
              {a.title}
            </span>
            {a.isChore && <span className="chip bg-coral/15 text-[0.65rem] text-coral">Job</span>}
            {done[a.id] && <span className="text-moss">✓</span>}
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-sm font-semibold text-ink/40">No plan for this day yet.</p>
        )}
      </div>
    </div>
  )
}
