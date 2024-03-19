type Element = HTMLElement | null | (() => HTMLElement)
type CallbackFunction = (target: HTMLElement | null) => void

export const handleClickOutside = (
  element: Element,
  callback?: CallbackFunction,
) => (event: MouseEvent): void => {
  const target = event.target as HTMLElement | null
  const resolvedElement:HTMLElement | null = typeof element === 'function' ? element() : element

  if (resolvedElement && !resolvedElement.contains(target)) {
    callback?.(target)
  }
}
