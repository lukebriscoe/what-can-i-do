import { isDayComplete, isEarningDay, bankableForDay } from './rewards.js'

const uid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

function emptyDay() {
  return { locationId: null, completed: {}, dayComplete: false, banked: 0 }
}

/**
 * Make a day's `dayComplete`, `banked` and its 'earn' ledger entry consistent
 * with the current ticks + earning rules. Used after every toggle / location
 * change so banking can never drift or double-count.
 */
function reconcileDay(state, key) {
  const complete = isDayComplete(state, key)
  const earning = isEarningDay(state, key)
  const day = { ...(state.days[key] || emptyDay()), dayComplete: complete }
  let ledger = state.ledger
  const existing = ledger.find((e) => e.type === 'earn' && e.dateKey === key)

  if (complete && earning && !existing) {
    const amount = bankableForDay(state, key)
    day.banked = amount
    if (amount > 0) {
      ledger = [
        ...ledger,
        { id: uid('led'), ts: Date.now(), type: 'earn', amount, dateKey: key, note: 'Completed the day' },
      ]
    }
  } else if ((!complete || !earning) && existing) {
    day.banked = 0
    ledger = ledger.filter((e) => e.id !== existing.id)
  }

  return { ...state, days: { ...state.days, [key]: day }, ledger }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.state

    case 'toggleActivity': {
      const { key, activityId } = action
      const day = state.days[key] || emptyDay()
      const completed = { ...day.completed, [activityId]: !day.completed[activityId] }
      if (!completed[activityId]) delete completed[activityId]
      const next = { ...state, days: { ...state.days, [key]: { ...day, completed } } }
      return reconcileDay(next, key)
    }

    case 'setDayLocation': {
      const { key, locationId } = action
      const day = state.days[key] || emptyDay()
      const next = { ...state, days: { ...state.days, [key]: { ...day, locationId } } }
      return reconcileDay(next, key)
    }

    case 'addBonus': {
      const { key, title, amount, icon } = action
      const entry = {
        id: uid('led'),
        ts: Date.now(),
        type: 'bonus',
        amount: Number(amount) || 0,
        dateKey: key,
        note: `${icon ? icon + ' ' : ''}${title}`,
      }
      return { ...state, ledger: [...state.ledger, entry] }
    }

    case 'recordPayout': {
      const entry = {
        id: uid('led'),
        ts: Date.now(),
        type: 'payout',
        amount: -Math.abs(Number(action.amount) || 0),
        note: action.note || 'Paid out',
      }
      return { ...state, ledger: [...state.ledger, entry] }
    }

    case 'addAdjust': {
      const entry = {
        id: uid('led'),
        ts: Date.now(),
        type: 'adjust',
        amount: Number(action.amount) || 0,
        note: action.note || 'Adjustment',
      }
      return { ...state, ledger: [...state.ledger, entry] }
    }

    case 'removeLedgerEntry':
      return { ...state, ledger: state.ledger.filter((e) => e.id !== action.id) }

    case 'patchSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } }

    case 'patchReward':
      return {
        ...state,
        settings: { ...state.settings, reward: { ...state.settings.reward, ...action.patch } },
      }

    case 'patchChild':
      return { ...state, child: { ...state.child, ...action.patch } }

    case 'setTemplates':
      return { ...state, templates: action.templates }

    case 'setLocations':
      return { ...state, locations: action.locations }

    case 'setBonusJobs':
      return { ...state, bonusJobs: action.bonusJobs }

    case 'setMeta':
      return { ...state, meta: { ...state.meta, ...action.patch } }

    default:
      return state
  }
}

export { reconcileDay, uid }
