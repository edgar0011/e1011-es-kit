import { Options, Placement } from '@popperjs/core'
import { ReactNode, ReactElement, ComponentType, RefObject } from 'react'


export type PopoverProps = Record<string, unknown> & {
  children?: ReactNode | ReactElement<unknown> | ReactNode[] | ReactElement<any>[] | ((props: unknown) => ReactNode)
  components?: {
    ContentComponent?: ComponentType<unknown>
  }
  targetRef?: RefObject<HTMLDivElement> | null
  placement?: Placement
  modifiers?: Options['modifiers']
  data?: unknown
  hoverable?: boolean
  clickable?: boolean
  onOpen?: () => void
  onHide?: () => void
  isOpen?: boolean
  hideOnContentClick?: boolean
  hideOnClickOutside?: boolean
  hideTimeout?: number
  isPopup?: boolean
  isModal?: boolean
  modalOverlayClassName?: string
  modalContainer?: HTMLElement | null
  hideOnEscape?: boolean
}

export enum PopoverPlacement {
  Right = 'right',
  RightStart = 'right-start',
  RightEnd = 'right-end',
  Left = 'left',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
  Top = 'top',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  Bottom = 'bottom',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  Auto = 'auto',
  AutoStart = 'auto-start',
  AutoEnd = 'auto-end',
}
