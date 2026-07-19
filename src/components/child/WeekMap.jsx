import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../store-context.jsx'
import {
  todayKey,
  weekWindowKeys,
  weekKeyOf,
  addDays,
  DAY_LABELS,
  isToday,
  holidayWeekNumber,
} from '../../lib/date.js'
import { locationForDay, dayStatus, coreEarnedInWeek } from '../../state/rewards.js'
import DayPeek from './DayPeek.jsx'

const STATUS_ICON = {
  complete: '🪙',
  partial: '◐',
  missed: '·',
  today: '⭐',
  upcoming: '',
}

export default function WeekMap({ onGoToday }) {
  const { state } = useStore()
  const today = todayKey()
  const { weeklyCap, currency } = state.settings.reward
  const thisMonday = weekKeyOf(today)

  const [viewMonday, setViewMonday] = useState(thisMonday)
  const [peekDay, setPeekDay] = useState(null)

  const weekKeys = weekWindowKeys(viewMonday)
  const viewedEarned = coreEarnedInWeek(state, viewMonday)
  const isCurrentWeek = viewMonday === thisMonday
  const holidayWeek = holidayWeekNumber(state.settings.holidayStartKey, viewMonday)

  const weeks = Array.from({ length: state.settings.holidayWeeks }, (_, i) => {
    const monday = addDays(state.settings.holidayStartKey, i * 7)
    return { n: i + 1, monday, earned: coreEarnedInWeek(state, monday), isNow: thisMonday === monday }
  })

  const tapDay = (k) => {
    if (isToday(k)) onGoToday?.()
    else setPeekDay(k)
  }

  return (
    <div className="space-y-5">
      {/* Week navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewMonday(addDays(viewMonday, -7))}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink/10 bg-white/70 text-lg active:scale-95"
          aria-label="Previous week"
        >
          ←
        </button>
        <div className="text-center">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
            Holiday week {holidayWeek} of {state.settings.holidayWeeks}
          </p>
          <h1 className="font-display text-2xl font-black text-ink">
            {isCurrentWeek ? 'This week' : 'That week'}
          </h1>
        </div>
        <button
          onClick={() => setViewMonday(addDays(viewMonday, 7))}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink/10 bg-white/70 text-lg active:scale-95"
          aria-label="Next week"
        >
          →
        </button>
      </div>

      {!isCurrentWeek && (
        <button
          onClick={() => setViewMonday(thisMonday)}
          className="mx-auto -mt-3 block font-display text-xs font-black text-teal underline"
        >
          Back to this week
        </button>
      )}

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekKeys.map((k, i) => {
          const status = dayStatus(state, k, today)
          const loc = locationForDay(state, k)
          const now = isToday(k)
          return (
            <button
              key={k}
              onClick={() => tapDay(k)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-2 active:scale-95 ${
                now
                  ? 'border-amber bg-amber/15'
                  : status === 'complete'
                    ? 'border-moss/40 bg-moss/10'
                    : 'border-ink/10 bg-white/60'
              } ${status === 'upcoming' ? 'opacity-80' : ''}`}
            >
              <span className="font-display text-[0.7rem] font-black text-ink/60">{DAY_LABELS[i]}</span>
              <span className="text-xl leading-none">{loc.icon}</span>
              <span className="text-sm leading-none">{STATUS_ICON[status]}</span>
            </button>
          )
        })}
      </div>
      <p className="-mt-3 text-center text-xs font-semibold text-ink/40">Tap a day to see what's on 👆</p>

      {/* Viewed week's earnings bar */}
      <div className="card p-4">
        <div className="flex items-baseline justify-between">
          <span className="font-display font-black text-ink">
            {isCurrentWeek ? "This week's" : "That week's"} pocket money
          </span>
          <span className="font-display font-black text-coral">
            {currency}
            {viewedEarned.toFixed(2)}
            <span className="text-ink/40">
              {' '}
              / {currency}
              {weeklyCap.toFixed(2)}
            </span>
          </span>
        </div>
        <div className="mt-2 h-4 overflow-hidden rounded-full bg-[var(--ring-track)]">
          <motion.div
            className="h-full rounded-full bg-teal"
            initial={{ width: 0 }}
            animate={{ width: `${weeklyCap ? Math.min(100, (viewedEarned / weeklyCap) * 100) : 0}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* 7-week journey — tap a week to view it above */}
      <div>
        <h2 className="font-display mb-2 px-1 text-sm font-black uppercase tracking-wide text-teal">
          🗺️ The whole holiday
        </h2>
        <div className="space-y-1.5">
          {weeks.map((w) => {
            const isViewed = w.monday === viewMonday
            return (
              <button
                key={w.monday}
                onClick={() => setViewMonday(w.monday)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left active:scale-[0.99] ${
                  isViewed ? 'border-teal bg-teal-soft/50' : w.isNow ? 'border-amber bg-amber/10' : 'border-ink/10 bg-white/50'
                }`}
              >
                <span className="font-display grid h-8 w-8 place-items-center rounded-full bg-teal-soft text-sm font-black text-teal-deep">
                  {w.n}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--ring-track)]">
                  <div
                    className="h-full rounded-full bg-moss"
                    style={{ width: `${weeklyCap ? Math.min(100, (w.earned / weeklyCap) * 100) : 0}%` }}
                  />
                </div>
                <span className="font-display w-14 text-right text-sm font-black text-ink/70">
                  {currency}
                  {w.earned.toFixed(2)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <DayPeek state={state} dayKey={peekDay} onClose={() => setPeekDay(null)} />
    </div>
  )
}
