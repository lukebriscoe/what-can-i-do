import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StoreProvider } from './store-context.jsx'

import Today from './components/child/Today.jsx'
import WeekMap from './components/child/WeekMap.jsx'
import Bank from './components/child/Bank.jsx'
import ParentArea from './components/parent/ParentArea.jsx'
import Rewards from './components/parent/Rewards.jsx'
import Schedule from './components/parent/Schedule.jsx'
import Places from './components/parent/Places.jsx'
import BankAdmin from './components/parent/BankAdmin.jsx'
import Setup from './components/parent/Setup.jsx'

// Server-render each screen with the default seeded state. This catches render-time
// crashes (bad props, undefined access) across the whole UI without a browser.
// Effects don't run here, so it exercises pure render output on the default data.
const noop = () => {}
const wrap = (el) => renderToString(<StoreProvider>{el}</StoreProvider>)

describe('screens render without crashing', () => {
  const screens = {
    Today: <Today />,
    WeekMap: <WeekMap onGoToday={noop} />,
    Bank: <Bank />,
    ParentArea: <ParentArea onClose={noop} />, // no PIN by default → unlocked
    Rewards: <Rewards />,
    Schedule: <Schedule />,
    Places: <Places />,
    BankAdmin: <BankAdmin />,
    Setup: <Setup />,
  }

  for (const [name, el] of Object.entries(screens)) {
    it(`renders ${name}`, () => {
      const html = wrap(el)
      expect(html.length).toBeGreaterThan(0)
    })
  }

  it('Today shows the seeded schedule + bonus jobs', () => {
    const html = wrap(<Today />)
    expect(html).toContain('Today you') // "Today you're at" (apostrophe is escaped)
    expect(html).toContain('have breakfast') // a seeded activity
    expect(html).toContain('Extra jobs, extra coins') // bonus jobs section
  })
})
