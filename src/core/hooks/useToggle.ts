import { useState, useCallback } from 'react'

/**
 * Type definition for the return value of the `useToggle` hook.
 * @typedef {Array} useToggleReturnType
 * @property {boolean} 0 - The current toggled state.
 * @property {(value?: any | boolean) => void} 1 - Function to toggle the state.
 * @property {(value?: any | boolean) => void} 2 - Function to forcefully set the state to true.
 * @property {(value?: any | boolean) => void} 3 - Function to forcefully set the state to false.
 */
export type useToggleReturnType = [
  boolean,
  (value?: any | boolean) => void,
  (value?: any | boolean) => void,
  (value?: any | boolean) => void
]

/**
 * Custom hook to manage a boolean state with toggle functionality.
 * @param {boolean} defaultValue - The initial value of the toggled state.
 * @param {boolean} [async=true] - Flag to determine if the toggle should be asynchronous.
 * @returns {useToggleReturnType} An array containing the current state, a toggle function,
 * and functions to set the state to true or false.
 */
export const useToggle = (defaultValue: boolean, async = true): useToggleReturnType => {
  const [toggled, setToggled] = useState(defaultValue)

  /**
   * Function to toggle the state.
   * @param {any | boolean} [value] - Optional value to set the state. If not provided, the state will be toggled.
   */
  const handleToggle: (value?: any | boolean) => void = useCallback((value?: any | boolean) => {
    if (async) {
      setToggled((prevToggled) => (typeof (value) === 'boolean' ? value : !prevToggled))
    } else {
      setToggled((value !== undefined && value !== null ? value : !toggled))
    }
  }, [async, toggled, setToggled])

  /**
   * Function to set the state to true.
   * @param {boolean} [forceValue] - Optional value to forcefully set the state.
   * If not provided, the state will be set to true.
   */
  const handleToggleTrue = useCallback(
    (forceValue?: boolean) => handleToggle(forceValue === undefined ? true : forceValue), [handleToggle],
  )

  /**
   * Function to set the state to false.
   * @param {boolean} [forceValue] - Optional value to forcefully set the state.
   * If not provided, the state will be set to false.
   */
  const handleToggleFalse = useCallback(
    (forceValue?: boolean) => handleToggle(forceValue === undefined ? false : forceValue), [handleToggle],
  )

  return [toggled, handleToggle, handleToggleTrue, handleToggleFalse]
}
