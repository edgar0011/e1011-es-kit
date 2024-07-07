import {
  cloneElement, memo, PropsWithChildren, FC, ReactNode, CSSProperties, useMemo, ReactElement,
} from 'react'

import closeIcon from '../../../../../assets/icons/circle-xmark.svg'
import { Popover as PopoverLite } from '../popover/PopoverLite'
import { HeadlineTertiary as H3 } from '../../atoms/text'
import { IconBase } from '../../icon'
import { DividerLine } from '../../dividers'
import { LayoutBox } from '../../container'

import classes from './popup.module.scss'
import classesOverlay from './popup.overlay.module.scss'
import { PopupAnimateVariant, PopupProps } from './popup.types'


/**
 * Styles for the Popup component.
 *
 * @typedef {Object} PopupStyles
 * @property {Object} inner - The inner styles for the popup.
 * @property {CSSProperties} content - The styles for the popup content.
 */

const styles: {
  popup: {
    inner: Record<string, Record<string, string>>
  }

} = {
  popup: {
    inner: {
      [PopupAnimateVariant.SLIDE_DOWN]: { '--slideYFrom': '-48px' },
      [PopupAnimateVariant.SLIDE_UP]: { '--slideYFrom': '48px' },
      [PopupAnimateVariant.SLIDE_RIGHT]: { '--slideXFrom': '-64px' },
      [PopupAnimateVariant.SLIDE_LEFT]: { '--slideXFrom': '64px' },
    },
  },
}

/**
 * Popup component.
 *
 * @type {React.FC<PopupProps>}
 * @returns {React.ReactElement} The Popup.
 */
export const Popup: FC<PopupProps> = memo<PopupProps>(({
  title = 'Popup\'s title',
  children,
  components = {},
  isModal = true,
  hideOnClickOutside = false,
  hideOnContentClick = false,
  animateVariant = PopupAnimateVariant.SLIDE_UP,
  hasHeader = true,
  hasCloseIcon = true,
  width,
  height,
  style,
  ...props
}: PopupProps) => {
  /**
   * The ContentComponent to render.
   *
   * @type {ComponentType}
   */
  const ContentComponent = components?.ContentComponent

  /**
   * The popup styles.
   *
   * @type {CSSProperties}
   */
  const styles = useMemo(() => ({
    ...(width ? { '--popup-width': width } : {}),
    ...(height ? { '--popup-height': height } : {}),
    ...style,
  }), [height, style, width])

  return (
    <PopoverLite
      clickable
      isPopup
      isModal={isModal}
      hideOnContentClick={hideOnContentClick}
      hideOnClickOutside={hideOnClickOutside}
      modalOverlayClassName={classesOverlay['popup-modal-overlay']}
      {...props}
    >
      <p>{/* Placeholder element to avoid error with no children */}</p>
      <PopupContent
        title={title}
        hasHeader={hasHeader}
        hasCloseIcon={hasCloseIcon}
        animateVariant={animateVariant}
        popupStyle={styles}
      >
        {/* Render children if ContentComponent is not provided */}
        {(!ContentComponent && children) && children}
        {/* Render ContentComponent if children are not provided */}
        {(!children && ContentComponent) && <ContentComponent />}
      </PopupContent>
    </PopoverLite>
  )
})

/**
 * The display name of the Popup component.
 *
 * @type {string}
 */
Popup.displayName = 'Popup'

type PopupContentProps = PropsWithChildren<unknown> & {
  title?: string
  forwardedRef?: ForwardedRef['forwardedRef']
  animateVariant?: PopupProps['animateVariant']
  popupStyle?: CSSProperties
  hasHeader?: boolean
  hasCloseIcon?: boolean
  hide?: () => void
}

/**
 * The PopupContent component.
 *
 * @param {PopupContentProps} props The props for the PopupContent component.
 * @returns {React.ReactElement} The PopupContent.
 */
const PopupContent = memo(({
  title,
  forwardedRef,
  hide,
  children,
  animateVariant,
  popupStyle,
  hasHeader = true,
  hasCloseIcon = true,
  ...props
}: PopupContentProps) => {
  /**
   * The ContentRemapped element.
   *
   * @type {React.ReactElement[] | React.ReactElement}
   */
  const ContentRemapped = children && Array.isArray(children)
    ? children.filter((child: ReactNode | ReactElement) => !!child)
      .map((child: ReactElement, index: number) => cloneElement(
      // eslint-disable-next-line react/no-array-index-key
        child, { key: index, ...child.props, hide, ...props },
      ))
    : <div>Pseudo Content</div>

  return (
    <div className={`${classes['popup-container']}`} ref={forwardedRef} style={popupStyle}>
      <LayoutBox
        className={`${classes['popup-container-inner']}`}
        style={animateVariant ? styles.popup.inner[animateVariant] : null}
      >
        {hasHeader && (
          <>
            <LayoutBox justify='space-between' align='start' width='100%' padding='20px 20px 16px 20px'>
              <H3>{title}</H3>
              {hasCloseIcon && (
                <div
                  onClick={hide}
                  onKeyDown={hide}
                  role='button'
                  tabIndex={-1}
                  className={classes['close-button']}
                >
                  <IconBase iconUrl={closeIcon} />
                </div>
              )}
            </LayoutBox>
            <DividerLine length='100%' />
          </>
        )}
        <div className={classes['popup-container-inner-div']}>
          {ContentRemapped && ContentRemapped}
        </div>
      </LayoutBox>
    </div>
  )
})

/**
 * The display name of the PopupContent component.
 *
 * @type {string}
 */
PopupContent.displayName = 'PopupContent'
