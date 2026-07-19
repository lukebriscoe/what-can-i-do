import { describe, it, expect } from 'vitest'
import { reducer } from './reducer.js'
import {
  isDayComplete,
  bankableForDay,
  isEarningDay,
  balanceOf,
  coreEarnedInWeek,
} from './rewards.js'

// A tiny controlled world: one location, one 2-activity template.
function makeState(overrides = {}) {
  return {
    child: { name: 'Test', avatar: '🦊' },
    settings: {
      pin: '',
      defaultLocationId: 'loc_home',
      holidayStartKey: '2026-07-20',
      holidayWeeks: 7,
      reward: {
        currency: '£',
        dailyAmount: 1,
        weeklyCap: 5,
        earningDays: [0, 1, 2, 3, 4], // Mon–Fri
        bonusJobsEnabled: true,
      },
      screenTime: { enabled: false, minutesPerDay: 30 },
    },
    locations: [
      { id: 'loc_home', name: 'Home', icon: '🏠', templateId: 'tpl', earns: true },
      { id: 'loc_away', name: 'Away', icon: '🧳', templateId: 'tpl', earns: false },
    ],
    templates: [
      {
        id: 'tpl',
        name: 'Home',
        activities: [
          { id: 'a1', icon: '📚', title: 'Read', countsTowardDay: true, isChore: false },
          { id: 'a2', icon: '🧹', title: 'Tidy', countsTowardDay: true, isChore: true },
          { id: 'a3', icon: '📺', title: 'Screen', countsTowardDay: false, isChore: false },
        ],
      },
    ],
    bonusJobs: [],
    days: {},
    ledger: [],
    meta: { createdAt: '2026-07-20', lastBackupAt: null, version: 1 },
    ...overrides,
  }
}

// Known dates: 2026-07-20 is a Monday, 2026-07-25 a Saturday.
const MON = '2026-07-20'
const TUE = '2026-07-21'
const SAT = '2026-07-25'

function complete(state, key) {
  let s = reducer(state, { type: 'toggleActivity', key, activityId: 'a1' })
  s = reducer(s, { type: 'toggleActivity', key, activityId: 'a2' })
  return s
}

describe('day completion', () => {
  it('only counts activities flagged countsTowardDay', () => {
    let s = makeState()
    s = reducer(s, { type: 'toggleActivity', key: MON, activityId: 'a1' })
    expect(isDayComplete(s, MON)).toBe(false)
    s = reducer(s, { type: 'toggleActivity', key: MON, activityId: 'a2' })
    expect(isDayComplete(s, MON)).toBe(true)
    // The non-counting 'a3' is irrelevant to completion.
  })
})

describe('banking', () => {
  it('banks the daily amount once on completion', () => {
    const s = complete(makeState(), MON)
    expect(s.days[MON].dayComplete).toBe(true)
    expect(s.days[MON].banked).toBe(1)
    expect(balanceOf(s.ledger)).toBe(1)
    expect(s.ledger.filter((e) => e.type === 'earn')).toHaveLength(1)
  })

  it('does not double-bank on re-toggle churn', () => {
    let s = complete(makeState(), MON)
    // untick then retick a2
    s = reducer(s, { type: 'toggleActivity', key: MON, activityId: 'a2' })
    expect(s.days[MON].dayComplete).toBe(false)
    expect(balanceOf(s.ledger)).toBe(0)
    s = reducer(s, { type: 'toggleActivity', key: MON, activityId: 'a2' })
    expect(balanceOf(s.ledger)).toBe(1)
    expect(s.ledger.filter((e) => e.type === 'earn')).toHaveLength(1)
  })

  it('reverses the earn when a completed day is un-completed', () => {
    let s = complete(makeState(), MON)
    s = reducer(s, { type: 'toggleActivity', key: MON, activityId: 'a1' })
    expect(s.days[MON].banked).toBe(0)
    expect(s.ledger.filter((e) => e.type === 'earn')).toHaveLength(0)
  })

  it('respects the weekly cap', () => {
    let s = makeState()
    s = { ...s, settings: { ...s.settings, reward: { ...s.settings.reward, weeklyCap: 2 } } }
    // three earning days in the same week, cap £2
    s = complete(s, MON)
    s = complete(s, TUE)
    s = complete(s, '2026-07-22') // Wed
    expect(coreEarnedInWeek(s, MON)).toBe(2)
    expect(s.days['2026-07-22'].banked).toBe(0) // capped
    expect(s.days['2026-07-22'].dayComplete).toBe(true) // still complete, just no money
  })

  it('earns nothing on a non-earning weekday setting', () => {
    const s = complete(makeState(), SAT) // Saturday not in earningDays
    expect(isEarningDay(s, SAT)).toBe(false)
    expect(s.days[SAT].dayComplete).toBe(true)
    expect(s.days[SAT].banked).toBe(0)
    expect(balanceOf(s.ledger)).toBe(0)
  })

  it('earns nothing at a non-earning location even on a weekday', () => {
    let s = makeState()
    s = reducer(s, { type: 'setDayLocation', key: MON, locationId: 'loc_away' })
    s = complete(s, MON)
    expect(s.days[MON].banked).toBe(0)
    expect(balanceOf(s.ledger)).toBe(0)
  })

  it('reverses earnings if a banked day is later moved to a non-earning location', () => {
    let s = complete(makeState(), MON)
    expect(balanceOf(s.ledger)).toBe(1)
    s = reducer(s, { type: 'setDayLocation', key: MON, locationId: 'loc_away' })
    expect(s.days[MON].banked).toBe(0)
    expect(balanceOf(s.ledger)).toBe(0)
  })
})

describe('bonuses, payouts and adjustments', () => {
  it('adds bonuses and payouts to the balance correctly', () => {
    let s = complete(makeState(), MON) // +£1
    s = reducer(s, { type: 'addBonus', key: MON, title: 'Dishes', amount: 0.5, icon: '🍽️' })
    expect(balanceOf(s.ledger)).toBe(1.5)
    s = reducer(s, { type: 'recordPayout', amount: 1, note: 'cash' })
    expect(balanceOf(s.ledger)).toBe(0.5)
    s = reducer(s, { type: 'addAdjust', amount: -0.25, note: 'fine' })
    expect(balanceOf(s.ledger)).toBeCloseTo(0.25)
  })
})

describe('bankableForDay', () => {
  it('previews the correct amount before completion', () => {
    const s = makeState()
    expect(bankableForDay(s, MON)).toBe(1)
    expect(bankableForDay(s, SAT)).toBe(0) // not an earning day
  })
})
