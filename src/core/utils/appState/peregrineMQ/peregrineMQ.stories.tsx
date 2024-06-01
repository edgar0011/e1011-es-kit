import { StoryFn as Story, Meta } from '@storybook/react'
import { useCallback, useEffect } from 'react'

import { LayoutBox } from '../../../ui/components'
import { LayoutBoxProps } from '../../../ui'
import { delay } from '../../..'

import { Callback } from './peregrineMQ.types'
import { PeregrineMQ } from './peregrineMQ'

import peregrineMQ from './index'

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

const usePeregrineSubscribe = (peregrineInstance: PeregrineMQ, channel: string, callback: Callback): void => {
  const memCallback = useCallback(callback, [callback])

  useEffect(() => {
    const unsubscribe = peregrineInstance.subscribe(channel, memCallback)

    return (): void => {
      unsubscribe()
    }
  }, [memCallback, channel, peregrineInstance])
}

const ComponentA: Story<LayoutBoxProps> = ({ children, ...args }: LayoutBoxProps) => {
  const storeUpdateIncreaseHandler = useCallback((...args: [string, unknown]) => {
    console.log('ComponentA storeUpdateIncreaseHandler', args)
  }, [])

  const storeUpdateDecreasHandler = useCallback((...args: [string, unknown]) => {
    console.log('ComponentA storeUpdateDecreasHandler', args)
  }, [])

  usePeregrineSubscribe(peregrineMQ, 'store.stateUpdated', (...args) => {
    console.log('ComponentA storeStateUpdateHandler', args)
  })

  usePeregrineSubscribe(peregrineMQ, 'store', (...args) => {
    console.log('ComponentA storeTopicHandler', args)
  })

  const increase = useCallback(() => peregrineMQ.publish('store.increase'), [])
  // const decrease = useCallback(() => peregrineMQ.publish('store.decrease'), [])

  useEffect(() => {
    const unsubscribeIncrease = peregrineMQ.subscribe('store.increase', storeUpdateIncreaseHandler)
    const unsubscribeDecrease = peregrineMQ.subscribe('store.decrease', storeUpdateDecreasHandler)

    return (): void => {
      unsubscribeIncrease()
      unsubscribeDecrease()
    }
  }, [storeUpdateDecreasHandler, storeUpdateIncreaseHandler])

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
  const storeUpdateIncreaseHandler = useCallback((...args: [string, unknown]) => {
    console.log('ComponentB storeUpdateIncreaseHandler', args)
  }, [])

  const storeUpdateDecreasHandler = useCallback((...args: [string, unknown]) => {
    console.log('ComponentB storeUpdateDecreasHandler', args)
  }, [])

  usePeregrineSubscribe(peregrineMQ, 'store.stateUpdated', (...args) => {
    console.log('ComponentB storeStateUpdateHandler', args)
  })

  usePeregrineSubscribe(peregrineMQ, 'store', (...args) => {
    console.log('ComponentB storeTopicHandler', args)
  })


  // const increase = useCallback(() => peregrineMQ.publish('store.increase'), [])
  const decrease = useCallback(() => peregrineMQ.publish('store.decrease'), [])

  useEffect(() => {
    const unsubscribeIncrease = peregrineMQ.subscribe('store.increase', storeUpdateIncreaseHandler)
    const unsubscribeDecrease = peregrineMQ.subscribe('store.decrease', storeUpdateDecreasHandler)

    return (): void => {
      unsubscribeIncrease()
      unsubscribeDecrease()
    }
  }, [storeUpdateDecreasHandler, storeUpdateIncreaseHandler])

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
