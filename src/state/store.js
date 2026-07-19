import { get, set } from 'idb-keyval'
import { defaultState } from './defaults.js'

const KEY = 'wcid-state-v1'

/** Load persisted state from IndexedDB, seeding sensible defaults on first run. */
export async function loadState() {
  try {
    const saved = await get(KEY)
    if (saved && saved.version >= 1) return migrate(saved)
  } catch (err) {
    console.warn('Could not read saved state, starting fresh:', err)
  }
  return defaultState()
}

let _saveTimer = null
/** Debounced persist so rapid taps don't thrash IndexedDB. */
export function saveState(state) {
  clearTimeout(_saveTimer)
  _saveTimer = setTimeout(() => {
    set(KEY, state).catch((err) => console.warn('Save failed:', err))
  }, 150)
}

// Forward-compatible: fill in any keys added in later versions.
function migrate(state) {
  const base = defaultState()
  return {
    ...base,
    ...state,
    settings: { ...base.settings, ...state.settings, reward: { ...base.settings.reward, ...state.settings?.reward } },
    meta: { ...base.meta, ...state.meta, version: base.meta.version },
  }
}

export { KEY }
