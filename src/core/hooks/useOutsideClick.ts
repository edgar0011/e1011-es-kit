import { useEffect } from 'react'

import { EventName } from '../constants/ui.constants'
import { handleClickOutside as defaultHandleClickOutside } from '../ui/utils/clickOutside'

type Element = HTMLElement | null | (() => HTMLElement)
type CallbackFunction = (target: HTMLElement | null) => void

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
