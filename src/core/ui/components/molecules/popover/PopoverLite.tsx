
import React, { FC, memo, useRef, useEffect, useState, useCallback, useMemo,
  CSSProperties, ReactNode, ReactElement } from 'react'
import { createPopper, Instance, ModifierArguments } from '@popperjs/core'

import { EventName, KeyCode } from '../../../../constants'
import { cancelableSetTimeout } from '../../../../utils'
import { outsideClickHandler } from '../../../../hooks'

import { PopoverProps } from './popover.types'


const styles: Record<string, Partial<CSSProperties>> = {
  modal: {
    zIndex: 1,
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    background: 'rgba(0 0 0 / 70%)',
    pointerEvents: 'all',
    userSelect: 'none',
    visibility: 'hidden',
  },
}

export const Popover: FC<PopoverProps> = memo<PopoverProps>(
  ({
    children,
    components,
    placement = 'bottom',
    modifiers,
    data,
    hoverable,
    clickable,
    onOpen,
    onHide,
    isOpen,
    hideOnContentClick = false,
    hideOnClickOutside = true,
    hideTimeout = 150,
    isPopup = false,
    isModal = false,
    modalOverlayClassName,
    modalContainer,
    targetRef,
    hideOnEscape,
    ...props
  }: PopoverProps) => {
    const [content, setContent] = useState<HTMLElement | null>(null)
    const [target, setTarget] = useState<HTMLElement | null>(targetRef?.current ?? null)

    useEffect(() => {
      if (targetRef?.current) {
        setTarget(targetRef?.current)
      }
    }, [targetRef])

    const { ContentComponent, ...contentComponents } = components || {}

    const popperInstanceRef = useRef<Instance | null>(null)

    const options = useMemo(() => {
      const options = (modifiers ? { modifiers, placement } : { placement })

      options.modifiers = options.modifiers || []

      if (isPopup) {
        options.modifiers = [
          ...options.modifiers,
          {
            name: 'centering',
            phase: 'beforeWrite',
            enabled: true,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fn: ({ state }): Partial<ModifierArguments> => {
              const mcBoundRect = modalContainer?.getBoundingClientRect()

              const { width, height, left, top } = mcBoundRect || {
                width: window.innerWidth,
                height: window.innerHeight,
                left: 0,
                top: 0,
              }

              const xpos = left + (width - state.elements.popper.clientWidth) / 2
              const ypos = top + (height - state.elements.popper.clientHeight) / 2

              return {
                ...state,
                styles: {
                  ...state.styles,
                  popper: {
                    ...state.styles.popper,
                    left: `${xpos}px`,
                    top: `${ypos}px`,
                    transform: 'none',
                  },
                },
              }
            },
          },
        ] as PopoverProps['modifiers']
      }

      return options
    }, [modifiers, placement, isPopup, modalContainer])

    // to save cancelable setTimout
    const pendingHideRef = useRef<(() => void)>()

    useEffect(() => {
      popperInstanceRef?.current?.destroy()
      let popperInstance: ReturnType<typeof createPopper>

      if (target && content) {
        popperInstance = createPopper(target, content, { ...options })

        popperInstanceRef.current = popperInstance
      }

      return (): void => {
        popperInstance?.destroy()
        popperInstanceRef.current = null
      }
    }, [content, target, options])


    const outsideClickUnsubscriber = useRef<() => void | null>()
    const outsideClickUnsubscriberTimeout = useRef<any>(-1)

    const hide = useCallback(() => {
      if (content) {
        delete content.dataset.show
      }

      if (isModal && modalRef?.current) {
        modalRef.current.style.visibility = 'hidden'
        delete modalRef.current.dataset.show
      }

      popperInstanceRef?.current?.update()
      onHide?.()
      outsideClickUnsubscriber?.current?.()
      clearTimeout(outsideClickUnsubscriberTimeout.current)
    }, [content, isModal, onHide])


    const delayedHide = useCallback(() => {
      pendingHideRef.current && pendingHideRef.current()
      pendingHideRef.current = cancelableSetTimeout(hide, hideTimeout)
    }, [hide, hideTimeout])

    const cancelDelayedHide = useCallback(() => {
      pendingHideRef.current && pendingHideRef.current()
    }, [])

    const handleOutsideClick = useCallback((eventTarget: HTMLElement | null) => {
      if ((content?.dataset?.show === 'true' && hideOnClickOutside && !content?.contains(eventTarget))
        || (content?.contains(eventTarget) && hideOnContentClick)) {
        hide()
      }
    }, [hide, content, hideOnContentClick, hideOnClickOutside])

    const open = useCallback(() => {
      if (content) {
        content.dataset.show = 'true'
      }

      popperInstanceRef?.current?.update()

      if (isModal && modalRef?.current) {
        modalRef.current.style.visibility = 'visible'
        modalRef.current.dataset.show = 'true'
      }

      onOpen?.()

      outsideClickUnsubscriber?.current?.()
      clearTimeout(outsideClickUnsubscriberTimeout.current)
      outsideClickUnsubscriberTimeout.current = setTimeout(() => {
        outsideClickUnsubscriber.current = outsideClickHandler(target, handleOutsideClick)
      }, 250)
    }, [content, handleOutsideClick, isModal, onOpen, target])

    const toggleOpen = useCallback(() => {
      content?.dataset?.show === 'true' ? hide() : open()
    }, [content, hide, open])

    const keydownHandler = useCallback((event: Event) => {
      if (hideOnEscape && (event as unknown as KeyboardEvent).keyCode === KeyCode.Escape) {
        hide()
      }
    }, [hideOnEscape, hide])

    useEffect(() => {
      if (!hoverable && !clickable) {
        console.error('Popover component should have at least one of props ["hoverable", "clickable"]')
      }

      const targetAddListener = target?.addEventListener?.bind(target)
      const contentAddListener = content?.addEventListener?.bind(content)

      if (contentAddListener && targetAddListener) {
        if (hoverable) {
          targetAddListener(EventName.MouseEnter, open)
          contentAddListener(EventName.MouseEnter, cancelDelayedHide)
          targetAddListener(EventName.MouseLeave, delayedHide)
          contentAddListener(EventName.MouseLeave, hide)
        }

        if (clickable) {
          targetAddListener(EventName.Click, toggleOpen)
        }
      }

      if (hideOnEscape) {
        document.addEventListener(EventName.KeyDown, keydownHandler)
      }

      return (): void => {
        const targetRemoveListener = target?.removeEventListener?.bind(target)
        const contentRemoveListener = content?.removeEventListener?.bind(content)

        document.removeEventListener(EventName.KeyDown, keydownHandler)

        pendingHideRef.current && pendingHideRef.current()

        if (targetRemoveListener) {
          targetRemoveListener(EventName.Click, toggleOpen)
          targetRemoveListener(EventName.MouseEnter, open)
          targetRemoveListener(EventName.MouseLeave, delayedHide)
        }
        if (contentRemoveListener) {
          contentRemoveListener(EventName.MouseLeave, hide)
          contentRemoveListener(EventName.MouseEnter, cancelDelayedHide)
        }
      }
    }, [target, content, clickable, hoverable,
      open, hide, toggleOpen, delayedHide, cancelDelayedHide, hideOnEscape, keydownHandler])

    // open, hide based on external isOpen
    useEffect(() => {
      if (isOpen === true) {
        open()
      }
      if (isOpen === false) {
        hide()
      }
      return outsideClickUnsubscriber?.current as () => void
    }, [hide, isOpen, open])

    const childrenIsFunction = typeof children === 'function'
    const childrenIsElement = typeof children !== 'function' && !Array.isArray(children)
    const childrenAreElements = typeof children !== 'function' && Array.isArray(children)
      && children.filter((child: ReactNode) => !!child).length === 2

    // modal
    const modalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (isModal && content) {
        content.style.zIndex = '2'
      }
    }, [content, isModal])

    return (
      <>
        {isModal && <span ref={modalRef} style={styles.modal} className={modalOverlayClassName} />}
        {(!targetRef && childrenIsFunction) && children?.({ forwardedRef: setTarget, data })}
        {(!targetRef && childrenIsElement) && <span ref={setTarget}>{children}</span>}
        {!childrenAreElements && ContentComponent && (
        <ContentComponent
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          placement={placement}
          forwardedRef={setContent}
          ref={typeof ContentComponent !== 'function' ? setContent : null}
          data={data}
          hide={hide}
          components={contentComponents as { [key: string]: FC | React.Component<any> }}
          {...props}
        />
        )}
        {(!targetRef && childrenAreElements) && <span ref={setTarget}>{children[0]}</span>}
        {(childrenAreElements && children?.[1] && typeof children?.[1] === 'object')
        && React.cloneElement(children[1] as ReactElement, {
          ...((children?.[1] as ReactElement)?.props),
          placement,
          forwardedRef: setContent,
          // ...(typeof children[1] !== 'function' ? { ref: setContent } : {}),
          ref: setContent,
          data,
          hide,
          components: contentComponents as { [key: string]: FC | React.Component<any> },
          ...props,
        })}
      </>
    )
  },
)

Popover.displayName = 'Popover'
