import { StoryFn as Story, Meta } from '@storybook/react'

import { LayoutBox } from '../../../ui/components'
import { LayoutBoxProps } from '../../../ui'
import { delay } from '../../..'

import { StoreWithActions, createStore } from './store.vanillajs'
import { useStore } from './useStore.react'

export default {
  title: 'e1011/core/utils/appState/store',
  component: LayoutBox,
} as Meta


type CounterState = {
  counter: number
}
const counterState: StoreWithActions<CounterState> = createStore<CounterState>(
  {
    counter: 0,
  },
  {
    increase: async (getState, setState) => {
      await delay(300)
      setState({
        counter: (getState?.()?.counter ?? 0) + 1,
      })
    },

    decrease: async (getState, setState) => {
      await delay(1000)
      setState({
        counter: (getState?.()?.counter ?? 0) - 1,
      })
    },
  },
) as StoreWithActions<CounterState>

const ComponentA: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const { counter } = useStore(counterState)

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' {...args}>
      ComponentA
      <div />
      counter: {counter}
      <button type='button' onClick={counterState.actions.increase}>Increase</button>
      {children && children}
    </LayoutBox>
  )
}

const ComponentB: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const { counter } = useStore(counterState)

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' {...args}>
      ComponentB
      <div />
      counter: {counter}
      <button type='button' onClick={counterState.actions.decrease}>Decrease</button>
      {children && children}
    </LayoutBox>
  )
}


const StoreUseExampleTemplate: Story<any> = () => (
  <LayoutBox width='800px' gap='10rem'>
    <ComponentA />
    <ComponentB />
  </LayoutBox>
)

export const StoreUseExample = StoreUseExampleTemplate.bind({})
StoreUseExample.args = {}
