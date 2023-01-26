import { MutableRefObject, useLayoutEffect, useMemo, useState, useRef } from 'react'
import debounce from 'lodash-es/debounce'

type WrapperSize = {width: undefined | number; height: undefined | number}

// const DefaultUnobserver = () => null

type Unobserver = () => (null | void)

export const useResize = (debounceDelay = 250): [
  MutableRefObject<HTMLElement | null | undefined>, WrapperSize, Unobserver | undefined] => {
  const [containerSize, setContainerSize]
  = useState<WrapperSize>({ width: undefined, height: undefined })

  const lastResizeWidthRef = useRef<WrapperSize>({ width: 0, height: 0 })
  const containerRef: MutableRefObject<HTMLElement | undefined | null> = useRef<HTMLElement | undefined | null>()

  // const [unobserver, setUnobserver] = useState<Unobserver>(DefaultUnobserver)
  const unobserverRef = useRef<Unobserver>()

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
  }, debounceDelay), [containerRef, debounceDelay])

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
    const unobserver = () => {
      resizeObserver?.unobserve?.(containerElement as Element)
    }

    // setUnobserver(unobserver)
    unobserverRef.current = unobserver

    return unobserver
  }, [debouncedResizeWrapper, containerRef])

  return [containerRef, containerSize, unobserverRef.current]
}
