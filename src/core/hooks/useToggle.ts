import { useState, useCallback } from 'react'


export type useTogggleReturnType = [
  boolean,
  (value?: any | boolean) => void,
  (value?: any | boolean) => void,
  (value?: any | boolean) => void
]

export const useToggle = (defaultValue: boolean, async = true): useTogggleReturnType => {
  const [toggled, setToggled] = useState(defaultValue)

  const handleToggle: (value?: any | boolean) => void = useCallback((value?: any | boolean) => {
    if (async) {
      setToggled((prevToggled) => (typeof (value) === 'boolean' ? value : !prevToggled))
    } else {
      setToggled((value !== undefined && value !== null ? value : !toggled))
    }
  }, [async, toggled, setToggled])

  const handleToggleTrue = useCallback(
    (forceValue?: boolean) => handleToggle(forceValue === undefined ? true : forceValue), [handleToggle],
  )

  const handleToggleFalse = useCallback(
    (forceValue?: boolean) => handleToggle(forceValue === undefined ? false : forceValue), [handleToggle],
  )

  return [toggled, handleToggle, handleToggleTrue, handleToggleFalse]
}
