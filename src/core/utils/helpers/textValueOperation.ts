import {
  toLower, toUpper,
} from 'ramda'

// todo memoize
export const toLowerCase = (str: string | number): string | number => (str ? toLower(str as string) as string : '')

// todo memoize
export const toUpperCase = (str: string): string => (str ? toUpper(str) as string : '')

// todo memoize
export const removeWhitespaces = (str: string | number): string | number => (str ? str.toString()
  .replace(/ /g, '') as string : '')

// eslint-disable-next-line no-bitwise
export const fileNameExt = (fileName: string): string => fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)

export const normalizeString = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const findStringInText = (str: string, text: string, ci = true, norm = true): boolean => {
  if (!text || !str || !text.trim() || !str.trim()) {
    return false
  }

  if (ci && norm) {
    return normalizeString(text.toLowerCase()).includes(normalizeString(str.toLowerCase()))
  }

  if (ci) {
    return text.toLowerCase().includes(str.toLowerCase())
  }

  if (norm) {
    return normalizeString(text).includes(normalizeString(str))
  }

  return text.includes(str)
}
