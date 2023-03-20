import { FC, useRef, useState, memo, ReactNode, useEffect, useLayoutEffect, useMemo, CSSProperties } from 'react'

import classes from './CollapsibleContainer.module.scss'

const elementPropNameMap: Record<string, string> = {
  width: 'scrollWidth',
  height: 'scrollHeight',
}

export type CollapsibleContainerProps = {
  collapsed?: boolean
  collapseHandler?: (collapsed: boolean) => void
  children?: ReactNode
  className?: string
  horizontal?: boolean
} & CSSProperties

export const CollapsibleContainer: FC<CollapsibleContainerProps> = memo(({
  collapsed = false, collapseHandler, children, horizontal = false, className = '', ...style
}: CollapsibleContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentProp, setContentProp] = useState(0)

  const vertical = !horizontal

  useEffect(() => {
    collapseHandler?.(collapsed)
  }, [collapseHandler, collapsed])

  useLayoutEffect(() => {
    if (containerRef?.current) {
      const propName = vertical ? 'height' : 'width'

      setContentProp((containerRef.current as any)[elementPropNameMap[propName]])
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
      className={`${classes['collapsible-container']} ${classNames} ${className} `}
      ref={containerRef}
      style={styleProps}
    >
      {children}
    </div>
  )
})

CollapsibleContainer.displayName = 'CollapsibleContainer'
