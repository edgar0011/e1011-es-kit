import { memo, FC, useMemo, PropsWithChildren } from 'react'
// import { DividerHorizontal, LayoutBox, IconBase } from '@e1011/es-kit'



import { HeadlineTertiary as H3, ParagraphSmall } from '../../atoms/text'
import { DividerHorizontal } from '../../dividers'
import { LayoutBox } from '../../container'
import { IconBase } from '../../icon'
import infoIcon from '../../../../../assets/icons/circle-info.svg'
import closeIcon from '../../../../../assets/icons/circle-xmark.svg'

import { Popover } from './PopoverLite'
import { PopoverPlacement, PopoverProps } from './popover.types'
import classes from './tooltip.module.scss'


/**

Props for the Tooltip component, extends PopoverProps.
@typedef {Object} TooltipProps
@property {Record<string, unknown>} [tooltipProps] - Additional props to be passed to the underlying Popover component.
@extends PopoverProps
*/
export type TooltipProps = PopoverProps & {
  tooltipProps?: Record<string, unknown>
  infoIconUrl?: string
}


/**

Modifiers for the Popover component used in Tooltip.
*/
const popoverModifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 10],
      placement: PopoverPlacement.Top,
    },
  },
]

/**

Props for the TooltipContent component.
@typedef {Object} TooltipContentProps
@property {ForwardedRef} forwardedRef - Forwarded ref of the TooltipContent component.
@property {string} title - Title of the tooltip.
@property {string} text - Text content of the tooltip.
@property {Function} hide - Function to hide the tooltip.
@property {boolean} showClose - Determines whether to show a close button in the tooltip.
@extends PropsWithChildren
*/
type TooltipContentProps = PropsWithChildren<any> & {
  forwardedRef: ForwardedRef
  closeIconUrl?: string
}

/**

  Tooltip content component used by the Tooltip component.
  @param {TooltipContentProps} props - Props for the TooltipContent component.
  @returns {JSX.Element} - Returns the JSX element for the TooltipContent component.
  */
const TooltipContent = ({
  forwardedRef, title, text, hide, showClose, closeIconUrl,
}: TooltipContentProps): JSX.Element => (
  <div
    ref={forwardedRef}
    className={classes['popover-tooltip']}
  >
    <div id='arrow' data-popper-arrow className={classes.arrow}>
      <div className={classes['arrow-inner']} />
    </div>
    <LayoutBox
      padding='1rem'
      direction='column'
      width='256px'
      height='unset'
      flexGrow='1'
    >
      {title && (
        <LayoutBox justify='space-between' align='start' width='100%' padding='0'>
          <H3>{title}</H3>
          {showClose && (
            <div
              onClick={hide}
              onKeyDown={hide}
              role='button'
              tabIndex={-1}
              className={classes['close-button']}
            >
              <IconBase iconUrl={closeIconUrl || closeIcon} />
            </div>
          )}
        </LayoutBox>
      )}
      {title && <DividerHorizontal margin='8px 0' />}
      {text && <ParagraphSmall element='p'>{text}</ParagraphSmall>}
    </LayoutBox>
  </div>
)

/**
 * A tooltip component that displays a short message when the user hovers or clicks on a target element.
 *
 * @param tooltipProps - Optional properties to be passed down to the `Popover` component.
 * @param components - Optional components that can be customized by the consumer.
 * @param children - The target element that the tooltip will be anchored to.
 * @param infoTip - If no `children` prop is passed in, an information icon will be used as the target element.
 * @param clickable - If `true`, the tooltip will be triggered by a click instead of a hover.
 * @param hoverable - If `true`, the tooltip will be triggered by a hover. Defaults to `true`.
 * @param placement - The placement of the tooltip relative to the target element.
 * @param modifiers - Optional modifiers to be passed down to the `Popover` component.
 */
export const Tooltip: FC<TooltipProps> = memo<TooltipProps>(({
  tooltipProps, components: { ContentComponent } = { ContentComponent: TooltipContent },
  infoIconUrl,
  children, infoTip, clickable = false, hoverable = true, placement = 'top', modifiers, ...props
}: TooltipProps) => {
  const popoverComponents = useMemo(() => (ContentComponent ? {
    ContentComponent,
  } : undefined), [ContentComponent])

  let TargetNode: typeof children

  if (children) {
    TargetNode = children
  }
  if (!children && infoTip) {
    TargetNode = (
      <IconBase iconUrl={infoIconUrl || infoIcon} size='1rem' color='#00336640' style={{ lineHeight: '1px' }} />
    )
  }

  const mergedModifiers = useMemo(() => ([...popoverModifiers, ...(modifiers || [])]), [modifiers])

  return (
    <Popover
      {...props}
      {...tooltipProps}
      hoverable={hoverable}
      clickable={clickable}
      placement={placement}
      modifiers={mergedModifiers}
      components={popoverComponents}
      showClose={clickable}
    >
      {TargetNode && TargetNode}
    </Popover>
  )
})

/**
 * The display name of the Tooltip component.
 *
 * @type {string}
 */
Tooltip.displayName = 'Tooltip'

