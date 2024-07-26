import { StoryFn as Story, Meta } from '@storybook/react'
import { useMemo } from 'react'

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
  increasePending?: boolean
  decreasePending?: boolean
}
const counterState: StoreWithActions<CounterState> = createStore<CounterState>(
  {
    counter: 0,
  },
  {
    increase: async (getState, setState) => {
      await delay(300)
      setState({
        ...getState?.(),
        counter: (getState?.()?.counter ?? 0) + 1,
      })
    },

    decrease: async (getState, setState) => {
      await delay(1000)
      setState({
        ...getState?.(),
        counter: (getState?.()?.counter ?? 0) - 1,
      })
    },
  },
) as StoreWithActions<CounterState>

const ComponentA: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const { counter, ...state } = useStore<CounterState>(counterState)

  const isPending = useMemo(() => (state as any).increasePending || (state as any).decreasePending, [state])

  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentA
      <div />
      counter: {counter}
      {isPending && <span>Pending...</span>}
      <div />
      state.increasePending: {state.increasePending?.toString()}
      <button type='button' onClick={counterState.actions.increase}>Increase</button>
      {children && children}
    </LayoutBox>
  )
}

const ComponentB: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const { counter, ...state } = useStore(counterState)

  const isPending = useMemo(() => (state as any).increasePending || (state as any).decreasePending, [state])

  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentB
      <div />
      counter: {counter}
      {isPending && <span>Pending...</span>}
      <div />
      state.decreasePending: {state.decreasePending?.toString()}
      <button type='button' onClick={counterState.actions.decrease}>Decrease</button>
      {children && children}
    </LayoutBox>
  )
}

const ComponentC: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const counter = useStore(counterState, (state) => state.counter)

  const counterAllState = useStore(counterState)

  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentC
      <div />
      counter: {counter?.toString()}
      {children && children}
      <div />
      counterAllState: {JSON.stringify(counterAllState, null, 2)}
    </LayoutBox>
  )
}


const ComponentD: Story<LayoutBoxProps> = ({ ...args }: LayoutBoxProps) => {
  const increasePending = useStore(counterState, (state) => state.increasePending)


  return (
    <LayoutBox justify='center' align='center' direction='column' {...args}>
      ComponentD
      increasePending: {JSON.stringify(increasePending, null, 2)}
    </LayoutBox>
  )
}



const StoreUseExampleTemplate: Story<any> = () => (
  <LayoutBox column width='100%' gap='10rem'>
    <LayoutBox width='100%' gap='10rem' justify='center'>
      <ComponentA />
      <ComponentB />
    </LayoutBox>
    <LayoutBox width='100%' gap='10rem' justify='center'>
      <ComponentC />
    </LayoutBox>
    <LayoutBox width='100%' gap='10rem' justify='center'>
      <ComponentD />
    </LayoutBox>
  </LayoutBox>
)

export const StoreUseExample = StoreUseExampleTemplate.bind({})
StoreUseExample.args = {}
