import { ComponentType, PropsWithChildren } from 'react'

export type ErrorBoundaryProps = PropsWithChildren & {
  title?: string
  text?: string
  muted?: boolean
  onError?: (payload: { error?: unknown; errorInfo?: unknown }) => void
  ErrorComponent?: ComponentType
}

export type DefaultErrorComponentProps = {
  title?: string
  text?: string
}
