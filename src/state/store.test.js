import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defaultState } from './defaults.js'

// In-memory stand-in for IndexedDB so we can test the save/load round-trip.
const { mem } = vi.hoisted(() => ({ mem: new Map() }))
vi.mock('idb-keyval', () => ({
  get: async (k) => mem.get(k),
  set: async (k, v) => {
    mem.set(k, v)
  },
}))

import { loadState, flushState } from './store.js'

beforeEach(() => mem.clear())

describe('state persistence', () => {
  it('round-trips saved state instead of resetting to defaults (regression)', async () => {
    const saved = defaultState()
    saved.child.name = 'Luke'
    saved.settings.reward.dailyAmount = 2
    saved.settings.pin = '1234'
    saved.templates[0].activities[0].title = 'My custom activity'

    await flushState(saved)
    const loaded = await loadState()

    // The whole point: configuration survives a reload.
    expect(loaded.child.name).toBe('Luke')
    expect(loaded.settings.reward.dailyAmount).toBe(2)
    expect(loaded.settings.pin).toBe('1234')
    expect(loaded.templates[0].activities[0].title).toBe('My custom activity')
  })

  it('falls back to defaults when nothing is saved', async () => {
    const loaded = await loadState()
    expect(loaded.child.name).toBe(defaultState().child.name)
  })

  it('tolerates a saved state missing newer keys (migrate fills gaps)', async () => {
    const partial = defaultState()
    partial.child.name = 'Ada'
    delete partial.bonusJobs // simulate an older save without bonus jobs
    await flushState(partial)

    const loaded = await loadState()
    expect(loaded.child.name).toBe('Ada')
    expect(Array.isArray(loaded.bonusJobs)).toBe(true) // restored from defaults
  })
})
