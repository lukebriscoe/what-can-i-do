import {
  format,
  parseISO,
  startOfWeek,
  addDays as fnsAddDays,
  differenceInCalendarWeeks,
  isSameDay,
} from 'date-fns'

// We treat the UK school week as Monday-first.
const WEEK_OPTS = { weekStartsOn: 1 }

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** 'yyyy-MM-dd' key for a Date (defaults to now). */
export function dateKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd')
}

export function todayKey() {
  return dateKey(new Date())
}

export function parseKey(key) {
  return parseISO(key)
}

/** Monday index for a day key: Mon=0 … Sun=6. */
export function mondayIndex(key) {
  const js = parseKey(key).getDay() // Sun=0 … Sat=6
  return (js + 6) % 7
}

/** The Monday 'yyyy-MM-dd' key of the week that `key` falls in. */
export function weekKeyOf(key) {
  return dateKey(startOfWeek(parseKey(key), WEEK_OPTS))
}

export function addDays(key, n) {
  return dateKey(fnsAddDays(parseKey(key), n))
}

/** The 7 day keys (Mon→Sun) for the week containing `key`. */
export function weekWindowKeys(key) {
  const monday = weekKeyOf(key)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/** Which holiday week (1-based) a day falls in, given the holiday start key. */
export function holidayWeekNumber(startKey, key) {
  if (!startKey) return 1
  return (
    differenceInCalendarWeeks(parseKey(key), parseKey(startKey), WEEK_OPTS) + 1
  )
}

export function isToday(key) {
  return isSameDay(parseKey(key), new Date())
}

export function niceDay(key) {
  return format(parseKey(key), 'EEEE')
}

export function niceDate(key) {
  return format(parseKey(key), 'EEEE d MMMM')
}

export function greetingForNow(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
