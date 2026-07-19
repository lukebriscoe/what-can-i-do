import React from 'react'
import { useStore } from '../../store-context.jsx'
import { DAY_LABELS } from '../../lib/date.js'
import { Section, Row, NumberInput, TextInput, Toggle, Button } from './controls.jsx'

const uid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`

export default function Rewards() {
  const { state, dispatch } = useStore()
  const r = state.settings.reward
  const patchReward = (patch) => dispatch({ type: 'patchReward', patch })

  const toggleDay = (i) => {
    const set = new Set(r.earningDays)
    set.has(i) ? set.delete(i) : set.add(i)
    patchReward({ earningDays: [...set].sort((a, b) => a - b) })
  }

  const jobs = state.bonusJobs
  const setJobs = (next) => dispatch({ type: 'setBonusJobs', bonusJobs: next })
  const updateJob = (id, patch) => setJobs(jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)))

  return (
    <div>
      <Section title="Pocket money" hint="How much your child can earn for completing a day.">
        <Row label="Currency symbol">
          <TextInput
            value={r.currency}
            maxLength={2}
            onChange={(e) => patchReward({ currency: e.target.value })}
            className="w-16 text-center"
          />
        </Row>
        <Row label="Money per completed day">
          <NumberInput value={r.dailyAmount} prefix={r.currency} onChange={(v) => patchReward({ dailyAmount: v })} />
        </Row>
        <Row label="Weekly limit">
          <NumberInput value={r.weeklyCap} prefix={r.currency} onChange={(v) => patchReward({ weeklyCap: v })} />
        </Row>
        <div className="pt-2">
          <p className="mb-2 text-sm font-bold text-ink/80">Days that can earn</p>
          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map((d, i) => {
              const on = r.earningDays.includes(i)
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(i)}
                  className={`rounded-xl border-2 py-2 font-display text-xs font-black ${
                    on ? 'border-teal bg-teal text-white' : 'border-ink/15 bg-white text-ink/40'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs font-semibold text-ink/50">
            Default {r.currency}
            {Number(r.dailyAmount).toFixed(2)}/day, up to {r.currency}
            {Number(r.weeklyCap).toFixed(2)} a week.
          </p>
        </div>
      </Section>

      <Section title="Screen-time reward" hint="Optional: track earned screen time alongside money.">
        <Row label="Enabled">
          <Toggle
            checked={state.settings.screenTime.enabled}
            onChange={(v) =>
              dispatch({
                type: 'patchSettings',
                patch: { screenTime: { ...state.settings.screenTime, enabled: v } },
              })
            }
          />
        </Row>
        {state.settings.screenTime.enabled && (
          <Row label="Minutes earned per completed day">
            <NumberInput
              value={state.settings.screenTime.minutesPerDay}
              step={5}
              onChange={(v) =>
                dispatch({
                  type: 'patchSettings',
                  patch: { screenTime: { ...state.settings.screenTime, minutesPerDay: v } },
                })
              }
            />
          </Row>
        )}
      </Section>

      <Section title="Bonus jobs" hint="Extra helpful jobs your child can claim for extra coins.">
        <Row label="Show bonus jobs">
          <Toggle checked={r.bonusJobsEnabled} onChange={(v) => patchReward({ bonusJobsEnabled: v })} />
        </Row>
        <div className="mt-2 space-y-2">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center gap-2 rounded-xl border-2 border-ink/10 bg-white/70 p-2">
              <TextInput
                value={job.icon}
                maxLength={2}
                onChange={(e) => updateJob(job.id, { icon: e.target.value })}
                className="w-12 text-center text-lg"
              />
              <TextInput
                value={job.title}
                onChange={(e) => updateJob(job.id, { title: e.target.value })}
                className="min-w-0 flex-1"
              />
              <NumberInput value={job.amount} prefix={r.currency} onChange={(v) => updateJob(job.id, { amount: v })} />
              <button
                onClick={() => setJobs(jobs.filter((j) => j.id !== job.id))}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral/15 text-coral"
                aria-label="Remove job"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => setJobs([...jobs, { id: uid('job'), icon: '⭐', title: 'New job', amount: 0.5 }])}
        >
          + Add a bonus job
        </Button>
      </Section>
    </div>
  )
}
