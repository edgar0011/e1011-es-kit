import { StoryFn as Story, Meta } from '@storybook/react'

import { LayoutBox } from '../../container'

import { AnimatedSnippet } from './AnimatedSnippet'


const valToFixed2 = (val: number | string): string | number => (parseFloat(`${val}`)).toFixed(2)

export default {
  title: 'e1011/atoms/animatedSnippet/AnimatedSnippet',
  component: LayoutBox,
} as Meta

const AnimatedSnippetTemplate: Story<any> = () => (
  <LayoutBox column width='100%' gap='10rem'>
    <AnimatedSnippet end={10} roundingFn={valToFixed2} />
  </LayoutBox>
)

export const AnimatedSnippetExample = AnimatedSnippetTemplate.bind({})
AnimatedSnippetExample.args = {}
