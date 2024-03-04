import { CSSProperties, LegacyRef, PropsWithChildren } from 'react'

/**
 * Enum representing the possible layout directions.
 */
export enum LayoutDirection {
  ROW = 'row',
  COLUMN = 'column',
}

/**
 * Props for the LayoutBox component.
 */
export type LayoutBoxProps = PropsWithChildren & {
  /** Unique identifier for the component. */
  id?: string | number
  /** CSS flex property. */
  flex?: string
  /** CSS flexGrow property. */
  flexGrow?: string | number
  /** Text alignment within the box. */
  alignText?: 'center' | 'right' | 'left'
  /** Direction of the layout (row or column). */
  direction?: LayoutDirection | string
  /** CSS flexShrink property. */
  flexShrink?: string | number
  /** CSS flexBasis property. */
  flexBasis?: string
  /** CSS flexWrap property. */
  flexWrap?: string
  /** CSS justify-content property. */
  justify?: string
  /** CSS align-items property. */
  align?: string
  /** CSS align-self property. */
  alignSelf?: string
  /** CSS margin property. */
  margin?: string
  /** CSS padding property. */
  padding?: string
  /** CSS width property. */
  width?: string
  /** CSS height property. */
  height?: string
  /** CSS maxWidth property. */
  maxWidth?: string
  /** CSS maxHeight property. */
  maxHeight?: string
  /** CSS minWidth property. */
  minWidth?: string
  /** CSS minHeight property. */
  minHeight?: string
  /** Gap between child elements. */
  gap?: string
  /** CSS borderRadius property. */
  borderRadius?: string
  /** Additional inline styles for the component. */
  style?: Record<string, unknown> | null
  /** Additional class name(s) for the component. */
  className?: string
  /** Tab index for keyboard navigation. */
  tabIndex?: number
  /** Ref for accessing the underlying DOM element. */
  ref?: LegacyRef<HTMLDivElement> | undefined | null
  /** Callback function for click event. */
  onClick?: () => void
  /** If true, sets the layout direction to column. */
  column?: boolean
} & Omit<CSSProperties, 'direction'>;
