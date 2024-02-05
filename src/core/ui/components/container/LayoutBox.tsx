import { memo, FC, useMemo, CSSProperties, forwardRef, LegacyRef } from 'react'

import { useParseProps } from '../../../hooks/useParseProps'

import { LayoutDirection, LayoutBoxProps } from './layoutBox.types'
import classes from './layoutBox.module.scss'


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
  id, style, children, tabIndex, className = '', onClick, column, ...props
}: LayoutBoxProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
  const { dataProps, restProps } = useParseProps(props)

  /**
   * Memoized onClick event properties.
   * @type {{ onClick?: () => void; onKeyDown?: () => void; role?: string; tabIndex?: number }}
   */
  const onClickProps = useMemo(() => (onClick ? ({
    onClick,
    onKeyDown: onClick,
    role: 'button',
    tabIndex: -1,
  }) : {}), [onClick])

  /**
   * Memoized resolved direction based on the column prop.
   * @type {LayoutDirection}
   */
  const resolvedColumn = useMemo(() => ((
    column !== undefined && column === true)
    ? LayoutDirection.COLUMN
    : null), [column])

  /**
   * Memoized styles combining parsed props and additional styles.
   * @type {CSSProperties}
   */
  const styles = useMemo(() => (
    {
      ...restProps,
      ...(restProps.align ? { alignItems: resolveFlexProps(restProps.align as string) } : {}),
      ...(restProps.justify ? { justifyContent: resolveFlexProps(restProps.justify as string) } : {}),
      ...(restProps.direction || resolvedColumn ? { flexDirection: restProps.direction || resolvedColumn } : {}),
      ...style,
    }
  ), [resolvedColumn, restProps, style])

  return (
    <div
      {...(id ? { id: `${id}` } : {})}
      ref={ref}
      tabIndex={tabIndex}
      className={`${(classes as any)['flexible-box']} ${className}`}
      style={styles as CSSProperties}
      {...dataProps}
      data-testid={dataProps.dataTestId || dataProps['data-testid'] || id}
      {...onClickProps}
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

LayoutBox.displayName = 'LayoutBox'
