import { useMemo } from 'react'

import { classNames, TClassName } from '../utils/helpers/ui'


/**
 * Custom hook to memoize class names.
 * @param {TClassName[]} classes - Array of class names or conditions to be applied.
 * @param {unknown[]} deps - Dependencies array for the `useMemo` hook.
 * @returns {ReturnType<typeof classNames>} The computed class names as a string.
 */
export const useClassNames = (
  classes: TClassName[],
  deps: unknown[],
// eslint-disable-next-line react-hooks/exhaustive-deps
): ReturnType<typeof classNames> => useMemo(() => classNames(...classes), [classes, deps])
