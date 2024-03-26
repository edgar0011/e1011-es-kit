import { PropsWithChildren } from 'react'

import { LayoutBoxProps } from '../container/layoutBox/layoutBox.types'

export type ErrorBoundaryProps = LayoutBoxProps & PropsWithChildren & {
  title?: string
  text?: string
}
