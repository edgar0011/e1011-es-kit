import { CSSProperties, PropsWithChildren, Ref } from 'react'

export type LayoutBoxProps = PropsWithChildren & {
  id?: string | number
  flex?: string
  flexGrow?: string | number
  alignText?: 'center' | 'right' | 'left'
  direction?: 'row' | 'column'
  flexShrink?: string | number
  flexBasis?: string
  flexWrap?: string
  justify?: string
  align?: string
  alignSelf?: string
  margin?: string
  padding?: string
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
  gap?: string
  borderRadius?: string
  style?: Record<string, unknown> | null
  className?: string
  tabIndex?: number
  ref?: Ref<HTMLDivElement> | undefined
  onClick?: () => void
} & Omit<CSSProperties, 'direction'>
