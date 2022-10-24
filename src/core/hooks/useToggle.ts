import { useState, useCallback } from 'react'

export const useToggle = (defaultValue: boolean, async = true): [boolean, (value?: any | boolean) => void] => {
  const [toggled, setToggled] = useState(defaultValue)

  const handleToggle: (value?: any | boolean) => void = useCallback((value?: any | boolean) => {
    if (async) {
      setToggled((prevToggled) => (typeof (value) === 'boolean' ? value : !prevToggled))
    } else {
      setToggled((value !== undefined && value !== null ? value : !toggled))
    }
  }, [async, toggled, setToggled])

  return [toggled, handleToggle]
}
