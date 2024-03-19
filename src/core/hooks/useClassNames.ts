import { useMemo } from 'react'

import { classNames, TClassName } from '../utils/helpers/ui'

export const useClassNames = (
  classes: TClassName[],
  deps: unknown[],
// eslint-disable-next-line react-hooks/exhaustive-deps
): ReturnType<typeof classNames> => useMemo(() => classNames(...classes), [classes, deps])
