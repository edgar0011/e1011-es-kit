import { useCallback, useEffect, useRef } from 'react'

import { PeregrineMQ } from './peregrineMQ'
import { Callback, PublishReturnType } from './peregrineMQ.types'

export type usePeregrineMQReturnType = [
  (() => boolean) | undefined,
  <T>(channel: string, data?: T) => PublishReturnType
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

  return [unsubscribeRef.current, peregrineInstance.publish]
}
