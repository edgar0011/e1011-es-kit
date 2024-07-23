import { StoryFn as Story, Meta } from '@storybook/react'
import { useCallback, useState } from 'react'

import { LayoutBox } from '../ui/components/container/layoutBox/LayoutBox'
import { LayoutBoxProps } from '../ui/components/container/layoutBox/layoutBox.types'

import { useTimeoutFn } from './useSetTimeout'



export default {
  title: 'e1011/core/hooks',
  component: LayoutBox,
} as Meta

const ComponentA: Story<LayoutBoxProps> = ({ ...args }: LayoutBoxProps) => {
  const [isShowing, setIsShowing] = useState(false)

  const [progress, setProgress] = useState(Math.random() * 30 + 70)

  const [, , resetIsShowing] = useTimeoutFn(() => {
    console.log('ComponentA set timeout callback')
    setIsShowing(true)
  }, 500)

  const butonClickHandler = useCallback(() => {
    setIsShowing(false)
    resetIsShowing()
    setProgress(Math.random() * 100)
  }, [resetIsShowing])

  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentA
      <div />
      <button type='button' onClick={butonClickHandler}>Click</button>
      <div />
      isShowing: {isShowing?.toString()}
      <div />
      <progress id='file' value={progress} max='100'> {progress}% </progress>
    </LayoutBox>
  )
}

const ComponentB: Story<LayoutBoxProps> = ({ ...args }: LayoutBoxProps) => {
  const [isShowing, setIsShowing] = useState(false)

  const [progress, setProgress] = useState(Math.random() * 30 + 70)

  const [, , resetIsShowing] = useTimeoutFn(() => {
    console.log('ComponentB set timeout callback')
    setIsShowing(true)
  }, 500)

  const butonClickHandler = useCallback(() => {
    setIsShowing(false)
    resetIsShowing()
    setProgress(Math.random() * 100)
  }, [resetIsShowing])

  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentB
      <div />
      <button type='button' onClick={butonClickHandler}>Click</button>
      <div />
      isShowing: {isShowing?.toString()}
      <div />
      <progress id='file' value={progress} max='100'> {progress}% </progress>
    </LayoutBox>
  )
}


const HooksUseExampleTemplate: Story<any> = () => (
  <LayoutBox column width='100%' gap='10rem'>
    <LayoutBox width='100%' gap='10rem' justify='center'>
      <ComponentA />
      <ComponentB />
    </LayoutBox>
  </LayoutBox>
)

export const HooksUseExample = HooksUseExampleTemplate.bind({})
HooksUseExample.args = {}
