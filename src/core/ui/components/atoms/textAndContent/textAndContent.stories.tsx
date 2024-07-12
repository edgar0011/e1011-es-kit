import { MouseEvent } from 'react'
import { StoryFn as Story, Meta } from '@storybook/react'

import {
  appStoreIcon as iconA,
  batteryEmptyIcon as iconB,
  elementorIcon as iconC,
  squareCheckIcon as iconD,
} from '../icons'
import { DividerHorizontal } from '../../dividers'
import { Link } from '../text/Link'
import { LayoutBox } from '../../container'

import type { TextAndContentProps } from './textAndContent.types'
import { TextAndContent, TextAndIcons } from './TextAndContent'


export default {
  title: 'e1011/atoms/textAndContent/TextAndContent',
  component: TextAndContent,
} as Meta

const TextAndContentTemplate: Story<TextAndContentProps> = (args) => (
  <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' gap='1rem'>
    <LayoutBox {...args}>
      <TextAndContent>Text inside Text And Content</TextAndContent>
    </LayoutBox>

    <DividerHorizontal />

    <LayoutBox {...args}>
      <TextAndContent
        rightContent={<Link href='https://www.google.com' target='_blank'>Google.com</Link>}
      >
        Text inside Text And Content With Link
      </TextAndContent>
    </LayoutBox>
  </LayoutBox>
)

export const TextAndContentBase = TextAndContentTemplate.bind({})
TextAndContentBase.args = {
  width: '200px',
}


export const TextAndContentComplex = TextAndContentTemplate.bind({})
TextAndContentComplex.args = {
  width: 'unset',
  border: '1px solid var(--bs-primary)',
  padding: '1rem',
  borderRadius: '4px',
  boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.2)',
}

const leftIconClickHandler = (event?: MouseEvent): void => console.log('Left Icon Click', event)
const rightIconClickHandler = (event?: MouseEvent): void => console.log('Right Icon Click', event)


export const TextAndIconsBase: Story<TextAndContentProps> = (args) => (
  <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' gap='1rem'>
    <LayoutBox {...args}>
      <TextAndIcons
        iconLeft={iconA}
        iconRight={iconB}
        iconSize='1rem'
      // align vertically in center when having icons taller then text
        align='center'
        onRightIconClick={rightIconClickHandler}
        onLeftIconClick={leftIconClickHandler}
      >
        Longer Text inside Text And Icons
      </TextAndIcons>

      <TextAndIcons
        iconLeft={iconC}
      >
        <Link target='_blank' href='https://www.google.com'>Sign In</Link>
      </TextAndIcons>
      <TextAndIcons
        iconLeft={iconD}
        onLeftIconClick={leftIconClickHandler}
      >
        <Link target='_blank' href='https://www.google.com'>Sign Up</Link>
      </TextAndIcons>
    </LayoutBox>
  </LayoutBox>
)

TextAndIconsBase.args = {
  width: 'unset',
  gap: '1rem',
}
