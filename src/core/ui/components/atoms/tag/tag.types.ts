import { PropsWithChildren, FC, MouseEvent } from 'react'

import { TextAndIconsProps } from '../textAndContent/textAndContent.types'
import { LayoutBoxProps } from '../../container/layoutBox/layoutBox.types'
import { CommonProps } from '../../../types/CommonProps'
import { TextProps } from '../text/text.types'


export enum TagVariant {
  info = 'info',
  veryLow = 'very-low',
  low = 'low',
  medium = 'medium',
  high = 'high',
  critical = 'critical',
  information = 'information',
  success = 'success',
  alert = 'alert',
  error = 'error',
  warning = 'warning',
  default = 'default'
}

export type TagProps = PropsWithChildren & CommonProps & TextAndIconsProps & LayoutBoxProps & {
  variant?: TagVariant
  text?: string
  hashtag?: boolean
  inTable?: boolean
  components?: {
    TextComponent?: FC<TextProps>
  }
  onClick?: (event?: MouseEvent) => void
  className?: string
}
