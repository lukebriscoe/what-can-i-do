import React, { useRef, useState } from 'react'
import { useStore } from '../../store-context.jsx'
import { defaultState } from '../../state/defaults.js'
import { exportState, importStateFromFile } from '../../state/backup.js'
import { Section, Row, TextInput, NumberInput, Button } from './controls.jsx'

const AVATARS = ['🦊', '🐢', '🦕', '🦄', '🐙', '🐝', '🦉', '🐬', '🐨', '🦁', '🐧', '🚀']

export default function Setup() {
  const { state, dispatch } = useStore()
  const fileRef = useRef(null)
  const [pinDraft, setPinDraft] = useState('')
  const [importMsg, setImportMsg] = useState(null)

  const doExport = () => {
    exportState(state)
    dispatch({ type: 'setMeta', patch: { lastBackupAt: Date.now() } })
  }

  const doImport = async (file) => {
    try {
      const imported = await importStateFromFile(file)
      dispatch({ type: 'hydrate', state: imported })
      setImportMsg({ ok: true, text: 'Backup restored! 🎉' })
    } catch (err) {
      setImportMsg({ ok: false, text: err.message })
    }
  }

  const lastBackup = state.meta.lastBackupAt
    ? new Date(state.meta.lastBackupAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })
    : 'never'

  return (
    <div>
      <Section title="Your explorer">
        <Row label="Name">
          <TextInput
            value={state.child.name}
            onChange={(e) => dispatch({ type: 'patchChild', patch: { name: e.target.value } })}
            className="w-40 text-right"
          />
        </Row>
        <p className="mb-1 mt-2 text-sm font-bold text-ink/80">Avatar</p>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => dispatch({ type: 'patchChild', patch: { avatar: a } })}
              className={`grid h-11 w-11 place-items-center rounded-xl border-2 text-2xl ${
                state.child.avatar === a ? 'border-teal bg-teal-soft' : 'border-ink/10 bg-white/70'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Holiday" hint="Anchors the week-by-week journey map.">
        <Row label="First Monday of the holiday">
          <input
            type="date"
            value={state.settings.holidayStartKey}
            onChange={(e) => dispatch({ type: 'patchSettings', patch: { holidayStartKey: e.target.value } })}
            className="rounded-xl border-2 border-ink/15 bg-white px-3 py-2 font-bold"
          />
        </Row>
        <Row label="Number of weeks">
          <NumberInput
            value={state.settings.holidayWeeks}
            step={1}
            min={1}
            onChange={(v) => dispatch({ type: 'patchSettings', patch: { holidayWeeks: v } })}
          />
        </Row>
      </Section>

      <Section title="Grown-up PIN" hint="Locks this area. Leave blank for no lock.">
        <p className="mb-2 text-xs font-semibold text-ink/50">
          Currently: {state.settings.pin ? 'PIN set 🔒' : 'no PIN (area is open)'}
        </p>
        <div className="flex items-center gap-2">
          <TextInput
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder="New PIN (4–6 digits)"
            value={pinDraft}
            onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ''))}
            className="flex-1"
          />
          <Button
            onClick={() => {
              dispatch({ type: 'patchSettings', patch: { pin: pinDraft } })
              setPinDraft('')
            }}
          >
            Save
          </Button>
        </div>
        {state.settings.pin && (
          <Button
            variant="ghost"
            className="mt-2 w-full text-coral"
            onClick={() => dispatch({ type: 'patchSettings', patch: { pin: '' } })}
          >
            Remove PIN
          </Button>
        )}
      </Section>

      <Section title="Backup" hint={`Your data lives only on this device. Last backup: ${lastBackup}.`}>
        <Button className="w-full" onClick={doExport}>
          ⬇️ Download a backup file
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files[0] && doImport(e.target.files[0])}
        />
        <Button variant="amber" className="mt-2 w-full" onClick={() => fileRef.current?.click()}>
          ⬆️ Restore from a backup
        </Button>
        {importMsg && (
          <p className={`mt-2 text-sm font-bold ${importMsg.ok ? 'text-moss' : 'text-coral'}`}>{importMsg.text}</p>
        )}
      </Section>

      <Section title="Danger zone">
        <Button
          variant="ghost"
          className="w-full text-coral"
          onClick={() => {
            if (confirm('Reset everything to the starter setup? This cannot be undone (export a backup first!).')) {
              dispatch({ type: 'hydrate', state: defaultState() })
            }
          }}
        >
          Reset to starter setup
        </Button>
      </Section>
    </div>
  )
}
