import { get, set } from 'idb-keyval'
import { defaultState } from './defaults.js'

const KEY = 'wcid-state-v1'

/** Load persisted state from IndexedDB, seeding sensible defaults on first run. */
export async function loadState() {
  try {
    const saved = await get(KEY)
    // A real saved state always has `settings` + `days`; migrate() fills any
    // gaps. NOTE: this previously checked `saved.version`, which never existed
    // (the version lives at `saved.meta.version`) — so saved data was ALWAYS
    // ignored and the app reset to defaults on every fresh load. That was the
    // storage bug: configuration written overnight was discarded on reopen.
    if (saved && saved.settings && saved.days) return migrate(saved)
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

/** Write immediately, cancelling any pending debounced save. Used when the app
 *  is backgrounded/closed so the very last change can't be lost. */
export function flushState(state) {
  clearTimeout(_saveTimer)
  return set(KEY, state).catch((err) => console.warn('Flush save failed:', err))
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
