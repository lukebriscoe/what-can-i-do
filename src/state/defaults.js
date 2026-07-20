import { todayKey } from '../lib/date.js'

// Emoji icons keep the bundle tiny, render everywhere, and read well for
// pre-readers. Everything here is editable by the parent in-app.

let _id = 0
const uid = (prefix) => `${prefix}_${(_id++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`

function activity(icon, title, { counts = true, chore = false, time = '' } = {}) {
  return { id: uid('act'), icon, title, countsTowardDay: counts, isChore: chore, time }
}

export function defaultTemplates() {
  const home = {
    id: 'tpl_home',
    name: 'At home',
    activities: [
      activity('🚿', 'Shower & have breakfast', { chore: true, time: '08:00' }),
      activity('🛏️', 'Make your bed & get dressed', { chore: true, time: '08:30' }),
      activity('🍽️', 'Do the dishwasher', { chore: true, time: '08:45' }),
      activity('📚', 'Reading time', { time: '09:00' }),
      activity('🌳', 'Outdoor play or in the garden', { time: '09:30' }),
      activity('🧩', 'Puzzles, workbooks or colouring', { time: '10:30' }),
      activity('🍎', 'Help make lunch & clear up', { chore: true, time: '11:45' }),
      activity('🎨', 'Drawing, building, crafting', { chore: true, time: '13:00' }),
      activity('📺', 'Free choice / screen time', { counts: false, time: '14:00' }),
      activity('🌳', 'Outdoor play or in the garden', { time: '15:00' }),
      activity('🧸', 'Tidy up everything', { chore: true, time: '16:30' }),
      activity('🍔', 'Help get ready for dinner', { chore: true, time: '17:00' }),
  
    ],
  }
  const grandparents = {
    id: 'tpl_grandparents',
    name: 'At Grandparents',
    activities: [
      activity('😄', 'Say a big hello and a hug'),
      activity('📚', 'Read a story together'),
      activity('🌳', 'Go outside for an adventure'),
      activity('🤝', 'Help with a little job'),
      activity('📺', 'Free choice / screen time', { counts: false }),
    ],
  }
  const summerClub = {
    id: 'tpl_summer',
    name: 'Summer club',
    activities: [
      activity('🎒', 'Pack your bag (lunch and water)', { chore: true }),
      activity('🎉', 'Join in and make a friend'),
      activity('🗣️', 'Tell us one thing you did'),
    ],
  }
  // Backs the "On Holiday" place — a relaxed day off (earns nothing).
  const holiday = {
    id: 'tpl_holiday',
    name: 'On Holiday',
    activities: [
      activity('🏖️', 'Enjoy your holiday!', { counts: false }),
    ],
  }
  return [home, grandparents, summerClub, holiday]
}

export function defaultLocations() {
  return [
    { id: 'loc_home', name: 'Home', icon: '🏠', templateId: 'tpl_home', earns: true },
    { id: 'loc_grandparents', name: 'Grandparents', icon: '🧓', templateId: 'tpl_grandparents', earns: true },
    { id: 'loc_summer', name: 'Summer club', icon: '🎪', templateId: 'tpl_summer', earns: true },
    { id: 'loc_holiday', name: 'On Holiday', icon: '🏖️', templateId: 'tpl_holiday', earns: false },
  ]
}

export function defaultBonusJobs() {
  return [
    { id: 'job_plants', icon: '🪴', title: 'Water the house plants', amount: 0.5 },
    { id: 'job_wash', icon: '🚗', title: 'Help wash the car', amount: 1 },
    { id: 'job_kind', icon: '💛', title: 'A really kind or helpful moment', amount: 0.5 },
  ]
}

export function defaultState() {
  const created = todayKey()
  return {
    child: { name: 'Explorer', avatar: '🦊' },
    settings: {
      pin: '', // empty = parent area open until a PIN is set
      defaultLocationId: 'loc_home',
      holidayStartKey: '2026-07-20', // Monday 20 July 2026 — UK summer holiday start
      holidayWeeks: 6,
      reward: {
        currency: '£',
        dailyAmount: 1,
        weeklyCap: 5,
        earningDays: [0, 1, 2, 3, 4], // Mon–Fri (Mon=0 … Sun=6)
        bonusJobsEnabled: true,
      },
      screenTime: { enabled: false, minutesPerDay: 30 },
    },
    locations: defaultLocations(),
    templates: defaultTemplates(),
    bonusJobs: defaultBonusJobs(),
    days: {}, // keyed by 'yyyy-MM-dd'
    ledger: [], // { id, ts, type: 'earn'|'bonus'|'payout'|'adjust', amount, note, dateKey? }
    meta: { createdAt: created, lastBackupAt: null, version: 1 },
  }
}
