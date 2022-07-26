import { add, differenceInYears, sub } from 'date-fns'

const getAge = (date: string | Date): number => {
  return differenceInYears(new Date(), new Date(date))
}

const getDateYearsAgo = (yearsAgo: number): Date => {
  return sub(new Date(), { years: yearsAgo })
}

const getDateRanges = (userAge: number): { gte: Date; lt: Date } | null => {
  if (userAge < 15)
    return {
      gte: getDateYearsAgo(17),
      lt: getDateYearsAgo(13),
    }

  if (userAge >= 15 && userAge <= 18)
    return {
      gte: getDateYearsAgo(25),
      lt: getDateYearsAgo(13),
    }

  if (userAge > 18)
    return {
      gte: getDateYearsAgo(25),
      lt: getDateYearsAgo(16),
    }

  return null
}

export const RESET_HOURS = 21

const isResetHoursPassed = (): boolean => {
  console.log(new Date().getHours() > RESET_HOURS)
  return new Date().getHours() > RESET_HOURS
}

const getTodayResetDate = () => new Date(new Date().setHours(RESET_HOURS, 0, 0, 0))

export const getLastResetDate = () => {
  const todayResetDate = getTodayResetDate()

  return isResetHoursPassed() ? todayResetDate : sub(todayResetDate, { days: 1 })
}

export const getPreviousResetDate = () => {
  const todayResetDate = getTodayResetDate()

  return isResetHoursPassed() ? sub(todayResetDate, { days: 1 }) : sub(todayResetDate, { days: 2 })
}

export const getNextResetDate = () => {
  const todayResetDate = getTodayResetDate()

  return isResetHoursPassed() ? add(todayResetDate, { days: 1 }) : todayResetDate
}

export default {
  getAge,
  getDateYearsAgo,
  getDateRanges,
}
