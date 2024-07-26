import { PeregrineMQ } from './peregrineMQ'

export { PeregrineMQ, PeregrineMQClearError } from './peregrineMQ'

export const peregrineMQInstance = new PeregrineMQ()

export type * from './peregrineMQ.types'
export * from './usePeregrineMQ.react'
