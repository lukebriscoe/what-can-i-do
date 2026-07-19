import React, { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../../store-context.jsx'
import {
  todayKey,
  weekKeyOf,
  weekWindowKeys,
  addDays,
  parseKey,
  isToday,
  holidayWeekNumber,
} from '../../lib/date.js'
import { locationForDay } from '../../state/rewards.js'

// A week-by-week planner: navigate across the whole holiday and set where the
// child will be each day. Also offers a one-tap "whole week" shortcut.
export default function WeekPlanner() {
  const { state, dispatch } = useStore()
  const today = todayKey()
  const [monday, setMonday] = useState(weekKeyOf(today))
  const days = weekWindowKeys(monday)
  const { holidayStartKey, holidayWeeks } = state.settings
  const weekNo = holidayWeekNumber(holidayStartKey, monday)
  const inHoliday = weekNo >= 1 && weekNo <= holidayWeeks

  const setDay = (key, locationId) => dispatch({ type: 'setDayLocation', key, locationId })
  const setWholeWeek = (locationId) => {
    if (!locationId) return
    days.forEach((k) => setDay(k, locationId))
  }
  const isCurrentWeek = weekKeyOf(today) === monday

  return (
    <section className="card mb-4 p-4">
      {/* Week navigator */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <button
          onClick={() => setMonday(addDays(monday, -7))}
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink/10 bg-white/70 text-lg active:scale-95"
          aria-label="Previous week"
        >
          ←
        </button>
        <div className="text-center leading-tight">
          <p className="font-display text-base font-black text-teal-deep">
            {inHoliday ? `Holiday week ${weekNo}` : 'Week'}
          </p>
          <p className="text-xs font-bold text-ink/50">
            {format(parseKey(monday), 'd MMM')} – {format(parseKey(addDays(monday, 6)), 'd MMM')}
          </p>
        </div>
        <button
          onClick={() => setMonday(addDays(monday, 7))}
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink/10 bg-white/70 text-lg active:scale-95"
          aria-label="Next week"
        >
          →
        </button>
      </div>

      {!isCurrentWeek && (
        <button
          onClick={() => setMonday(weekKeyOf(today))}
          className="mx-auto mb-2 block font-display text-xs font-black text-teal underline"
        >
          Jump to this week
        </button>
      )}

      {/* Whole-week shortcut */}
      <label className="mb-3 mt-1 flex items-center gap-2 rounded-xl border-2 border-dashed border-teal/40 bg-teal-soft/30 px-2.5 py-2">
        <span className="text-sm font-bold text-teal-deep">Set the whole week to</span>
        <select
          value=""
          onChange={(e) => {
            setWholeWeek(e.target.value)
            e.target.value = ''
          }}
          className="min-w-0 flex-1 rounded-lg border-2 border-ink/15 bg-white px-2 py-1.5 font-bold"
        >
          <option value="">Choose…</option>
          {state.locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.icon} {l.name}
            </option>
          ))}
        </select>
      </label>

      {/* Per-day pickers */}
      <div className="space-y-1.5">
        {days.map((k) => {
          const current = locationForDay(state, k)
          const isSet = !!state.days[k]?.locationId
          const now = isToday(k)
          return (
            <div key={k} className="flex items-center gap-2">
              <span
                className={`font-display w-16 shrink-0 text-sm font-black ${
                  now ? 'text-amber' : 'text-ink/70'
                }`}
              >
                {format(parseKey(k), 'EEE d')}
                {now && <span className="block text-[0.6rem] leading-none">today</span>}
              </span>
              <select
                value={current.id}
                onChange={(e) => setDay(k, e.target.value)}
                className={`min-w-0 flex-1 rounded-xl border-2 px-2 py-2 font-bold ${
                  now
                    ? 'border-amber/60 bg-amber/10'
                    : isSet
                      ? 'border-teal/40 bg-teal-soft/40'
                      : 'border-ink/15 bg-white'
                }`}
              >
                {state.locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name}
                    {!l.earns ? ' (day off)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-xs font-semibold text-ink/45">
        Days you haven’t set use your default place. Plan as many weeks ahead as you like.
      </p>
    </section>
  )
}
