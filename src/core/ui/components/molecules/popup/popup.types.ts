import { CSSProperties, ComponentType, PropsWithChildren } from 'react'

import { PopoverProps } from '../popover/popover.types'


/**
 * Enumeration of animation variants for the Popup component.
 *
 * @readonly
 * @enum {string}
 */
export enum PopupAnimateVariant {
  SLIDE_DOWN = 'slideDown',
  SLIDE_UP = 'slideUp',
  SLIDE_RIGHT = 'slideRight',
  SLIDE_LEFT = 'slideLeft',
}

/**
 * Props for the Popup component.
 *
 * @typedef {PropsWithChildren & PopoverProps & {
*   title?: string
*   className?: string
*   components?: {
*     ContentComponent?: ComponentType | undefined
*   }
*   animateVariant?: PopupAnimateVariant
*   width?: string
*   height?: string
*   style?: CSSProperties
* }} PopupProps
* @property {string} [title="Popup's title"] - The title of the popup.
* @property {string} [className] - The CSS class name for the popup.
* @property {Object} [components] - The components to be used for rendering the popup content.
* @property {ComponentType | undefined} [components.ContentComponent]
* - The component to be used for rendering the popup content.
* @property {PopupAnimateVariant} [animateVariant=PopupAnimateVariant.SLIDE_UP]
* - The animation variant to be used for the popup.
* @property {string} [width] - The width of the popup.
* @property {string} [height] - The height of the popup.
* @property {CSSProperties} [style] - The inline style for the popup.
*/
export type PopupProps = PropsWithChildren & PopoverProps & {
  title?: string
  className?: string
  components?: {
   ContentComponent?: ComponentType | undefined
  }
  animateVariant?: PopupAnimateVariant
  hasHeader?: boolean
  hasCloseIcon?: boolean
  width?: string
  height?: string
  style?: CSSProperties
}
