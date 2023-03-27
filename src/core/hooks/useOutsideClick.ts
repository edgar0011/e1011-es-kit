import { useEffect, useCallback } from 'react'

import { EventName } from '../constants/ui.constants'
import { handleClickOutside as defaultHandleClickOutside } from '../ui/utils/clickOutside'

type Element = HTMLElement | null | (() => HTMLElement)
type CallbackFunction = (target: HTMLElement | null) => void

export function useOutsideClick(
  element: Element,
  callback?: CallbackFunction,
  handleClickOutside = defaultHandleClickOutside(element, callback),
): () => void {
  const unsubscriber = useCallback(() => document.removeEventListener(EventName.Click, handleClickOutside), [])

  useEffect(() => {
    unsubscriber()
    document.addEventListener(EventName.Click, handleClickOutside)

    return unsubscriber
  }, [element, handleClickOutside, unsubscriber])

  return unsubscriber
}

export function outsideClickHandler(
  element: Element,
  callback?: CallbackFunction,
  handleClickOutside = defaultHandleClickOutside(element, callback),
): () => void {
  const unsubscriber = () => document.removeEventListener(EventName.Click, handleClickOutside)

  document.addEventListener(EventName.Click, handleClickOutside)

  return unsubscriber
}
