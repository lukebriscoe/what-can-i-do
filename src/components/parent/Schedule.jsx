import React, { useState } from 'react'
import { useStore } from '../../store-context.jsx'
import { Section, TextInput, Toggle, Button } from './controls.jsx'

const uid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`

export default function Schedule() {
  const { state, dispatch } = useStore()
  const templates = state.templates
  const [selId, setSelId] = useState(templates[0]?.id)
  const tpl = templates.find((t) => t.id === selId) || templates[0]

  const setTemplates = (next) => dispatch({ type: 'setTemplates', templates: next })
  const updateTpl = (patch) => setTemplates(templates.map((t) => (t.id === tpl.id ? { ...t, ...patch } : t)))
  const updateAct = (aid, patch) =>
    updateTpl({ activities: tpl.activities.map((a) => (a.id === aid ? { ...a, ...patch } : a)) })

  const move = (idx, dir) => {
    const arr = [...tpl.activities]
    const j = idx + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
    updateTpl({ activities: arr })
  }

  const addTemplate = () => {
    const t = { id: uid('tpl'), name: 'New schedule', activities: [] }
    setTemplates([...templates, t])
    setSelId(t.id)
  }

  const usedByLocation = state.locations.some((l) => l.templateId === tpl?.id)

  if (!tpl) return null

  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelId(t.id)}
            className={`whitespace-nowrap rounded-full border-2 px-3 py-1.5 font-display text-sm font-black ${
              t.id === selId ? 'border-teal bg-teal text-white' : 'border-ink/15 bg-white text-ink/60'
            }`}
          >
            {t.name}
          </button>
        ))}
        <button
          onClick={addTemplate}
          className="whitespace-nowrap rounded-full border-2 border-dashed border-teal/50 px-3 py-1.5 font-display text-sm font-black text-teal"
        >
          + New
        </button>
      </div>

      <Section title="Schedule name">
        <TextInput value={tpl.name} onChange={(e) => updateTpl({ name: e.target.value })} className="w-full" />
        {!usedByLocation && (
          <p className="mt-2 text-xs font-semibold text-amber">
            ⚠️ Not linked to a place yet — set it under 📍 Places.
          </p>
        )}
      </Section>

      <Section title="Activities" hint="Tick “Counts” for must-dos that make up the day. “Job” marks a chore.">
        <div className="space-y-2">
          {tpl.activities.map((a, idx) => (
            <div key={a.id} className="rounded-xl border-2 border-ink/10 bg-white/70 p-2.5">
              <div className="flex items-center gap-2">
                <TextInput
                  value={a.icon}
                  maxLength={2}
                  onChange={(e) => updateAct(a.id, { icon: e.target.value })}
                  className="w-12 text-center text-lg"
                />
                <TextInput
                  value={a.title}
                  onChange={(e) => updateAct(a.id, { title: e.target.value })}
                  className="min-w-0 flex-1"
                />
                <div className="flex flex-col">
                  <button onClick={() => move(idx, -1)} className="px-1 text-xs text-ink/40" aria-label="Move up">
                    ▲
                  </button>
                  <button onClick={() => move(idx, 1)} className="px-1 text-xs text-ink/40" aria-label="Move down">
                    ▼
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-1 text-xs font-bold text-ink/70">
                <label className="flex items-center gap-1">
                  🕒
                  <input
                    type="time"
                    value={a.time || ''}
                    onChange={(e) => updateAct(a.id, { time: e.target.value })}
                    className="rounded-lg border-2 border-ink/15 bg-white px-1.5 py-0.5"
                  />
                </label>
                <label className="flex items-center gap-1.5">
                  Counts
                  <Toggle checked={a.countsTowardDay} onChange={(v) => updateAct(a.id, { countsTowardDay: v })} />
                </label>
                <label className="flex items-center gap-1.5">
                  Job
                  <Toggle checked={a.isChore} onChange={(v) => updateAct(a.id, { isChore: v })} />
                </label>
                <button
                  onClick={() => updateTpl({ activities: tpl.activities.filter((x) => x.id !== a.id) })}
                  className="ml-auto text-coral"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() =>
            updateTpl({
              activities: [
                ...tpl.activities,
                { id: uid('act'), icon: '✅', title: 'New activity', countsTowardDay: true, isChore: false, time: '' },
              ],
            })
          }
        >
          + Add activity
        </Button>
      </Section>

      {templates.length > 1 && (
        <Button
          variant="ghost"
          className="w-full text-coral"
          onClick={() => {
            const next = templates.filter((t) => t.id !== tpl.id)
            setTemplates(next)
            setSelId(next[0].id)
          }}
        >
          Delete “{tpl.name}”
        </Button>
      )}
    </div>
  )
}
