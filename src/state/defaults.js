import { todayKey, weekKeyOf } from '../lib/date.js'

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
    name: 'Home day',
    activities: [
      activity('🥣', 'Get dressed & have breakfast', { chore: true, time: '08:00' }),
      activity('🛏️', 'Make your bed', { chore: true }),
      activity('📚', 'Reading time (20 mins)', { time: '09:30' }),
      activity('🧩', 'Learning quest — a puzzle or worksheet', { time: '10:30' }),
      activity('🌳', 'Outdoor play or the garden', { time: '11:30' }),
      activity('🍎', 'Help make lunch & clear up', { chore: true, time: '12:30' }),
      activity('🎨', 'Make something — draw, build or craft', { time: '14:00' }),
      activity('🧹', 'Do a helping job for a grown-up', { chore: true }),
      activity('🧸', 'Tidy your toys away', { chore: true, time: '17:00' }),
      activity('📺', 'Free choice / screen time', { counts: false, time: '17:30' }),
    ],
  }
  const grandad = {
    id: 'tpl_grandad',
    name: "At Grandad's",
    activities: [
      activity('😄', 'Say a big hello and a hug'),
      activity('📚', 'Read a story together'),
      activity('🌳', 'Go outside for an adventure'),
      activity('🤝', 'Help with a little job'),
      activity('📺', 'Free choice / screen time', { counts: false }),
    ],
  }
  const sports = {
    id: 'tpl_sports',
    name: 'Sports club',
    activities: [
      activity('🎒', 'Pack your kit and water bottle', { chore: true }),
      activity('🏃', 'Try your best and have fun'),
      activity('🧼', 'Bring your kit home to wash', { chore: true }),
    ],
  }
  const summerClub = {
    id: 'tpl_summer',
    name: 'Summer club',
    activities: [
      activity('🎒', 'Pack your bag', { chore: true }),
      activity('🎉', 'Join in and make a friend'),
      activity('🗣️', 'Tell us one thing you did'),
    ],
  }
  const away = {
    id: 'tpl_away',
    name: 'Away / day off',
    activities: [
      activity('🧳', 'Enjoy your trip!', { counts: false }),
    ],
  }
  return [home, grandad, sports, summerClub, away]
}

export function defaultLocations() {
  return [
    { id: 'loc_home', name: 'Home', icon: '🏠', templateId: 'tpl_home', earns: true },
    { id: 'loc_grandad', name: "Grandad's", icon: '👴', templateId: 'tpl_grandad', earns: true },
    { id: 'loc_sports', name: 'Sports club', icon: '⚽', templateId: 'tpl_sports', earns: true },
    { id: 'loc_summer', name: 'Summer club', icon: '🎪', templateId: 'tpl_summer', earns: true },
    { id: 'loc_away', name: 'Away', icon: '🧳', templateId: 'tpl_away', earns: false },
  ]
}

export function defaultBonusJobs() {
  return [
    { id: 'job_dishwasher', icon: '🍽️', title: 'Empty the dishwasher', amount: 0.5 },
    { id: 'job_pet', icon: '🐾', title: 'Feed the pet', amount: 0.2 },
    { id: 'job_weeds', icon: '🌱', title: 'Pull some weeds', amount: 0.5 },
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
      holidayStartKey: weekKeyOf(created), // Monday of the current week
      holidayWeeks: 7,
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
