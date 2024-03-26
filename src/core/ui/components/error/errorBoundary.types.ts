import { ComponentType, PropsWithChildren } from 'react'

export type ErrorBoundaryProps = PropsWithChildren & {
  title?: string
  text?: string
  ErrorComponent?: ComponentType
}

export type DefaultErrorComponentProps = {
  title?: string
  text?: string
}
