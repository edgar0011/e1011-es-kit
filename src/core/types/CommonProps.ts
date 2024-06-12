import { Ref, RefObject } from 'react'

export type CommonProps = {
  id?: string
  'data-testid'?: string
  dataTestId?: string
  className?: string
}


export type ForwardedRefContainer = {
  forwardedRef?: RefObject<HTMLDivElement> | Ref<HTMLDivElement> | null
}
