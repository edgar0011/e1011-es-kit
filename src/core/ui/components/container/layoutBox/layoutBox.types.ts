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
// TODO replace with & React.DIVHtmlAttributes<HTMLDivElement>
export type LayoutBoxProps = PropsWithChildren & {
  /** Unique identifier for the component. */
  id?: string | number
  /** CSS flex property. Can be string, boolean (true = flex-1), or number. */
  flex?: string | boolean | number
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
  /** CSS width property. Can be string or number (converted to px). */
  width?: string | number
  /** CSS height property. Can be string or number (converted to px). */
  height?: string | number
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
  /** CSS background property. */
  background?: string
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
  /** If true, uses CSS Grid instead of Flexbox. */
  asGrid?: boolean
  /** If true, sets width to 100%. */
  wFull?: boolean
  /** If true, sets height to 100%. */
  hFull?: boolean
  /** If true, centers content in both axes. */
  centered?: boolean
  /** If true, adds an outline to help debug layout issues. */
  debug?: boolean
} & Omit<CSSProperties, 'direction' | 'flex'>;
