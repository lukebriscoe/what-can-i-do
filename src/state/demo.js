import { defaultState } from './defaults.js'
import { reducer } from './reducer.js'
import { todayKey, weekKeyOf, addDays } from '../lib/date.js'
import { countableIdsForDay } from './rewards.js'

// A believable, filled-in example family so people can explore the app without
// setting anything up. Built by driving the real reducer, so all the banking,
// weekly-cap and ledger maths stay perfectly consistent. Anchored to the current
// week so it always looks "live" whenever it's loaded.
export function demoState() {
  const today = todayKey()
  const monday = weekKeyOf(today)

  let s = defaultState()
  s = reducer(s, { type: 'patchChild', patch: { name: 'Ada', avatar: '🦄' } })
  s = reducer(s, { type: 'patchSettings', patch: { holidayStartKey: monday } })

  // A varied week: home, two days at grandparents, summer club, home, weekend off.
  const plan = [
    'loc_home',
    'loc_grandparents',
    'loc_grandparents',
    'loc_summer',
    'loc_home',
    'loc_holiday',
    'loc_holiday',
  ]
  const keys = plan.map((_, i) => addDays(monday, i))
  plan.forEach((loc, i) => {
    s = reducer(s, { type: 'setDayLocation', key: keys[i], locationId: loc })
  })

  const tick = (i, fraction = 1) => {
    const ids = countableIdsForDay(s, keys[i])
    const count = fraction >= 1 ? ids.length : Math.max(1, Math.round(ids.length * fraction))
    ids.slice(0, count).forEach((id) => {
      s = reducer(s, { type: 'toggleActivity', key: keys[i], activityId: id })
    })
  }

  // Mon–Wed all done (banked), Thu half-done (in progress).
  tick(0)
  tick(1)
  tick(2)
  tick(3, 0.5)

  // A couple of claimed bonus jobs, and a cash payout already handed over.
  s = reducer(s, { type: 'addBonus', key: keys[0], title: 'Water the house plants', amount: 0.5, icon: '🪴' })
  s = reducer(s, { type: 'addBonus', key: keys[1], title: 'A really kind or helpful moment', amount: 0.5, icon: '💛' })
  s = reducer(s, { type: 'recordPayout', amount: 2, note: 'Paid £2.00 pocket money' })

  return s
}
