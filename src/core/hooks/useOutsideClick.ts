import { useEffect } from 'react'

import { EventName } from '../constants/ui.constants'
import { handleClickOutside as defaultHandleClickOutside } from '../ui/utils/clickOutside'

type Element = HTMLElement | null | (() => HTMLElement)
type CallbackFunction = (target: HTMLElement | null) => void

export const defaultHandleClickOutside = (
  element: Element,
  callback?: CallbackFunction,
) => (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const resolvedElement:HTMLElement | null = typeof element === 'function' ? element() : element

  if (resolvedElement && !resolvedElement.contains(target)) {
    callback?.(target)
  }
}

export function useOutsideClick(
  element: Element,
  callback?: CallbackFunction,
  handleClickOutside = defaultHandleClickOutside(element, callback),
): void {
  useEffect(() => {
    document.addEventListener(EventName.Click, handleClickOutside)

    return () => {
      document.removeEventListener(EventName.Click, handleClickOutside)
    }
  }, [element, handleClickOutside])
}
