import React, { FC, useRef, useState, memo, ReactNode, useEffect } from 'react'
import styled from 'styled-components'

type StyledContainerProps = { propName: string; className: string; [key: string]: any }

const elementPropNameMap: Record<string, string> = {
  width: 'scrollWidth',
  height: 'scrollHeight',
}

const propNameFunc = ({ propName }: { propName: StyledContainerProps['propName']}) => propName

const StyledContainer: FC<StyledContainerProps> = memo(styled.div<StyledContainerProps>`
  transform-origin: 0% 0%;
  transition: opacity 0.2s ease-in-out, ${propNameFunc} 0.2s ease-in-out, max-${propNameFunc} 0.2s ease-in-out;
  will-change: opacity, ${propNameFunc}, max-${propNameFunc};
  overflow: hidden;
  opacity: 0;

  &.collapsed {
    ${propNameFunc}: 0;
    max-${propNameFunc}: 0;
    opacity: 0;
  }

  &.expanded {
    ${propNameFunc}: ${({ contentProp }: Partial<StyledContainerProps>) => `${contentProp}px`};
    max-${propNameFunc}: ${({ contentProp }: Partial<StyledContainerProps>) => `${contentProp}px`};
    opacity: 1;
  }
`)

export type ContainerProps = {
  collapsed: boolean
  collapseHandler?: (collapsed: boolean) => void
  children?: ReactNode
  propName?: string
}
export const Container: FC<ContainerProps> = memo(({
  collapsed = false, collapseHandler, children, propName = 'height', ...props
}: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>()
  const [contentProp, setContentProp] = useState(0)

  useEffect(() => {
    collapseHandler?.(collapsed)
  }, [collapseHandler, collapsed])

  useEffect(() => {
    if (containerRef?.current) {
      setContentProp((containerRef.current as any)[elementPropNameMap[propName]])
    }
  }, [containerRef, propName])

  let resolvedClassName = ''

  if (collapsed && contentProp && contentProp !== undefined && contentProp !== null) {
    resolvedClassName = 'collapsed'
  }
  if (!collapsed && contentProp && contentProp !== undefined && contentProp !== null) {
    resolvedClassName = 'expanded'
  }

  return (
    <StyledContainer
      className={resolvedClassName}
      ref={containerRef}
      contentProp={contentProp}
      propName={propName}
      {...props}
    >
      {children}
    </StyledContainer>
  )
})

Container.displayName = 'Container'
