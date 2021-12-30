import { TFunction } from 'i18next'

export const createSafeT = (t: TFunction) => ((key: string | undefined, params?: Record<string, any>): string => {
  if (!key) {
    return ''
  }
  const limits = key.split(' ')
  if (limits.length === 2) {
    return t(limits[0], { ...params, limit: limits[1] })
  }
  return t(key, params)
})
