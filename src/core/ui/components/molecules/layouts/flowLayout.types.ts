
import { ComponentType, FC, ReactNode } from 'react'

import { CommonProps } from '../../../types/CommonProps'
import { LayoutBoxProps } from '../../container/layoutBox/layoutBox.types'


/**
 * Defines the structure for item data transfer objects (DTO) used within a flow layout.
 * It extends `LayoutBoxProps` and `CommonProps` for layout and common property support,
 * allowing additional custom properties as needed.
 *
 * @property {number} [spanColumn] Optional. Specifies how many columns the item should span in the layout.
 * @property {ComponentType | FC<unknown>} Component The component to be rendered for this item.
 * @property {Partial<LayoutBoxProps>} [layoutProps] Optional. Additional layout properties to be applied to this item.
 */
export type ItemDTOType = LayoutBoxProps & CommonProps & {
  spanColumn?: number
  Component: ComponentType | FC<unknown>
  layoutProps?: Partial<LayoutBoxProps>
  [key: string]: any // Allows for additional custom properties not explicitly defined.
};

/**
 * Props for the `FlowLayout` component, which arranges its child components according to the given layout properties.
 * It supports a flexible number of columns and allows for custom content before and after the main content.
 *
 * @property {ItemDTOType[]} itemDTOs An array of `ItemDTOType`
 * objects representing the items to be rendered in the layout.
 * @property {Partial<LayoutBoxProps>} [containerProps] Optional.
 * Additional properties to be applied to the layout container.
 * @property {Partial<LayoutBoxProps>} [defaultItemLayoutProps] Optional.
 * Default layout properties to be applied to each item unless overridden.
 * @property {number} [numColumns] Optional.
 * The number of columns in the layout. This affects how items are distributed horizontally.
 * @property {ReactNode} [beforeContent] Optional. Custom content to be rendered before the main content.
 * @property {ReactNode} [afterContent] Optional. Custom content to be rendered after the main content.
 */
export type FlowLayoutProps = LayoutBoxProps & CommonProps & {
  itemDTOs: ItemDTOType[]
  containerProps?: Partial<LayoutBoxProps>
  defaultItemLayoutProps?: Partial<LayoutBoxProps>
  numColumns?: number
  beforeContent?: ReactNode
  afterContent?: ReactNode
};
