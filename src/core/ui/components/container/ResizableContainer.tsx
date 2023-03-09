import { memo, useState, useRef, useMemo, useLayoutEffect, RefObject, PropsWithChildren } from 'react'
import debounce from 'lodash-es/debounce'

import { FBox, FBoxProps } from './FBox'


export type ResizableContainerProps = FBoxProps & PropsWithChildren<any> & {
  debounceDelay?: number
}

export type ResizableContainerRenderProps = {
  width: number | string
  height: number | string
  measured: boolean
}

type WrapperSize = {width: undefined | number; height: undefined | number}

const styles = {
  main: {
    position: 'absolute',
    zIndex: 111,
    left: 0,
    pointerEvents: 'none',
    // backgroundColor: '#FF000040',
  },
  empty: {
    pointerEvents: 'none',
    // background: '#FF000040',
    // border: '1px solid #0000FF40',
  },
}

export const ResizableContainer = memo<ResizableContainerProps>(
  ({ children, debounceDelay = 250, ...props }: ResizableContainerProps) => {
    const containerRef = useRef<HTMLDivElement>()

    const lastResizeWidthRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

    const [containerSize, setContainerSize]
    = useState<WrapperSize>({ width: undefined, height: undefined })

    const debouncedResizeWrapper = useMemo(() => debounce((entries) => {
      const newResizeWidth = entries[0].contentRect.width
      const newResizeHeight = entries[0].contentRect.height

      if (lastResizeWidthRef.current?.width === newResizeWidth
      && lastResizeWidthRef.current?.height === newResizeHeight) {
        return
      }
      lastResizeWidthRef.current = { width: newResizeWidth, height: newResizeHeight }

      setContainerSize({
        width: containerRef?.current?.clientWidth,
        height: containerRef?.current?.clientHeight,
      })
    }, debounceDelay), [debounceDelay])

    useLayoutEffect(() => {
      let resizeObserver: ResizeObserver
      let containerElement: HTMLElement

      if (containerRef?.current) {
        containerElement = containerRef?.current
        resizeObserver = new ResizeObserver(debouncedResizeWrapper)
        resizeObserver.observe(containerElement as Element)

        setContainerSize({
          width: containerRef?.current?.clientWidth,
          height: containerRef?.current?.clientHeight,
        })
      }
      return () => {
        resizeObserver?.unobserve?.(containerElement as Element)
      }
    }, [debouncedResizeWrapper, containerRef])

    // END RESIZING

    return (
      <FBox
        width='100%'
        height='100%'
        justify='center'
        align='center'
        direction='column'
        {...props}
      >
        <FBox
          style={styles.main}
          width='100%'
          height='100%'
          ref={containerRef as RefObject<HTMLDivElement>}
        />
        {!children && (<FBox
          width={`${Math.max(containerSize?.width || 200, 200) || 200}px`}
          height={`${Math.max(containerSize?.height || 200, 200) || 200}px`}
          style={styles.empty}
        />)}
        {children && children?.({
          height: `${containerSize?.height || 200}px`,
          width: `${containerSize?.width || 200}px`,
          measured: !!containerSize?.height,
        } as ResizableContainerRenderProps)}
      </FBox>
    )
  },
)

ResizableContainer.displayName = 'ResizableContainer'

