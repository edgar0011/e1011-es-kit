import { memo, PropsWithChildren, ReactNode,
  CSSProperties, useState, useEffect, useRef, useCallback, ReactElement } from 'react'
import { Meta } from '@storybook/react'

import { LayoutBox } from '../../container'
import { DividerLine } from '../../dividers'
import { Button } from '../../atoms/button/Button'

import { Popover as PopoverLite } from './PopoverLite'
import { PopoverPlacement, PopoverProps } from './popover.types'
import { Tooltip } from './Tooltip'
import classes from './popover.module.scss'

export default {
  title: 'e1011/molecules/Popover',
  component: PopoverLite,
} as Meta

const ParagraphSmall = memo(({ children, ...style }: PropsWithChildren & CSSProperties) => (
  <p style={style}>{children}</p>
))

ParagraphSmall.displayName = 'ParagraphSmall'

type TooltipContentProps = PropsWithChildren<any> & {
  forwardedRef: ForwardedRef
}

const TooltipContent = ({ forwardedRef, title, text }: TooltipContentProps): ReactElement => (
  <div ref={forwardedRef} className={classes['popover-tooltip']}>
    <div id='arrow' data-popper-arrow className={classes.arrow}>
      <div className={classes['arrow-inner']} />
    </div>
    <LayoutBox padding='1rem' direction='column'>
      {title && title}
      {text && <ParagraphSmall margin='0'>{text}</ParagraphSmall>}
    </LayoutBox>
  </div>
)

const popoverModifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 10],
      placement: 'top',
    },
  },
]

type StoryDataType = {
  title: string
  tooltip: string
  date: string
}

type Props = PopoverProps & { data: StoryDataType[] }

export const TooltipPopover = ({ data, ...args }: Props): ReactNode => (
  <LayoutBox width='100%' height='40rem' align='center' justify='space-around'>
    {data.map(({ title, tooltip, date, ...itemData }: StoryDataType) => (
      <PopoverLite {...args} key={title} data={itemData} modifiers={popoverModifiers}>
        <Button style={{ marginBottom: 0 }}>{title}</Button>
        <TooltipContent title={tooltip} text={date} />
      </PopoverLite>
    ))}
  </LayoutBox>
)

TooltipPopover.args = {
  hoverable: true,
  clickable: true,
  placement: 'top',
  data: [
    {
      title: 'Jessica F.',
      tooltip: 'Jessica Fergusson',
      date: 'yesterday 12:58',
    },
    {
      title: 'Sienna M.',
      tooltip: 'Sienna Miller',
      date: '12.8.2021',
    },
  ],
}

export const TooltipPopoverCompact = ({ data, ...args }: Props): ReactNode => (
  <LayoutBox direction='column' gap='1rem'>
    <LayoutBox width='100%' height='10rem' align='center' justify='space-around'>
      {data.map(({ title, tooltip, date }: StoryDataType) => (
        <Tooltip {...args} key={title} title={date} text={tooltip}>
          <Button style={{ marginBottom: 0 }}>{title}</Button>
        </Tooltip>
      ))}
    </LayoutBox>
    <LayoutBox width='100%' height='2rem' align='center' justify='space-around'>
      <Tooltip infoTip title='Info' text='Here are some tooltip example' />
    </LayoutBox>
    <LayoutBox width='100%' height='10rem' align='center' justify='space-between'>
      <Tooltip infoTip text='Here is info tooltip example' title='Info' clickable />
      <Tooltip infoTip text='Here is info tooltip example' />
    </LayoutBox>
  </LayoutBox>
)

TooltipPopoverCompact.args = {
  hoverable: true,
  clickable: true,
  placement: 'top',
  data: [
    {
      title: 'Jessica F.',
      tooltip: 'Jessica Fergusson',
      date: 'yesterday 12:58',
    },
    {
      title: 'Sienna M.',
      tooltip: 'Sienna Miller',
      date: '12.8.2021',
    },
  ],
}

