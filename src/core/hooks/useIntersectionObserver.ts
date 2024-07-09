import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
}

export type UseIntersectionObserverType = {
  callback: () => void
  notIntersectingCallback?: () => void
  options?: Partial<{
    root: HTMLElement | null
    rootMargin: string
    threshold: number
  }>
  granular?: boolean
}

const defaultIntersectionHandler = (
  entries: IntersectionObserverEntry[],
  callback: UseIntersectionObserverType['callback'],
  notIntersectingCallback: UseIntersectionObserverType['notIntersectingCallback'],
  granular = false,
): void => {
  if (granular) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
      } else {
        notIntersectingCallback?.()
      }
    })
  } else {
    // eslint-disable-next-line no-lonely-if
    if (entries[0].isIntersecting) {
      callback()
    } else {
      notIntersectingCallback?.()
    }
  }
}


export const useIntersectionObserver = <T extends Element = Element>({
  callback, notIntersectingCallback, options = {}, granular,
}: UseIntersectionObserverType): MutableRefObject<T | null> => {
  const elementRef = useRef<T | null>(null)

  const observerRef = useRef<IntersectionObserver>()

  // entries: IntersectionObserverEntry[], observer: IntersectionObserver)
  const intersectionHandler = useCallback((entries: IntersectionObserverEntry[]) => {
    defaultIntersectionHandler(entries, callback, notIntersectingCallback, granular)
  }, [callback, granular, notIntersectingCallback])

  useEffect(() => {
    observerRef.current?.disconnect()

    const observeElement = elementRef.current

    observerRef.current = new IntersectionObserver(intersectionHandler, { ...defaultOptions, ...options })

    if (observeElement) {
      observerRef.current.observe(observeElement)
    }

    return (): void => {
      observerRef.current?.disconnect()
    }
  }, [intersectionHandler, options])


  return elementRef
}
