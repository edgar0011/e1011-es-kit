import { FC, useRef, useState, memo, ReactNode,
  useEffect, useLayoutEffect, useMemo, CSSProperties, PropsWithChildren } from 'react'

import { useParseProps } from '../../../hooks/useParseProps'

import classes from './CollapsibleContainer.module.scss'
import { LayoutBoxProps } from './layoutBox.types'


/**
 * Mapping of element property names for calculating dimensions.
 */
const elementPropNameMap: Record<string, string> = {
  width: 'scrollWidth',
  height: 'scrollHeight',
}

/**
 * Props for the CollapsibleContainer component.
 */
export type CollapsibleContainerProps = PropsWithChildren & Omit<LayoutBoxProps, 'ref'> & {
  collapsed?: boolean
  collapseHandler?: (collapsed: boolean) => void
  children?: ReactNode
  className?: string
  horizontal?: boolean
} & CSSProperties

/**
 * CollapsibleContainer component.
 *
 * @type {React.FC<CollapsibleContainerProps>}
 * @returns {React.ReactElement} The CollapsibleContainer.
 */
export const CollapsibleContainer: FC<CollapsibleContainerProps> = memo(({
  collapsed = false, collapseHandler, children, horizontal = false, className = '', id, ...props
}: CollapsibleContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentProp, setContentProp] = useState(0)

  const { dataProps, restProps: style } = useParseProps(props)

  const vertical = !horizontal

  useEffect(() => {
    collapseHandler?.(collapsed)
  }, [collapseHandler, collapsed])

  useLayoutEffect(() => {
    if (containerRef?.current) {
      const propName = vertical ? 'height' : 'width'

      // TODO test with requestAnimationFrame
      setTimeout(() => {
        if (containerRef?.current) {
          setContentProp((containerRef.current as any)[elementPropNameMap[propName]])
        }
      }, 100)
    }
  }, [containerRef, vertical])

  const styleProps: CSSProperties = useMemo(() => ({
    '--prop-name': vertical ? 'height' : 'width',
    '--prop-max-name': vertical ? 'max-height' : 'max-width',
    '--prop-value': `${contentProp}px`,
    ...style,
  } as CSSProperties), [vertical, style, contentProp])

  const classNames = useMemo(() => {
    const classNames = [vertical ? classes.vertical : classes.horizontal]

    if (collapsed && contentProp && contentProp !== undefined && contentProp !== null) {
      classNames.push(classes.collapsed)
    }
    if (!collapsed && contentProp && contentProp !== undefined && contentProp !== null) {
      classNames.push(classes.expanded)
    }
    return classNames.join(' ')
  }, [collapsed, contentProp, vertical])

  return (
    <div
      id={`${(typeof id !== 'undefined' && id) || id}`}
      className={`${classes['collapsible-container']} ${classNames} ${className} `}
      ref={containerRef}
      style={styleProps}
      {...dataProps}
      data-testid={dataProps.dataTestId || dataProps['data-testid'] || id}
    >
      {children}
    </div>
  )
})

CollapsibleContainer.displayName = 'CollapsibleContainer'
