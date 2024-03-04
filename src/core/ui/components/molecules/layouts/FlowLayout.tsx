import { memo, FC, useMemo } from 'react'

import { LayoutBox } from '../../container'
import { classNames } from '../../../../utils'

import type { FlowLayoutProps, ItemDTOType } from './flowLayout.types'
import classes from './flowLayout.module.scss'


/**
 * Renders a flexible flow layout that automatically arranges child components based on specified columns and spacing.
 * This component is highly customizable through its props,
 * allowing for dynamic layouts responsive to the content and screen size.
 *
 * Utilizes a grid layout by default, falling back to flex layout
 * if `numColumns` is not greater than 0. Each item's width
 * and placement can be controlled via `spanColumn` on
 * individual items, with additional layout props provided for fine-tuning.
 *
 * @param {FlowLayoutProps} props The properties to configure the FlowLayout.
 * @param {ItemDTOType[]} props.itemDTOs Array of item DTOs defining the
 * components to render and their layout properties.
 * @param {Partial<LayoutBoxProps>} [props.containerProps={}] Optional.
 * Props to be spread onto the container `LayoutBox`, allowing for custom styles and behaviors.
 * @param {Partial<LayoutBoxProps>} [props.defaultItemLayoutProps={}] Optional.
 * Default layout properties applied to each item, unless overridden by item-specific props.
 * @param {number} [props.numColumns=1] Optional.
 *  Defines the number of columns in the grid. Affects item distribution and layout.
 * @param {string} [props.className=''] Optional.
 * Additional CSS class names to apply to the layout container for custom styling.
 * @param {ReactNode} [props.beforeContent] Optional.
 * Content to render before the main items. Useful for titles, descriptions, or custom components.
 * @param {ReactNode} [props.afterContent] Optional.
 Content to render after the main items. Can be used for additional information or actions related to the items.
 * @returns {React.ReactElement} The rendered FlowLayout component.
 */
export const FlowLayout: FC<FlowLayoutProps> = memo<FlowLayoutProps>(({
  itemDTOs,
  containerProps = {},
  defaultItemLayoutProps = {},
  numColumns = 1,
  className = '',
  beforeContent,
  afterContent,
  ...props
}: FlowLayoutProps) => {
  // Calculation for column styles based on the number of columns specified.
  const columnStyles = useMemo(() => (numColumns > 0
    ? {
      display: 'grid',
      gridTemplateColumns: `${'1fr '.repeat(numColumns)}`,
      width: '100%',
      height: 'unset',
    }
    : {
      display: 'flex',
    }
  ), [numColumns])

  return (
    <LayoutBox
      width='100%'
      column
      className={classNames(classes.flowLayout, className)}
      {...props}
    >
      {beforeContent && (
        <span className={classes.beforeContent} tabIndex={-1}>
          {beforeContent}
        </span>
      )}
      <LayoutBox
        flexWrap='wrap'
        gap='1rem'
        style={columnStyles}
        width='100%'
        {...containerProps}
      >
        {itemDTOs.map(({ id, spanColumn, Component, layoutProps, ...props }: ItemDTOType) => (
          <LayoutBox
            key={id}
            {...defaultItemLayoutProps}
            {...layoutProps}
            {...(spanColumn
              ? { style: { width: `calc(${Math.round(spanColumn * 100)}% - ${spanColumn * 16}px)` } }
              : {})}
          >
            <Component {...props} />
          </LayoutBox>
        ))}
      </LayoutBox>
      {afterContent && (
        <span className={classes.afterContent} tabIndex={-1}>
          {afterContent}
        </span>
      )}
    </LayoutBox>
  )
})

export type FlowLayoutType = typeof FlowLayout;

// Set display name for the component.
FlowLayout.displayName = 'FlowLayout'
