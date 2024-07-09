import { MutableRefObject, useLayoutEffect, useMemo, useState, useRef } from 'react'
import debounce from 'lodash-es/debounce'

/**
 * Type definition for the size of the wrapper element.
 * @typedef {Object} WrapperSize
 * @property {undefined | number} width - The width of the wrapper element.
 * @property {undefined | number} height - The height of the wrapper element.
 */
export type WrapperSize = { width: undefined | number; height: undefined | number }

/**
 * Type definition for the unobserver function.
 * @typedef {() => (null | void)} Unobserver
 */
type Unobserver = () => (null | void)

/**
 * Type definition for the resize callback function.
 * @typedef {(wrapperSize: WrapperSize) => void} UseResizeCallBack
 */
export type UseResizeCallBack = (wrapperSize: WrapperSize) => void

/**
 * Custom hook to observe the resize event of an HTML element
 * and execute a callback or update the state with the new size.
 * @param {number} [debounceDelay=250] - The delay in milliseconds for debouncing the resize event.
 * @param {UseResizeCallBack} [callBack] - Optional callback function to execute when the element is resized.
 * @returns {[MutableRefObject<HTMLElement | null | undefined>, WrapperSize, Unobserver | undefined]}
 * An array containing the ref object for the container element,
 * the current size of the container, and an unobserver function.
 */
// eslint-disable-next-line default-param-last
export const useResize = (debounceDelay = 250, callBack?: UseResizeCallBack): [
  MutableRefObject<HTMLElement | null | undefined>, WrapperSize, Unobserver | undefined] => {
  const [containerSize, setContainerSize] = useState<WrapperSize>({ width: undefined, height: undefined })

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

    const unobserver = (): void => {
      resizeObserver?.unobserve?.(containerElement as Element)
    }

    // setUnobserver(unobserver)
    unobserverRef.current = unobserver

    return unobserver
  }, [debouncedResizeWrapper, containerRef, callBack])

  return [containerRef, containerSize, unobserverRef.current]
}
