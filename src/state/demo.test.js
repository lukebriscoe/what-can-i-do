import { describe, it, expect } from 'vitest'
import { demoState } from './demo.js'
import { balanceOf, totalEarned, totalPaidOut, isDayComplete } from './rewards.js'
import { todayKey, weekKeyOf, addDays } from '../lib/date.js'

describe('demo data', () => {
  const s = demoState()
  const monday = weekKeyOf(todayKey())

  it('personalises the child', () => {
    expect(s.child.name).toBe('Ada')
  })

  it('completes Mon–Wed and leaves Thursday in progress', () => {
    expect(isDayComplete(s, monday)).toBe(true)
    expect(isDayComplete(s, addDays(monday, 1))).toBe(true)
    expect(isDayComplete(s, addDays(monday, 2))).toBe(true)
    expect(isDayComplete(s, addDays(monday, 3))).toBe(false)
  })

  it('has consistent banking: £3 earned + £1 bonuses − £2 paid = £2 balance', () => {
    expect(totalEarned(s.ledger)).toBe(4) // 3 days @ £1 + 2 bonuses @ £0.50
    expect(totalPaidOut(s.ledger)).toBe(2)
    expect(balanceOf(s.ledger)).toBe(2)
  })
})
