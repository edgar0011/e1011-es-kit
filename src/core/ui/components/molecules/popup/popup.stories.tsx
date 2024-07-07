import { useCallback, memo } from 'react'
import { StoryFn as Story, Meta } from '@storybook/react'

import { Paragraph as BodyText } from '../../atoms/text'
import { Button } from '../../atoms/button/Button'
import { LayoutBox } from '../../container'
import { useToggle } from '../../../../hooks'

import { Popup } from './Popup'
import { PopupProps } from './popup.types'


export default {
  title: 'e1011/molecules/popup/Popup',
  component: Popup,
} as Meta

const PopupContent = memo(function PopupContent({ hide, ...props }: any) {
  return (
    <LayoutBox width='100%' height='100%' direction='column' justify='space-between'>
      <BodyText height='100%'>
        {`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      `}
      </BodyText>
      <LayoutBox width='100%'>{JSON.stringify(props)}</LayoutBox>
      <LayoutBox width='100%' justify='end' padding='24px 0 0 0' gap='24px'>
        <Button variant='light' onClick={hide}>
          Cancel
        </Button>
        <Button onClick={hide}>Confirm</Button>
      </LayoutBox>
    </LayoutBox>
  )
})

const components = {
  ContentComponent: PopupContent,
}

const PopupTemplate: Story<PopupProps> = (args) => {
  const [isOpen, toggleIsOpen] = useToggle(false)

  const onOpenHandler = useCallback(() => {
    toggleIsOpen(true)
  }, [toggleIsOpen])

  const onHideHandler = useCallback(() => {
    toggleIsOpen(false)
  }, [toggleIsOpen])

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center'>
      <Button onClick={toggleIsOpen}>{`${isOpen ? 'Close' : 'Open'}`}</Button>
      <Popup {...args} isOpen={isOpen} data={[1, 2, 3, 'some data']} onOpen={onOpenHandler} onHide={onHideHandler} />
    </LayoutBox>
  )
}

export const PopupBase = PopupTemplate.bind({})
PopupBase.args = {
  components,
} as PopupProps

const PopupTemplateInline: Story<PopupProps> = (args) => {
  const [isOpen, toggleIsOpen] = useToggle(false)

  const hideHandler = useCallback(() => {
    toggleIsOpen(false)
  }, [toggleIsOpen])

  const onOpenHandler = useCallback(() => {
    toggleIsOpen(true)
  }, [toggleIsOpen])

  const onHideHandler = useCallback(() => {
    toggleIsOpen(false)
  }, [toggleIsOpen])

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center'>
      <Button onClick={toggleIsOpen}>{`${isOpen ? 'Close' : 'Open'}`}</Button>
      <Popup {...args} isOpen={isOpen} data={[1, 2, 3, 'some data']} onOpen={onOpenHandler} onHide={onHideHandler}>
        <LayoutBox width='100%' height='100%' direction='column' justify='space-between'>
          <BodyText height='100%'>
            {`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          `}
          </BodyText>
          <LayoutBox width='100%'>{JSON.stringify(args)}</LayoutBox>
          <LayoutBox width='100%' justify='end' padding='24px 0 0 0' gap='24px'>
            <Button variant='light' onClick={hideHandler}>
              Cancel
            </Button>
            <Button onClick={hideHandler}>Confirm</Button>
          </LayoutBox>
        </LayoutBox>
      </Popup>
    </LayoutBox>
  )
}

export const PopupInline = PopupTemplateInline.bind({})
PopupInline.args = {
  // components,
} as PopupProps
