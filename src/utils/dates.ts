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

export const RESET_HOURS = 19

export const getLastResetDate = () => {
  const date = new Date()

  const isResetHoursPassed = date.getHours() > RESET_HOURS
  date.setHours(RESET_HOURS, 0, 0, 0)

  return isResetHoursPassed ? date : sub(date, { days: 1 })
}

export const getPreviousResetDate = () => {
  const date = new Date()

  const isResetHoursPassed = date.getHours() > RESET_HOURS
  date.setHours(RESET_HOURS, 0, 0, 0)

  return isResetHoursPassed ? sub(date, { days: 1 }) : sub(date, { days: 2 })
}

export const getNextResetDate = () => {
  const date = new Date()

  const isResetHoursPassed = date.getHours() > RESET_HOURS
  date.setHours(RESET_HOURS, 0, 0, 0)

  return isResetHoursPassed ? add(date, { days: 1 }) : date
}

export default {
  getAge,
  getDateYearsAgo,
  getDateRanges,
}
