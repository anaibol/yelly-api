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
      gte: getDateYearsAgo(22),
      lt: getDateYearsAgo(13),
    }

  if (userAge > 18)
    return {
      gte: getDateYearsAgo(22),
      lt: getDateYearsAgo(16),
    }

  return null
}

export default {
  getAge,
  getDateYearsAgo,
  getDateRanges,
}
