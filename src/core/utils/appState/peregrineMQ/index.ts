import { PeregrineMQ } from './peregrineMQ'

export { PeregrineMQ, PeregrineMQClearError } from './peregrineMQ'

export const peregrineMQInstance = new PeregrineMQ()

export default peregrineMQInstance


export type * from './peregrineMQ.types'
export type * from './usePeregrineMQ.react'
