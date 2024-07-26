/**
 * @jest-environment jsdom
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { peregrineMQInstance as peregrineMQ } from './index'

describe.skip('PeregrineMQ subscribe method performance', () => {
  const function1 = (): void => {}

  beforeAll(() => {
    peregrineMQ.configure({ allowClear: true })
  })

  beforeEach(() => {
    peregrineMQ.clear()
  })

  it('Perf: should be able to subscribe 1 000 000 functions to channels', () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 1000000; i++) {
      peregrineMQ.subscribe(`topic.channel-${i}`, function1)
    }

    expect(peregrineMQ.length).toEqual(1000000)

    peregrineMQ.unsubscribe(function1)

    expect(peregrineMQ.length).toEqual(0)
  })

  it('Perf: should be able to subscribe 1 000 000 random functions to random channels', () => {
    const SIZE = 1000000
    const listOfFunctions = Array(SIZE).fill(null)

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < SIZE; i++) {
      const func = (): void => {}

      listOfFunctions[i] = func
      peregrineMQ.subscribe(`topic.channel-${i}`, func)
    }

    expect(peregrineMQ.length).toEqual(SIZE)

    console.time('PeregrineMQ unsubscribe test')
    const lastFunction = listOfFunctions.pop()

    peregrineMQ.unsubscribe(lastFunction)

    expect(peregrineMQ.length).toEqual(SIZE - 1)

    for (const func of listOfFunctions) {
      peregrineMQ.unsubscribe(func)
    }

    console.timeEnd('PeregrineMQ unsubscribe test')

    expect(peregrineMQ.length).toEqual(0)
  })

  it(`Perf: should be able to subscribe 1 000 000 random functions torandom
    channels and unsubscribe with handler`, () => {
    const SIZE = 1000000
    const unsubscribeHandlers = []

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < SIZE; i++) {
      const func = (): void => {}

      unsubscribeHandlers.push(peregrineMQ.subscribe(`topic.channel-${i}`, func))
    }

    expect(peregrineMQ.length).toEqual(SIZE)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(SIZE)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(SIZE)

    console.time('PeregrineMQ unsubscribe test')

    for (const func of unsubscribeHandlers) {
      func()
    }

    console.timeEnd('PeregrineMQ unsubscribe test')

    expect(peregrineMQ.length).toEqual(0)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(0)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(0)
  })

  it('Perf: real-world scenario up to 500 channels and up to 10000 subscribers', () => {
    const CHANNEL_SIZE = Math.floor(Math.random() * 500)
    const listOfFunctions = []

    // eslint-disable-next-line no-plusplus
    for (let channelIndex = 0; channelIndex < CHANNEL_SIZE; channelIndex++) {
      const SIZE = Math.floor(Math.random() * 10000)

      // eslint-disable-next-line no-plusplus
      for (let subIndex = 0; subIndex < SIZE; subIndex++) {
        const func = (): void => {}

        listOfFunctions.push(func)
        peregrineMQ.subscribe(`topic.channel-${channelIndex}`, func)
      }
    }

    expect(peregrineMQ.length).toEqual(listOfFunctions.length)

    console.time('PeregrineMQ unsubscribe test')

    for (const func of listOfFunctions) {
      peregrineMQ.unsubscribe(func)
    }

    console.timeEnd('PeregrineMQ unsubscribe test')

    expect(peregrineMQ.length).toEqual(0)
  })
})
