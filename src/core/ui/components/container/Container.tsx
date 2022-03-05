import React, { FC, useRef, useState, useLayoutEffect, memo, ReactNode, useEffect } from 'react'
import styled from 'styled-components'

type StyledContainerProps = { height: number; className: string; [key: string]: any }

const StyledContainer: FC<StyledContainerProps> = styled.div<StyledContainerProps>`
  transition: opacity 0.2s ease-in-out, height 0.2s ease-in-out, max-height 0.2s ease-in-out;
  will-change: opacity, height, max-height;
  height: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;

  &.active {
    height: ${({ height }: Partial<StyledContainerProps>) => `${height}px`};
    max-height: ${({ height }: Partial<StyledContainerProps>) => `${height}px`};
    opacity: 1;
  }

`

export type ContainerProps = {
  collapsed: boolean
  collapseHandler?: (collapsed: boolean) => void
  children?: ReactNode
}
export const Container: FC<ContainerProps> = memo(({
  collapsed = false, collapseHandler, children,
}: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    collapseHandler?.(collapsed)
  }, [collapseHandler, collapsed])

  useLayoutEffect(() => {
    if (containerRef?.current) {
      setContentHeight(containerRef.current.scrollHeight)
    }
  }, [containerRef])

  return (
    <StyledContainer className={`${!collapsed ? 'active' : ''}`} ref={containerRef} height={contentHeight}>
      {children}
    </StyledContainer>
  )
})

Container.displayName = 'Container'
