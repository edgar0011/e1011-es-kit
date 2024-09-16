import { Ref, RefObject } from 'react'

export type CommonProps = {
  id?: string
  'data-testid'?: string
  dataTestId?: string
  className?: string
  // TODO investigate further, might not be needed here
  [key: PropertyKey]: any
}


export type ForwardedRefContainer = {
  forwardedRef?: RefObject<HTMLDivElement> | Ref<HTMLDivElement> | null
}
