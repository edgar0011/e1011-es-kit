import { PropsWithChildren, MouseEvent, KeyboardEvent, CSSProperties, ReactNode } from 'react'

import { Alerts } from '../../../../constants'
import { CommonProps } from '../../../types/CommonProps'
import { IconBaseProps } from '../../icon'


export type ButtonProps = PropsWithChildren & {
  id?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  className?: string
  style?: CSSProperties
  tiny?: boolean
  variant?: Alerts | 'link' | string
  label?: string | number
  truncate?: boolean
  fluid?: boolean
  animated?: boolean
  transparent?: boolean
  hasShadow?: boolean
  hasIcon?: boolean
  preventDefualt?: boolean
  stopPropagation?: boolean
  disabled?: boolean
  onClick?: (event: MouseEvent | KeyboardEvent) => void
  href?: string
  target?: string
} & CommonProps


export type IconButtonProps = ButtonProps & IconBaseProps
 & {
  iconContent?: ReactNode
 }
