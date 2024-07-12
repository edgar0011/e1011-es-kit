

import { PropsWithChildren, CSSProperties, FC, MouseEventHandler } from 'react'

import { CommonProps } from '../../../../types/CommonProps'


export interface ITextProps extends PropsWithChildren, CSSProperties, CommonProps {
  element?: string | FC
  className?: string
  text?: string
  href?: string
  target?: string
  onClick?: MouseEventHandler
  disabled?: boolean
}

export type TextProps = ITextProps & { style?: CSSProperties; 'data-testid'?: string }
