import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import customParseFormat from 'dayjs/plugin/customParseFormat'

export type DateTimeFormat = {
  value: Date | string | number
  valueFormat?: string
  formatString?: string
  language?: string
  relativeTime?: Record<string, string>
  from?: boolean
  to?: boolean
  shouldSubtractDay?: boolean
  shouldAddDay?: boolean
  showPreffix?: boolean
}

const relativeTimeConfig = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
}

const relativeTimeEN = {
  future: 'in %s',
  past: '%s ago',
  s: 'now',
  m: 'now',
  mm: 'now',
  h: '1 hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days', // probably 'a week' instead?
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
}

const relativeTimeCZ = {
  future: 'za %s',
  past: '%s před',
  s: 'nyní',
  m: 'nyní',
  mm: 'nyní',
  h: '1 hodinu',
  hh: '%d hodiny',
  d: 'den',
  dd: '%d dny',
  M: 'měsíc',
  MM: '%d měsíci',
  y: 'rok',
  yy: '%d roky',
}

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime, relativeTimeConfig)
dayjs.extend(updateLocale)

dayjs.updateLocale('cz', {
  relativeTime: {
    ...relativeTimeCZ,
  },
})
dayjs.updateLocale('en', {
  relativeTime: {
    ...relativeTimeEN,
  },
})

export const getTimeFromNowOriginal = (value: string, language: string): string => {
  dayjs.updateLocale('en', {
    relativeTime: {
      ...(language === 'cz' ? relativeTimeCZ : relativeTimeEN),
      ...relativeTime,
    },
  })
  return dayjs(value, undefined).fromNow(true)
}

export const getTimeFromNow = (
  value: Date | string | number,
  valueFormat?: Partial<DateTimeFormat>,
): string => getDateTime({ ...valueFormat, from: true, value })

export const getTimeTo = (
  value: Date | string | number,
  valueFormat?: Partial<DateTimeFormat>,
): string => getDateTime({ ...valueFormat, to: true, value })

export const getDateTime = ({
  value,
  valueFormat,
  formatString,
  language = 'en',
  relativeTime,
  from,
  to,
  shouldAddDay = false,
  shouldSubtractDay = false,
  showPreffix = false,
}: DateTimeFormat): string => {
  dayjs.updateLocale('en', {
    relativeTime: {
      ...(language === 'cz' ? relativeTimeCZ : relativeTimeEN),
      ...relativeTime,
    },
  })

  dayjs.locale(language)

  if (!from && to) {
    const dateTo = dayjs(value, valueFormat || undefined).add(shouldAddDay ? 1 : 0, 'day')

    return dayjs(new Date()).locale(language).to(dateTo, !showPreffix)
  }

  if (from && !to) {
    const dateTo = dayjs(value, valueFormat || undefined).subtract(shouldSubtractDay ? 1 : 0, 'day')

    return dayjs(dateTo, valueFormat || undefined).locale(language).fromNow(!showPreffix)
  }

  return dayjs(value, valueFormat || undefined).locale(language).format(formatString)
}
