import { StoryFn as Story, Meta } from '@storybook/react'
import { useCallback } from 'react'

import { LayoutBox } from '../../../container'

import type { AnchorLinkProps } from './anchorLink.types'
import { AnchorLink } from './AnchorLink'


export default {
  title: 'e1011/atoms/button/anchor-link/AnchorLink',
  component: AnchorLink,
} as Meta

const AnchorLinkTemplate: Story<AnchorLinkProps> = (args) => {
  const clickHandler = useCallback(() => alert('clicked'), [])

  return (
    <LayoutBox width='200px' height='100%' justify='center' align='center' flexDirection='column' gap='8px'>
      <AnchorLink {...args}>AnchorLink as children</AnchorLink>
      <AnchorLink {...args} text='AnchorLink as text prop' />
      <AnchorLink {...args} text='AnchorLink with onClick' onClick={clickHandler} />
      <AnchorLink {...args} text='AnchorLink with href' href='#' target='_cui' />
    </LayoutBox>
  )
}

export const AnchorLinkBase = AnchorLinkTemplate.bind({})
AnchorLinkBase.args = {}
