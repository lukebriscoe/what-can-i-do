import { mondayIndex, weekKeyOf, weekWindowKeys } from '../lib/date.js'

// ------------------------------------------------------------------ //
// Pure reward + completion maths. No React, no storage — unit-tested. //
// ------------------------------------------------------------------ //

export function money(amount, currency = '£') {
  const n = Number(amount) || 0
  return `${amount < 0 ? '-' : ''}${currency}${Math.abs(n).toFixed(2)}`
}

export function locationForDay(state, key) {
  const rec = state.days[key]
  const id = rec?.locationId || state.settings.defaultLocationId
  return state.locations.find((l) => l.id === id) || state.locations[0]
}

export function templateForLocation(state, location) {
  if (!location) return null
  return state.templates.find((t) => t.id === location.templateId) || null
}

/** All activities scheduled for a given day (from its location's template). */
export function activitiesForDay(state, key) {
  const loc = locationForDay(state, key)
  const tpl = templateForLocation(state, loc)
  return tpl ? tpl.activities : []
}

/** Ids of the activities that must be ticked for the day to count. */
export function countableIdsForDay(state, key) {
  return activitiesForDay(state, key)
    .filter((a) => a.countsTowardDay)
    .map((a) => a.id)
}

export function completedCountFor(state, key) {
  const done = state.days[key]?.completed || {}
  const ids = countableIdsForDay(state, key)
  return ids.filter((id) => done[id]).length
}

export function isDayComplete(state, key) {
  const ids = countableIdsForDay(state, key)
  if (ids.length === 0) return false
  const done = state.days[key]?.completed || {}
  return ids.every((id) => done[id])
}

export function isEarningDay(state, key) {
  const loc = locationForDay(state, key)
  if (!loc?.earns) return false
  return state.settings.reward.earningDays.includes(mondayIndex(key))
}

/** Core (daily) money already banked in the same week, optionally excluding a day. */
export function coreEarnedInWeek(state, key, excludeKey = null) {
  const wk = weekKeyOf(key)
  return weekWindowKeys(key).reduce((sum, k) => {
    if (k === excludeKey) return sum
    if (weekKeyOf(k) !== wk) return sum
    return sum + (state.days[k]?.banked || 0)
  }, 0)
}

/**
 * How much core money completing this day *should* bank right now, respecting
 * the weekly cap and whether it's an earning day. Returns 0 if not earnable.
 */
export function bankableForDay(state, key) {
  if (!isEarningDay(state, key)) return 0
  const { dailyAmount, weeklyCap } = state.settings.reward
  const already = coreEarnedInWeek(state, key, key)
  const remaining = Math.max(0, weeklyCap - already)
  return Math.min(dailyAmount, remaining)
}

export function balanceOf(ledger) {
  return ledger.reduce((sum, e) => sum + e.amount, 0)
}

export function totalEarned(ledger) {
  return ledger
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0)
}

export function totalPaidOut(ledger) {
  return ledger
    .filter((e) => e.type === 'payout')
    .reduce((sum, e) => sum + Math.abs(e.amount), 0)
}

export function coreEarnedThisWeek(state, key) {
  return coreEarnedInWeek(state, key)
}

export function bonusesThisWeek(state, key) {
  const wk = weekKeyOf(key)
  return state.ledger
    .filter((e) => e.type === 'bonus' && e.dateKey && weekKeyOf(e.dateKey) === wk)
    .reduce((sum, e) => sum + e.amount, 0)
}

/** A short status for a past/present/future day, used by the week map. */
export function dayStatus(state, key, todayK) {
  const rec = state.days[key]
  if (rec?.dayComplete) return 'complete'
  if (key > todayK) return 'upcoming'
  if (key === todayK) return 'today'
  // past day
  if (rec && completedCountFor(state, key) > 0) return 'partial'
  return 'missed'
}
