import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

export const getTimeFromNow = (value: string): string => {
  dayjs.updateLocale('en', {
    relativeTime: {
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
    },
  })

  return dayjs(value).fromNow(true)
}
