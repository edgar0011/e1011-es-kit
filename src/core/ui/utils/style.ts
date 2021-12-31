let defaultFontSize = 16
export const setDefaultFontSize = (fontSize: number) => {
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
