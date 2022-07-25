import { differenceInYears, sub } from 'date-fns'

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

export const RESET_HOURS = 11

export const getLastResetDate = () => {
  const date = new Date()

  const currentHours = date.getHours()

  date.setHours(RESET_HOURS)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return currentHours < RESET_HOURS ? sub(date, { days: 1 }) : date
}

export const getPreviousResetDate = () => {
  const date = new Date()

  const currentHours = date.getHours()

  date.setHours(RESET_HOURS)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return sub(date, { days: currentHours < RESET_HOURS ? 1 : 2 })
}

export const getNextResetDate = () => {
  const date = new Date()

  const currentHours = date.getHours()

  date.setHours(RESET_HOURS)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return currentHours < RESET_HOURS ? sub(date, { days: 1 }) : date
}

export default {
  getAge,
  getDateYearsAgo,
  getDateRanges,
}
