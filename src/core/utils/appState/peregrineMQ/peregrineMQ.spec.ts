/**
 * @jest-environment jsdom
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { delay } from '../../helpers'

import { PeregrineMQClearError } from './peregrineMQ'

import { peregrineMQInstance as peregrineMQ } from './index'


describe('PeregrineMQ main spec', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const function1 = jest.fn((channel, data) => undefined)

  beforeEach(() => {
    peregrineMQ.configure({ allowAutoPrune: false, allowClear: true })

    peregrineMQ.clear()
  })

  it('should act as basic state machine', () => {
    const initState = { counter: 0 }
    const store = {
      state: {
        ...initState,
      },
      increase: (): void => {
        store.state.counter += 1
        peregrineMQ.publish('store.stateUpdated', store.state)
      },
      decrease: (): void => {
        store.state.counter -= 1
        peregrineMQ.publish('store.stateUpdated', store.state)
      },
    }

    peregrineMQ.subscribe('store.increase', store.increase)
    peregrineMQ.subscribe('store.decrease', store.decrease)
    peregrineMQ.subscribe('store.decrease', store.decrease)

    expect(store.state.counter).toEqual(0)

    peregrineMQ.publish('store.increase')
    peregrineMQ.publish('store.increase')

    expect(store.state.counter).toEqual(2)


    peregrineMQ.publish('store.decrease')
    peregrineMQ.publish('store.decrease')

    expect(store.state.counter).toEqual(0)
  })

  it('must clear all subscriptions', () => {
    const channels = ['topic', 'topic.login', 'topic.login.form']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function1)
    peregrineMQ.subscribe(channels[2], function1)

    expect(peregrineMQ.length).toEqual(3)

    peregrineMQ.clear()

    expect(peregrineMQ.length).toEqual(0)
  })

  it('must throw exception when allowClear not set to true', () => {
    const channels = ['topic', 'topic.login', 'topic.login.form']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function1)
    peregrineMQ.subscribe(channels[2], function1)

    expect(peregrineMQ.length).toEqual(3)

    peregrineMQ.configure({ allowAutoPrune: false, allowClear: false })

    expect(() => {
      peregrineMQ.clear()
    }).toThrow(new PeregrineMQClearError())
  })

  it('should prune channels without listeners', () => {
    const channels = ['topic', 'topic.login', 'topic.login.form']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function1)
    peregrineMQ.subscribe(channels[2], function1)

    expect(peregrineMQ.getChannels()).toEqual(channels)

    peregrineMQ.unsubscribe(function1, { channel: channels[1] })

    expect(peregrineMQ.getChannels().length).toBe(3)

    const prunedChannels = peregrineMQ.prune()

    expect(prunedChannels).toEqual(['topic.login'])
    expect(peregrineMQ.getChannels()).toEqual(['topic', 'topic.login.form'])
    expect(peregrineMQ.getChannels().length).toBe(2)
  })

  it('should auto prune channels without listeners', async () => {
    expect.assertions(4)
    const channels = ['topic', 'topic.login', 'topic.login.form']

    const { clearPruneInterval } = peregrineMQ.configure({ allowAutoPrune: true, pruneInterval: 100 })

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function1)
    peregrineMQ.subscribe(channels[2], function1)

    expect(peregrineMQ.getChannels()).toEqual(channels)

    expect(peregrineMQ.getChannels().length).toBe(3)
    peregrineMQ.unsubscribe(function1, { channel: channels[1] })

    await delay(2000)

    expect(peregrineMQ.getChannels()).toEqual(['topic', 'topic.login.form'])
    expect(peregrineMQ.getChannels().length).toBe(2)

    clearPruneInterval?.()
  })

  it('should be able to remove channel', () => {
    const channels = ['topic', 'topic.login', 'topic.login.form']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function1)
    peregrineMQ.subscribe(channels[2], function1)
    peregrineMQ.subscribe(channels[2], () => undefined)
    peregrineMQ.subscribe(channels[2], () => undefined)

    expect(peregrineMQ.length).toBe(5)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(3)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(3)
    expect(peregrineMQ.getChannels()).toEqual(channels)

    peregrineMQ.removeChannel('topic.login.form')

    expect(peregrineMQ.length).toBe(2)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(1)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(2)
    expect(peregrineMQ.getChannels().length).toBe(2)
  })
})
