
import { FC, MouseEvent, PropsWithChildren, ReactElement, ReactNode } from 'react'

import { TextProps } from '../text/text.types'
import { LayoutBoxProps } from '../../container/layoutBox/layoutBox.types'


export type TextAndContentProps = LayoutBoxProps & PropsWithChildren & {
  text?: string
  className?: string
  components?: {
    TextComponent?: FC<TextProps>
  }
  leftContent?: ReactElement
  rightContent?: ReactElement
  textProps?: Partial<TextProps>
}


export type TextAndIconsProps = TextAndContentProps & {
  iconSize?: string
  iconColor?: string
  iconLeftUrl?: string
  iconRightUrl?: string
  iconRight?: ReactNode
  iconLeft?: ReactNode
  onLeftIconClick?: (event: MouseEvent | KeyboardEvent) => void
  onRightIconClick?: (event: MouseEvent | KeyboardEvent) => void
}
