import { MutableRefObject, useLayoutEffect, useMemo, useState, useRef } from 'react'
import debounce from 'lodash-es/debounce'

type WrapperSize = {width: undefined | number; height: undefined | number}

// const DefaultUnobserver = () => null

type Unobserver = () => (null | void)

type CallBack = () => void

// eslint-disable-next-line default-param-last
export const useResize = (debounceDelay = 250, callBack?: CallBack): [
  MutableRefObject<HTMLElement | null | undefined>, WrapperSize, Unobserver | undefined] => {
  const [containerSize, setContainerSize]
    = useState<WrapperSize>({ width: undefined, height: undefined })

  const lastResizeWidthRef = useRef<WrapperSize>({ width: 0, height: 0 })
  const containerRef: MutableRefObject<HTMLElement | undefined | null> = useRef<HTMLElement | undefined | null>()
  const unobserverRef = useRef<Unobserver>()

  const debouncedResizeWrapper = useMemo(() => debounce((entries) => {
    const newResizeWidth = entries[0].contentRect.width
    const newResizeHeight = entries[0].contentRect.height

    if (lastResizeWidthRef.current?.width === newResizeWidth
      && lastResizeWidthRef.current?.height === newResizeHeight) {
      return
    }
    lastResizeWidthRef.current = { width: newResizeWidth, height: newResizeHeight }

    // eslint-disable-next-line semi-style
    ;(callBack || setContainerSize)({
      width: containerRef?.current?.clientWidth,
      height: containerRef?.current?.clientHeight,
    })
  }, debounceDelay), [callBack, debounceDelay])

  useLayoutEffect(() => {
    let resizeObserver: ResizeObserver
    let containerElement: HTMLElement

    if (containerRef?.current) {
      containerElement = containerRef?.current
      resizeObserver = new ResizeObserver(debouncedResizeWrapper)
      resizeObserver.observe(containerElement as Element)

      // eslint-disable-next-line semi-style
      ;(callBack || setContainerSize)({
        width: containerRef?.current?.clientWidth,
        height: containerRef?.current?.clientHeight,
      })
    }
    const unobserver = () => {
      resizeObserver?.unobserve?.(containerElement as Element)
    }

    // setUnobserver(unobserver)
    unobserverRef.current = unobserver

    return unobserver
  }, [debouncedResizeWrapper, containerRef, callBack])

  return [containerRef, containerSize, unobserverRef.current]
}