export const TooltipLitePopover = (args: Props): ReactNode => (
  <LayoutBox width='100%' height='40rem' align='center' justify='space-around'>
    <PopoverLite {...args}>
      <h3>Some long title</h3>
      <LayoutBox className={classes['popover-container-lite']}>Some long title, even longer sub title</LayoutBox>
    </PopoverLite>
  </LayoutBox>
)

TooltipLitePopover.args = {
  hoverable: true,
  clickable: true,
  placement: 'top',
}

/*
Popover with custom component as content
*/

type CustomPopoverContentProps = PropsWithChildren<any> & {
  forwardedRef: ForwardedRef
}

const CustomPopoverContent = memo(function ContentComponent({
  forwardedRef,
  hide,
  ...props
}: CustomPopoverContentProps) {
  return (
    <LayoutBox className={`${classes['popover-container']}`} ref={forwardedRef}>
      <LayoutBox direction='column' className={`${classes['popover-container-inner']}`}>
        <LayoutBox justify='space-between' align='baseline' width='100%'>
          Info
          <Button variant='link' onClick={hide}>
            X
          </Button>
        </LayoutBox>
        <DividerLine length='100%' />
        <LayoutBox width='100%'>{JSON.stringify(props)}</LayoutBox>
        <DividerLine length='100%' />
        <Button variant='info' onClick={hide}>
          Bye
        </Button>
      </LayoutBox>
    </LayoutBox>
  )
})

const popoverComponents2: PopoverProps['components'] = {
  ContentComponent: CustomPopoverContent,
}

type Props2 = PopoverProps & { buttonTitle: string; popupIsOpen?: boolean }

export const CustomContentPopover = ({ buttonTitle, popupIsOpen, ...args }: Props2): ReactNode => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>()

  const [isOpen, setIsOpen] = useState<boolean | undefined>(popupIsOpen)

  useEffect(() => {
    setIsOpen(popupIsOpen)
  }, [popupIsOpen])

  useEffect(() => {
    setModalContainer(containerRef?.current)
  }, [])

  const openHandler = useCallback(() => {
    setIsOpen(true)
  }, [])

  const hideHandler = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <LayoutBox
      direction='column'
      justify='center'
      align='center'
      width='100%'
      height='100%'
      ref={containerRef}
      style={{ border: '1px solid red' }}
    >
      <LayoutBox justify='center' align='center' width='100%' height='16rem'>
        SPACE
      </LayoutBox>
      <PopoverLite
        {...args}
        isOpen={isOpen}
        onOpen={openHandler}
        onHide={hideHandler}
        someData={[1, 2, 3, { name: 'LASTITEM' }]}
        components={popoverComponents2}
        modalContainer={modalContainer}
      >
        <Button style={{ marginBottom: 0 }}>{buttonTitle}</Button>
      </PopoverLite>
    </LayoutBox>
  )
}

CustomContentPopover.args = {
  hoverable: false,
  clickable: true,
  placement: PopoverPlacement.TopStart,
  buttonTitle: 'Open me',
  popupIsOpen: false,
}

export const CustomContentPopoverDeclarative = ({ buttonTitle, ...args }: Props2): ReactNode => (
  <LayoutBox direction='column' justify='center' align='center' width='100%' height='100%'>
    <LayoutBox justify='center' align='center' width='100%' height='16rem'>
      SPACE
    </LayoutBox>
    <PopoverLite {...args}>
      <Button style={{ marginBottom: 0 }}>{buttonTitle}</Button>
      <CustomPopoverContent someData={[1, 2, 3, { name: 'LASTITEM' }]} />
    </PopoverLite>
  </LayoutBox>
)

CustomContentPopoverDeclarative.args = {
  hoverable: false,
  clickable: true,
  placement: PopoverPlacement.TopStart,
  buttonTitle: 'Open me',
}
