import { useEffect, useCallback } from 'react'

import { EventName } from '../constants/ui.constants'
import { handleClickOutside as defaultHandleClickOutside } from '../ui/utils/clickOutside'

type Element = HTMLElement | null | (() => HTMLElement)
type CallbackFunction = (target: HTMLElement | null) => void

/**
 * Custom hook to handle clicks outside a specified element.
 * @param {Element} element - The element to detect outside clicks for.
 * @param {CallbackFunction} [callback] - Optional callback function to execute when an outside click is detected.
 * @param {Function} [handleClickOutside=defaultHandleClickOutside] - Optional custom function to handle outside clicks.
 * @returns {() => void} Function to unsubscribe the event listener.
 */
export function useOutsideClick(
  element: Element,
  callback?: CallbackFunction,
  handleClickOutside = defaultHandleClickOutside(element, callback),
): () => void {
  const unsubscriber = useCallback(
    () => document.removeEventListener(EventName.Click, handleClickOutside), [handleClickOutside],
  )

  useEffect(() => {
    unsubscriber()
    document.addEventListener(EventName.Click, handleClickOutside)

    return unsubscriber
  }, [element, handleClickOutside, unsubscriber])

  return unsubscriber
}

/**
 * Function to handle clicks outside a specified element.
 * @param {Element} element - The element to detect outside clicks for.
 * @param {CallbackFunction} [callback] - Optional callback function to execute when an outside click is detected.
 * @param {Function} [handleClickOutside=defaultHandleClickOutside] - Optional custom function to handle outside clicks.
 * @returns {() => void} Function to unsubscribe the event listener.
 */
export function outsideClickHandler(
  element: Element,
  callback?: CallbackFunction,
  handleClickOutside = defaultHandleClickOutside(element, callback),
): () => void {
  const unsubscriber = (): void => document.removeEventListener(EventName.Click, handleClickOutside)

  document.addEventListener(EventName.Click, handleClickOutside)

  return unsubscriber
}
