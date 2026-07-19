import React from 'react'
import { motion } from 'motion/react'

export default function ActivityRow({ activity, done, isNow, onToggle }) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      whileTap={{ scale: 0.97 }}
      className={`card flex w-full items-center gap-3 px-3 py-3 text-left ${
        done ? 'opacity-60' : ''
      } ${isNow ? 'ring-4 ring-amber/70' : ''}`}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${
          done ? 'bg-moss/20' : 'bg-teal-soft'
        }`}
        aria-hidden
      >
        {activity.icon}
      </div>

      <div className="min-w-0 flex-1">
        {isNow && !done && (
          <span className="font-display text-[0.65rem] font-black uppercase tracking-wide text-amber">
            Do this now
          </span>
        )}
        <p className={`font-body text-[1.05rem] font-bold leading-snug ${done ? 'line-through decoration-2' : ''}`}>
          {activity.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs font-semibold text-ink/45">
          {activity.time && <span>🕒 {activity.time}</span>}
          {activity.isChore && <span className="chip bg-coral/15 text-coral">Job</span>}
          {!activity.countsTowardDay && <span className="chip bg-ink/5 text-ink/40">Extra</span>}
        </div>
      </div>

      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-lg ${
          done ? 'border-moss bg-moss text-white' : 'border-ink/20 bg-white text-transparent'
        }`}
        aria-hidden
      >
        ✓
      </div>
    </motion.button>
  )
}
