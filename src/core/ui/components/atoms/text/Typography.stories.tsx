import { StoryFn as Story, Meta } from '@storybook/react'

import { LayoutBox } from '../../container'

import {
  Paragraph,
  ParagraphBold,
  ParagraphSmall,
  ParagraphBoldSmall,
  Headline,
  HeadlineSecondary,
  HeadlineTertiary,
  Text,
  Link,
} from './index'


export default {
  title: 'e1011/atoms/Typography',
  argTypes: {
    text: { control: 'text' },
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
    textAlign: { control: 'select', options: ['center', 'left', 'right', 'justify'] },
    width: { control: 'number' },
    maxWidth: { control: 'number' },
    lineHeight: { control: 'number' },
    whiteSpace: {
      options: ['nowrap', 'normal', 'pre', 'pre-line', 'pre-wrap', 'initial', 'inherit'],
      control: 'select',
    },
    className: {
      control: 'multi-select',
      options: ['text-truncate', 'overflow-hidden', 'text-nowrap', 'text-ellipsis'],
    },
  },
} as Meta

export const Typography: Story = ({ text, width, backgroundColor, ...props }) => {
  // storybook specific, multiselect knob control reulst fromatting
  // eslint-disable-next-line no-param-reassign
  props.className = props.className?.toString().replaceAll(',', ' ')

  return (
    <LayoutBox direction='column' backgroundColor={backgroundColor}>
      <Headline {...props} width={`${width}px`} cursor='pointer'>
        {text || 'Headline'}
      </Headline>
      <HeadlineSecondary {...props} width={`${width}px`}>
        {text || 'Headline secondary'}
      </HeadlineSecondary>
      <HeadlineTertiary {...props} width={`${width}px`}>
        {text || 'Headline tertiary'}
      </HeadlineTertiary>
      <br />
      <Text {...props} width={`${width}px`} cursor='pointer' element='h4'>
        {text || 'Headline h4'}
      </Text>
      <Text {...props} width={`${width}px`} cursor='pointer' element='h5'>
        {text || 'Headline h5'}
      </Text>
      <Text {...props} width={`${width}px`} cursor='pointer' element='h6'>
        {text || 'Headline h6'}
      </Text>
      <br />
      <Paragraph {...props} width={`${width}px`}>
        {text || 'Paragraph'}
      </Paragraph>
      <ParagraphBold {...props} width={`${width}px`}>
        {text || 'Paragraph bold'}
      </ParagraphBold>
      <ParagraphSmall {...props} width={`${width}px`} cursor='pointer'>
        {text || 'Paragraph small'}
      </ParagraphSmall>
      <ParagraphBoldSmall className='text-truncate' {...props} width={`${width}px`} cursor='pointer'>
        {text || 'Paragraph bold small'}
      </ParagraphBoldSmall>
      <Link href='www.google.com' target='_cui'>
        Link to
      </Link>
      <LayoutBox border='1px solid blue' maxWidth='200px'>
        <Link href='www.google.com' target='_cui'>
          Loooong Link to Loooong Link to Loooong Link to Loooong Link to
        </Link>
      </LayoutBox>
    </LayoutBox>
  )
}
