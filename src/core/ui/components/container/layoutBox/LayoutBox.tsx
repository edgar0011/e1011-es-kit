import { memo, FC, useMemo, CSSProperties, forwardRef, LegacyRef } from 'react'

import { useParseProps } from '../../../../hooks/useParseProps'
import { classNames } from '../../../../utils/helpers/ui'

import classes from './layoutBox.module.scss'
import { LayoutDirection, LayoutBoxProps } from './layoutBox.types'

/**
 * Map of flex values for resolving flex alignment and justification.
 * @type {Record<string, string>}
 */
const flexValueMap: Record<string, string> = {
  start: 'flex-start',
  'flex-start': 'flex-start',
  end: 'flex-end',
  'flex-end': 'flex-end',
}

/**
 * Resolves flex alignment and justification properties based on the provided value.
 * @param {string | undefined} value - The value to resolve.
 * @returns {string | undefined} - Resolved flex property value.
 */
const resolveFlexProps = (value?: string): string | undefined => (value ? (flexValueMap[value] || value) : value)

/**
 * Forwarded ref version of the LayoutBox component.
 * @param {LayoutBoxProps} props - Props for the LayoutBox component.
 * @param {LegacyRef<HTMLDivElement> | undefined} ref - Ref for accessing the underlying DOM element.
 * @returns {JSX.Element} - Rendered LayoutBox component.
 */
const LayoutBoxRefForwarded = forwardRef(({
  id,
  style,
  children,
  tabIndex,
  className = '',
  column,
  asGrid = false,
  wFull = false,
  hFull = false,
  centered = false,
  flex,
  width,
  height,
  debug = false,
  background,
  ...props
}: LayoutBoxProps, ref: LegacyRef<HTMLDivElement> | undefined | null) => {
  const { dataProps, restProps } = useParseProps(props)

  /**
   * Memoized resolved direction based on the column prop.
   * @type {LayoutDirection}
   */
  const resolvedColumn = useMemo(() => ((
    column !== undefined && column === true)
    ? LayoutDirection.COLUMN
    : null), [column])

  /**
  * Memoized styles combining parsed props, BoxLayout-like helpers and additional styles.
  * @type {CSSProperties}
  */
  const styles = useMemo(() => {
    const baseStyles: CSSProperties = {
      ...(restProps as CSSProperties),
    }

    // Resolve direction (supports column helper)
    if (restProps.direction || resolvedColumn) {
      baseStyles.flexDirection = (restProps.direction || resolvedColumn) as CSSProperties['flexDirection']
    }

    // Resolve alignment and justification
    if (centered) {
      baseStyles.alignItems = 'center'
      baseStyles.justifyContent = 'center'
    } else {
      if (restProps.align) {
        baseStyles.alignItems = resolveFlexProps(restProps.align as string)
      }
      if (restProps.justify) {
        baseStyles.justifyContent = resolveFlexProps(restProps.justify as string)
      }
    }

    // Flex or grid display
    if (asGrid) {
      baseStyles.display = 'grid'
    } else {
      baseStyles.display = 'flex'
    }

    // Width / height helpers
    if (wFull) {
      baseStyles.width = '100%'
    } else if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width
    }

    if (hFull) {
      baseStyles.height = '100%'
    } else if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height
    }

    // Flex helper
    if (flex !== undefined) {
      if (flex === true) {
        baseStyles.flex = 1
      } else if (typeof flex === 'number') {
        baseStyles.flex = flex
      } else {
        baseStyles.flex = flex as string
      }
    }

    // Background helper
    if (background !== undefined) {
      baseStyles.background = background
    }

    // Debug outline helper
    if (debug) {
      baseStyles.outline = '1px solid red'
    }

    // User provided style wins last
    return {
      ...baseStyles,
      ...style,
    }
  }, [
    asGrid,
    background,
    centered,
    debug,
    flex,
    hFull,
    height,
    resolvedColumn,
    restProps,
    style,
    wFull,
    width,
  ])

  return (
    <div
      {...(id ? { id: `${id}` } : {})}
      ref={ref}
      tabIndex={tabIndex}
      className={classNames(
        classes['layout-box'],
        className,
      )}
      style={styles as CSSProperties}
      {...dataProps}
      data-testid={dataProps.dataTestId || dataProps['data-testid'] || id}
    >
      {children}
    </div>
  )
})

LayoutBoxRefForwarded.displayName = 'LayoutBoxRefForwarded'

/**
 * Memoized and memoized LayoutBox component.
 * @type {FC<LayoutBoxProps>}
 */
export const LayoutBox: FC<LayoutBoxProps> = memo<LayoutBoxProps>(LayoutBoxRefForwarded)

export const BoxLayout: FC<LayoutBoxProps> = memo<LayoutBoxProps>(LayoutBoxRefForwarded)

LayoutBox.displayName = 'LayoutBox'

BoxLayout.displayName = 'BoxLayout'
