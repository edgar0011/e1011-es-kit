// eslint-disable-next-line import/no-mutable-exports
export let defaultFontSize = 16
export const setDefaultFontSize = (fontSize: number): void => {
  defaultFontSize = fontSize
}

export const pxToRem = (px: number): number => px / defaultFontSize

export const resolveStyleValue = (
  value: string | number,
  units = 'rem',
): string => {
  if (typeof value === 'string') {
    return value as string
  }

  if (units === 'px') {
    return `${pxToRem(value)}rem`
  }

  return `${value}${units}`
}

/* eslint-disable no-param-reassign */
export const toHex = (x: number | string): string => {
  x = x.toString(16)
  return x.padStart(2, '0')
}

export const convertHex = (hex: string, opacity: number, rgba = false): string => {
  const hexValue = hex.replace('#', '')
  const rValue = hexValue.substring(0, 2)
  const gValue = hexValue.substring(2, 4)
  const bValue = hexValue.substring(4, 6)
  const r = parseInt(rValue, 16)
  const g = parseInt(gValue, 16)
  const b = parseInt(bValue, 16)

  const a = opacity <= 1 ? opacity : (opacity / 100)

  return (rgba
    ? `rgba(${r},${g},${b},${a})`
    : `#${rValue}${gValue}${bValue}${toHex(Math.round((opacity <= 1 ? opacity : (opacity / 100)) * 255))}`)
    .toLowerCase()
}

export const convertRGB = (
  r: number, g: number, b: number, opacity: number,
): string => `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round((opacity <= 1 ? opacity : (opacity / 100)) * 255))}`

export const calculatePercColor = (startColor: string, endColor: string, ratio = 0.5): string => {
  if (startColor.indexOf('#') === 0) {
    startColor = startColor.substr(1)
  }
  if (endColor.indexOf('#') === 0) {
    endColor = endColor.substr(1)
  }

  const r = Math.ceil(parseInt(endColor.substring(0, 2), 16) * ratio
    + parseInt(startColor.substring(0, 2), 16) * (1 - ratio))
  const g = Math.ceil(parseInt(endColor.substring(2, 4), 16) * ratio
    + parseInt(startColor.substring(2, 4), 16) * (1 - ratio))
  const b = Math.ceil(parseInt(endColor.substring(4, 6), 16) * ratio
    + parseInt(startColor.substring(4, 6), 16) * (1 - ratio))

  return `#${toHex(r) + toHex(g) + toHex(b)}`
}

export const calculateColors = (startColor: string, endColor: string, num = 10): string[] => {
  const ratioIterator = (num / (num + 1)) / num
  const ratios = []
  let ratio = ratioIterator

  // eslint-disable-next-line no-plusplus
  while (num--) {
    ratios.push(ratio)
    ratio += ratioIterator
  }

  return ratios.map((rat) => calculatePercColor(startColor, endColor, rat))
}
