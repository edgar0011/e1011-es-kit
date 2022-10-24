export const regex = /^\s*(\d\d)(\d\d)(\d\d)[/]*(\d\d\d)(\d?)\s*$/

export const getMatch: (value: string | number) => null | RegExpMatchArray
  = (value: string | number) => String(value).match(regex)

export const isValidFormat = (value: string | number): boolean => {
  const match = getMatch(value)

  return match !== null && !!match[0] && parse(value) !== null
}

export const isValidModulo11 = (value: string | number): boolean => {
  const validFormat = isValidFormat(value)

  if (!validFormat) {
    return false
  }

  let stringValue: string

  if (typeof value === 'string') {
    stringValue = value.replace('/', '')
  } else {
    stringValue = (value as number).toString()
  }

  if (stringValue.length < 10) {
    return true
  }

  const controlDigit = stringValue.substr(9, 1)
  let mod = parseInt(stringValue.substr(0, 9), 10) % 11

  if (mod === 10) {
    mod = 0
  }

  return parseInt(controlDigit, 10) === mod
}

const monthRange = {
  ranges: [
    // M
    [1, 12, 'M', 0],
    // M
    [21, 32, 'M', 20],
    // F
    [51, 62, 'F', 50],
    // F
    [71, 82, 'F', 70],
  ],
  getRange(monthHint: number) {
    return this.ranges.find(([min, max]) => monthHint >= min && monthHint <= max)
  },
  getGender(monthHint: number) {
    const range = this.getRange(monthHint)

    return range ? range[2] as string : null
  },
  getMonth(monthHint: number) {
    const range = this.getRange(monthHint)

    return String(range ? monthHint - (range[3] as number) : null).padStart(2, '0')
  },
}

type ParsedBirthNumber = {
  day: string | number | null
  month: string | number | null
  year: string | number | null
  gender: string | null
}

export const parse = (value: string | number | undefined): ParsedBirthNumber | null => {
  if (!value) {
    return null
  }
  const match = getMatch(value)

  if (!match) {
    return null
  }

  const controlDigit = match[5]

  let year = parseInt(match[1], 10)

  // eslint-disable-next-line no-nested-ternary
  year += controlDigit === '' ? (year < 54 ? 1900 : 1800) : (year < 54 ? 2000 : 1900)
  const monthHint = parseInt(match[2], 10)
  const month = monthRange.getMonth(monthHint)
  const gender = monthRange.getGender(monthHint)
  const day = String(parseInt(match[3], 10)).padStart(2, '0')

  // console.log('year-month-day')
  // console.log(`${year}-${month}-${day}`)

  const date = new Date(`${year}-${month}-${day}`)

  if (date instanceof Date && !Number.isNaN(date) && date.getMonth() + 1 === parseInt(month, 10)) {
    return {
      day,
      month,
      year,
      gender,
    }
  }
  return null
}

// TODO, control digit and year control
/*
  if ($c === '') {
      $year += $year < 54 ? 1900 : 1800;
    } else {
      // kontrolní číslice
      $mod = ($year . $month . $day . $ext) % 11;
      if ($mod === 10) $mod = 0;
      if ($mod !== (int) $c) {
        return false;
      }

      $year += $year < 54 ? 2000 : 1900;
    }
*/
