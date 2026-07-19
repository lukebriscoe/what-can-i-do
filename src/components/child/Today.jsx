import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../store-context.jsx'
import { todayKey, greetingForNow, niceDate } from '../../lib/date.js'
import {
  activitiesForDay,
  countableIdsForDay,
  completedCountFor,
  isDayComplete,
  isEarningDay,
  bankableForDay,
  locationForDay,
} from '../../state/rewards.js'
import ActivityRow from './ActivityRow.jsx'
import ProgressRing from '../ui/ProgressRing.jsx'
import LocationPicker from './LocationPicker.jsx'
import CoinCelebration from '../ui/CoinCelebration.jsx'

export default function Today() {
  const { state, dispatch } = useStore()
  const key = todayKey()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [celebrate, setCelebrate] = useState(null) // { amount } | null

  const activities = activitiesForDay(state, key)
  const countable = countableIdsForDay(state, key)
  const doneCount = completedCountFor(state, key)
  const done = state.days[key]?.completed || {}
  const complete = isDayComplete(state, key)
  const earning = isEarningDay(state, key)
  const location = locationForDay(state, key)
  const potential = bankableForDay(state, key)
  const { currency } = state.settings.reward

  // First not-done countable activity is "now".
  const nowId = activities.find((a) => a.countsTowardDay && !done[a.id])?.id

  // Fire the celebration when the day flips to complete.
  const wasComplete = useRef(complete)
  useEffect(() => {
    if (complete && !wasComplete.current) {
      setCelebrate({ amount: state.days[key]?.banked || 0 })
    }
    wasComplete.current = complete
  }, [complete, key, state.days])

  const toggle = (activityId) => dispatch({ type: 'toggleActivity', key, activityId })

  const availableJobs = state.settings.reward.bonusJobsEnabled ? state.bonusJobs : []
  const claimedToday = state.ledger.filter((e) => e.type === 'bonus' && e.dateKey === key)

  return (
    <div className="space-y-4">
      <CoinCelebration
        show={!!celebrate}
        amount={celebrate?.amount || 0}
        currency={currency}
        onDone={() => setCelebrate(null)}
      />

      {/* Greeting + location */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-sm font-semibold text-ink/50">{greetingForNow()},</p>
          <h1 className="font-display text-2xl font-black text-ink">{niceDate(key)}</h1>
        </div>
      </div>

      <button
        onClick={() => setPickerOpen(true)}
        className="card flex w-full items-center gap-3 px-3 py-2.5 text-left active:scale-[0.99]"
      >
        <span className="text-2xl">{location.icon}</span>
        <div className="flex-1">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">Today you're at</p>
          <p className="font-body text-lg font-extrabold leading-tight">{location.name}</p>
        </div>
        <span className="chip bg-teal-soft text-teal-deep">Change</span>
      </button>

      {/* Progress hero */}
      <div className="card flex items-center gap-4 p-4">
        <ProgressRing value={doneCount} max={countable.length} size={104} stroke={11}>
          <div className="text-center leading-none">
            <div className="text-3xl">{complete ? '🎉' : '🪙'}</div>
            <div className="font-display mt-1 text-sm font-black text-ink">
              {doneCount}/{countable.length}
            </div>
          </div>
        </ProgressRing>
        <div className="flex-1">
          {complete ? (
            <p className="font-display text-lg font-black text-moss">All done — amazing! 🌟</p>
          ) : countable.length > 0 ? (
            <p className="font-display text-lg font-black text-ink">
              {countable.length - doneCount} to go!
            </p>
          ) : (
            <p className="font-display text-lg font-black text-ink">Enjoy your day! 🌞</p>
          )}
          {earning ? (
            <p className="mt-1 text-sm font-bold text-ink/60">
              {complete ? 'You banked ' : 'Finish the day to bank '}
              <span className="text-coral">
                {currency}
                {(complete ? state.days[key]?.banked || 0 : potential).toFixed(2)}
              </span>
              {potential === 0 && !complete && ' (weekly limit reached)'}
            </p>
          ) : countable.length === 0 ? (
            <p className="mt-1 text-sm font-bold text-ink/50">A day off — just have fun! 😎</p>
          ) : complete ? (
            <p className="mt-1 text-sm font-bold text-moss">You did the whole plan — superstar! 🌟</p>
          ) : (
            <p className="mt-1 text-sm font-bold text-ink/60">
              You can do it! Let's finish your day! 🌟
            </p>
          )}
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-2">
        {activities.map((a) => (
          <ActivityRow
            key={a.id}
            activity={a}
            done={!!done[a.id]}
            isNow={a.id === nowId}
            onToggle={() => toggle(a.id)}
          />
        ))}
        {activities.length === 0 && (
          <div className="card p-6 text-center text-ink/50">
            <p className="font-bold">No plan for this place yet.</p>
            <p className="text-sm">A grown-up can add one in the ⚙️ area.</p>
          </div>
        )}
      </div>

      {/* Bonus jobs */}
      {availableJobs.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-display px-1 pt-1 text-sm font-black uppercase tracking-wide text-coral">
            ✨ Extra jobs, extra coins
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {availableJobs.map((job) => {
              const times = claimedToday.filter((c) => c.note.includes(job.title)).length
              return (
                <motion.button
                  key={job.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    dispatch({ type: 'addBonus', key, title: job.title, amount: job.amount, icon: job.icon })
                  }
                  className="card flex flex-col gap-1 p-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{job.icon}</span>
                    <span className="chip bg-amber/20 text-[0.8rem] text-amber">
                      +{currency}
                      {job.amount.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm font-bold leading-tight">{job.title}</span>
                  {times > 0 && (
                    <span className="text-[0.7rem] font-bold text-moss">Done {times}× today ✓</span>
                  )}
                </motion.button>
              )
            })}
          </div>
          <p className="px-1 text-center text-xs font-semibold text-ink/40">
            Tap when you've helped — a grown-up will double-check.
          </p>
        </div>
      )}

      <LocationPicker
        open={pickerOpen}
        locations={state.locations}
        currentId={location.id}
        onPick={(locationId) => dispatch({ type: 'setDayLocation', key, locationId })}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}
