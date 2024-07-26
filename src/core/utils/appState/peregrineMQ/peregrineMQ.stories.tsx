import { StoryFn as Story, Meta } from '@storybook/react'
import { useCallback } from 'react'

import { LayoutBox } from '../../../ui/components'
import { LayoutBoxProps } from '../../../ui'
import { delay } from '../../..'

import { usePeregrineMQ } from './usePeregrineMQ.react'

import { peregrineMQInstance as peregrineMQ } from './index'

export default {
  title: 'e1011/core/utils/appState/peregrineMQ',
  component: LayoutBox,
} as Meta

const store = {
  state: {
    counter: 0,
  },
  increase: async (): Promise<void> => {
    await delay(1000)

    store.state.counter += 1
    peregrineMQ.publish('store.stateUpdated', store.state)
  },
  decrease: (): void => {
    store.state.counter -= 1
    peregrineMQ.publish('store.stateUpdated', store.state)
  },
}

peregrineMQ.configure({ allowAutoPrune: false, allowClear: true })

peregrineMQ.subscribe('store.increase', store.increase)
peregrineMQ.subscribe('store.decrease', store.decrease)


const ComponentA: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  usePeregrineMQ(peregrineMQ, 'store.increase', (...args) => {
    console.log('ComponentA storeUpdateIncreaseHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store.decrease', (...args) => {
    console.log('ComponentA storeUpdateDecreasHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store.stateUpdated', (...args) => {
    console.log('ComponentA storeStateUpdateHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store', (...args) => {
    console.log('ComponentA storeTopicHandler', args)
  })

  const increase = useCallback(() => peregrineMQ.publish('store.increase'), [])
  // const decrease = useCallback(() => peregrineMQ.publish('store.decrease'), [])

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' {...args}>
      ComponentA
      <div />
      {/* counter: {counter} */}
      <button type='button' onClick={increase}>Increase</button>
      {children && children}
    </LayoutBox>
  )
}

const ComponentB: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  usePeregrineMQ(peregrineMQ, 'store.increase', (...args) => {
    console.log('ComponentB storeUpdateIncreaseHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store.decrease', (...args) => {
    console.log('ComponentB storeUpdateDecreasHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store.stateUpdated', (...args) => {
    console.log('ComponentB storeStateUpdateHandler', args)
  })

  usePeregrineMQ(peregrineMQ, 'store', (...args) => {
    console.log('ComponentB storeTopicHandler', args)
  })
  // const increase = useCallback(() => peregrineMQ.publish('store.increase'), [])
  const decrease = useCallback(() => peregrineMQ.publish('store.decrease'), [])

  return (
    <LayoutBox width='100%' height='100%' justify='center' align='center' direction='column' {...args}>
      ComponentB
      <div />
      {/* counter: {counter} */}
      <button type='button' onClick={decrease}>Decrease</button>
      {children && children}
    </LayoutBox>
  )
}


const PeregrineMQUseExampleTemplate: Story<any> = () => (
  <LayoutBox width='800px' gap='10rem'>
    <ComponentA />
    <ComponentB />
  </LayoutBox>
)

export const PeregrineMQUseExample = PeregrineMQUseExampleTemplate.bind({})
PeregrineMQUseExample.args = {}
