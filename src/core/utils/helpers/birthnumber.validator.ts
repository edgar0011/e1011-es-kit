import {
  parse as parseBirthNumber,
  isValidFormat,
  isValidModulo11,
} from './birthnumberCZSKvalidator'

// TODO Lukas Z, add spec/test for isBirthNumberValid
export const isBirthNumberValid = (birthnumber: string, birthdate: string, gender: string): boolean => {
  if (!isValidFormat(birthnumber) || !isValidModulo11(birthnumber)) {
    return false
  }

  const parsedBirthNumber = parseBirthNumber(birthnumber)

  if (parsedBirthNumber) {
    if (gender !== parsedBirthNumber.gender) {
      return false
    }
    const { year, month, day } = parsedBirthNumber

    if (birthdate !== `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`) {
      return false
    }
  }
  return true
}
