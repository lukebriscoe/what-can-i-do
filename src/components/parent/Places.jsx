import React from 'react'
import { useStore } from '../../store-context.jsx'
import { Section, TextInput, Toggle, Button } from './controls.jsx'
import WeekPlanner from './WeekPlanner.jsx'

const uid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`

export default function Places() {
  const { state, dispatch } = useStore()
  const locations = state.locations
  const setLocations = (next) => dispatch({ type: 'setLocations', locations: next })
  const updateLoc = (id, patch) => setLocations(locations.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  return (
    <div>
      <Section title="Default place" hint="Used for any day you haven't planned.">
        <select
          value={state.settings.defaultLocationId}
          onChange={(e) => dispatch({ type: 'patchSettings', patch: { defaultLocationId: e.target.value } })}
          className="w-full rounded-xl border-2 border-ink/15 bg-white px-3 py-2 font-bold"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.icon} {l.name}
            </option>
          ))}
        </select>
      </Section>

      <WeekPlanner />

      <Section title="Places" hint="Each place shows its own schedule. Turn off “Earns” for days off.">
        <div className="space-y-2">
          {locations.map((l) => (
            <div key={l.id} className="rounded-xl border-2 border-ink/10 bg-white/70 p-2.5">
              <div className="flex items-center gap-2">
                <TextInput
                  value={l.icon}
                  maxLength={2}
                  onChange={(e) => updateLoc(l.id, { icon: e.target.value })}
                  className="w-12 text-center text-lg"
                />
                <TextInput
                  value={l.name}
                  onChange={(e) => updateLoc(l.id, { name: e.target.value })}
                  className="min-w-0 flex-1"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-ink/70">
                <span>Schedule:</span>
                <select
                  value={l.templateId}
                  onChange={(e) => updateLoc(l.id, { templateId: e.target.value })}
                  className="rounded-lg border-2 border-ink/15 bg-white px-2 py-1"
                >
                  {state.templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5">
                  Earns
                  <Toggle checked={l.earns} onChange={(v) => updateLoc(l.id, { earns: v })} />
                </label>
                {locations.length > 1 && (
                  <button
                    onClick={() => setLocations(locations.filter((x) => x.id !== l.id))}
                    className="ml-auto text-coral"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full"
          onClick={() =>
            setLocations([
              ...locations,
              { id: uid('loc'), name: 'New place', icon: '📍', templateId: state.templates[0]?.id, earns: true },
            ])
          }
        >
          + Add a place
        </Button>
      </Section>
    </div>
  )
}
