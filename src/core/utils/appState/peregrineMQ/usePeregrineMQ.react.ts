import { useCallback, useEffect, useRef } from 'react'

import { PeregrineMQ } from './peregrineMQ'
import { Callback } from './peregrineMQ.types'

export type usePeregrineMQReturnType = [
  { current?: () => boolean },
  <T>(channel: string, data?: T) => boolean
]

export const usePeregrineMQ = (
  peregrineInstance: PeregrineMQ, channel: string, callback: Callback,
): usePeregrineMQReturnType => {
  const memCallback = useCallback(callback, [callback])

  const unsubscribeRef = useRef<ReturnType<typeof peregrineInstance.subscribe>>()

  useEffect(() => {
    unsubscribeRef.current = peregrineInstance.subscribe(channel, memCallback)

    return (): void => {
      unsubscribeRef?.current?.()
    }
  }, [memCallback, channel, peregrineInstance])

  return [unsubscribeRef, peregrineInstance.publish]
}
