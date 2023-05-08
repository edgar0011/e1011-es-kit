import { useMemo } from 'react'

import { parseProps } from '../utils/helpers/ui'


export const useParseProps = (props: Record<string, unknown>): ReturnType<typeof parseProps> => {
  const propsCategories = useMemo(() => parseProps(props), [props])

  return propsCategories
}
