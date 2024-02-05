import { memo, RefObject, PropsWithChildren } from 'react'

import { useResize } from '../../../hooks/useResize'

import { LayoutBox } from './LayoutBox'
import { LayoutBoxProps } from './layoutBox.types'


export type ResizableContainerProps = LayoutBoxProps & PropsWithChildren<any> & {
  debounceDelay?: number
}

export type ResizableContainerRenderProps = {
  width: number | string
  height: number | string
  measured: boolean
}

const styles = {
  main: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    pointerEvents: 'none',
  },
  empty: {
    pointerEvents: 'none',
  },
}

export const ResizableContainer = memo<ResizableContainerProps>(
  ({ children, debounceDelay = 250, ...props }: ResizableContainerProps) => {
    const [containerRef, containerSize] = useResize(debounceDelay)

    return (
      <LayoutBox
        width='100%'
        height='100%'
        justify='center'
        align='center'
        direction='column'
        {...props}
      >
        <LayoutBox
          style={styles.main}
          width='100%'
          height='100%'
          ref={containerRef as RefObject<HTMLDivElement>}
        />
        {!children && (
        <LayoutBox
          width={`${Math.max(containerSize?.width || 200, 200) || 200}px`}
          height={`${Math.max(containerSize?.height || 200, 200) || 200}px`}
          style={styles.empty}
        />
        )}
        {children && children?.({
          height: `${containerSize?.height || 200}px`,
          width: `${containerSize?.width || 200}px`,
          measured: !!containerSize?.height,
        } as ResizableContainerRenderProps)}
      </LayoutBox>
    )
  },
)

ResizableContainer.displayName = 'ResizableContainer'
