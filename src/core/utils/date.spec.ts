import dayjs from 'dayjs'

import { getDateTime, getTimeFromNow, getTimeTo } from './date'

describe('getDateTime', () => {
  it('should format date/time', () => {
    let dateString
    dateString = getDateTime({ value: '01/20/2019', valueFormat: 'MM/DD/YYYY', formatString: 'DD/MM/YYYY' })
    console.log(dateString)
    expect(dateString).toEqual('20/01/2019')

    dateString = getDateTime({ value: '20/20/2019', valueFormat: 'DD.MM.YYYY', formatString: 'DD.MM.YYYY' })
    console.log(dateString)
    expect(dateString).toEqual('20.08.2020')

    dateString = getDateTime({ value: '12:12 12/05/1988', valueFormat: 'hh:mm DD.MM.YYYY', formatString: 'DD.MM.YYYY' })
    console.log(dateString)
    expect(dateString).toEqual('12.05.1988')

    dateString = getDateTime({
      value: '12:12 12/05/1988', valueFormat: 'hh:mm DD.MM.YYYY', formatString: 'hh-mm DD/MM/YYYY' })
    console.log(dateString)
    expect(dateString).toEqual('12-12 12/05/1988')

    const today = new Date()
    dateString = getDateTime({ value: today, formatString: 'HH-mm DD.MM.YYYY' })
    console.log('dateString', dateString)

    const hours = String(today.getHours()).padStart(2, '0')
    const minutes = String(today.getMinutes()).padStart(2, '0')
    const date = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    const expectedFormattedDate
      = `${hours}-${minutes} ${date}.${month}.${year}`

    console.log('expectedFormattedDate')
    console.log(expectedFormattedDate)

    expect(dateString).toEqual(expectedFormattedDate)
  })

  it('should format date/time from now', () => {
    let dateString = getTimeFromNow(new Date(Date.now() - 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('nyní')

    dateString = getTimeFromNow(new Date(Date.now() - 60 * 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('1 hodinu')

    dateString = getTimeFromNow(new Date(Date.now() - 12 * 60 * 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('12 hodiny')

    dateString = getTimeFromNow(new Date(Date.now() - 24 * 60 * 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('den')

    dateString = getTimeFromNow(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('2 dny')
  })

  it('should format date/time to now', () => {
    let dateString
    dateString = getTimeTo(new Date(Date.now() + 60 * 1000), { language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('nyní')

    dateString = getTimeTo(new Date(Date.now() + 60 * 60 * 1000), { showPreffix: true, language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('za 1 hodinu')

    dateString = getTimeTo(new Date(Date.now() + 12 * 60 * 60 * 1000), { showPreffix: true, language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('za 12 hodiny')

    dateString = getTimeTo(new Date(Date.now() + 24 * 60 * 60 * 1000), { showPreffix: true, language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('za den')

    dateString = getTimeTo(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), { showPreffix: true, language: 'cz' })
    console.log(dateString)
    expect(dateString).toEqual('za 2 dny')

    let when = dayjs('1:36', 'HH:mm').add(1, 'day').toDate()
    dateString = getTimeTo(when)
    let dateString2 = getTimeTo('1:36', { valueFormat: 'HH:mm', shouldAddDay: true })
    console.log('when', when)
    console.log('dateString', dateString)
    console.log('dateString2', dateString2)

    expect(dateString).toEqual(dateString2)

    when = dayjs('14:36', 'HH:mm').add(1, 'day').toDate()
    dateString = getTimeTo(when)
    dateString2 = getTimeTo('14:36', { valueFormat: 'HH:mm', shouldAddDay: true })
    console.log('when', when)
    console.log('dateString', dateString)
    console.log('dateString2', dateString2)

    expect(dateString).toEqual(dateString2)
  })
})
