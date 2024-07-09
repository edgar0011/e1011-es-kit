import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
}

/**
 * Type definition for the parameters used in the `useIntersectionObserver` hook.
 * @typedef {Object} UseIntersectionObserverType
 * @property {() => void} callback - Function to be called when the element intersects.
 * @property {() => void} [notIntersectingCallback] - Optional function to be called
 * when the element is not intersecting.
 * @property {Partial<{ root: HTMLElement | null; rootMargin: string; threshold: number }>} [options] -
 * Optional IntersectionObserver options.
 * @property {boolean} [granular] - Flag to determine if each entry should be checked individually.
 */
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

/**
 * Default handler for intersection changes.
 * @param {IntersectionObserverEntry[]} entries - Array of intersection observer entries.
 * @param {() => void} callback - Function to be called when the element intersects.
 * @param {() => void} [notIntersectingCallback] - Optional function to be called when the element is not intersecting.
 * @param {boolean} [granular=false] - Flag to determine if each entry should be checked individually.
 */
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

/**
 * Custom hook to observe the intersection of an element.
 * @param {UseIntersectionObserverType} params - The parameters for the intersection observer.
 * @returns {MutableRefObject<T | null>} Ref object for the observed element.
 */
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
