import { useCallback, useEffect, useRef } from 'react'

export type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

type CallBackType = (...args: unknown[]) => unknown

type LocalStateType = {
  ready: boolean | null
  timeout: ReturnType<typeof setTimeout> | null
  callback: CallBackType
}

export const useTimeoutFn = (fn: CallBackType, ms: number = 0): UseTimeoutFnReturn => {
  const store = useRef<LocalStateType>({
    ready: null,
    timeout: null,
    callback: fn,
  })

  const isReady = useCallback(() => store.current.ready, [])

  const clear = useCallback(() => {
    store.current.ready = null
    store.current.timeout && clearTimeout(store.current.timeout)
  }, [])

  const set = useCallback(() => {
    store.current.ready = false
    store.current.timeout && clearTimeout(store.current.timeout)

    store.current.timeout = setTimeout(() => {
      store.current.ready = true
      store.current.callback()
    }, ms)
  }, [ms])

  // update ref when function changes
  useEffect(() => {
    store.current.callback = fn
  }, [fn])

  // set on mount, clear on unmount
  useEffect(() => {
    set()

    return clear
  }, [clear, ms, set])

  return [isReady, clear, set]
}
