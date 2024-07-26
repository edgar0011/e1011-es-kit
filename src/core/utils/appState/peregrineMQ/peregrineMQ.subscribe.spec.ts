/**
 * @jest-environment jsdom
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { peregrineMQInstance as peregrineMQ } from './index'

describe('PeregrineMQ subscribe method', () => {
  const function1 = (): void => {}
  const function2 = (): void => {}
  const function3 = (): void => {}

  beforeAll(() => {
    peregrineMQ.configure({ allowClear: true })
  })

  beforeEach(() => {
    peregrineMQ.clear()
  })

  it('should add subscribers and return total number', () => {
    expect(peregrineMQ.length).toEqual(0)

    peregrineMQ.subscribe('login', function1)
    peregrineMQ.subscribe('login', function2)
    peregrineMQ.subscribe('login', function1)

    expect(peregrineMQ.length).toEqual(2)

    peregrineMQ.subscribe('registration', function1)
    expect(peregrineMQ.length).toEqual(3)
  })

  it('should be able to unsubcribe from channel', () => {
    peregrineMQ.subscribe('login', function1)
    const unsubscribeFuntion1 = peregrineMQ.subscribe('login', function2)

    expect(peregrineMQ.length).toEqual(2)
    unsubscribeFuntion1()

    expect(peregrineMQ.length).toEqual(1)
  })

  it('should be able to unsubcribe from only one channel', () => {
    peregrineMQ.subscribe('login', function1)
    const unsubscribeFuntion2 = peregrineMQ.subscribe('topic.login', function2)

    peregrineMQ.subscribe('topic.registration', function2)

    expect(peregrineMQ.length).toEqual(3)
    unsubscribeFuntion2()

    expect(peregrineMQ.length).toEqual(2)
  })

  it('should be able to return if function is subscribed to channel', () => {
    peregrineMQ.subscribe('login', function1)

    expect(peregrineMQ.isSubscribed(function2)).toBeFalsy()

    peregrineMQ.subscribe('login', function2)
    expect(peregrineMQ.isSubscribed(function2)).toBeTruthy()

    expect(peregrineMQ.isSubscribed(function2, 'registration')).toBeFalsy()
    peregrineMQ.subscribe('registration', function2)
    expect(peregrineMQ.isSubscribed(function2, 'registration')).toBeTruthy()
  })

  it('should be able to unsubcribe from all channels', () => {
    peregrineMQ.subscribe('topic', function1)
    peregrineMQ.subscribe('topic.login', function2)
    peregrineMQ.subscribe('topic.login', function3)
    peregrineMQ.subscribe('topic.registration', function3)
    peregrineMQ.subscribe('topic.dashboard', function3)

    expect(peregrineMQ.length).toEqual(5)

    peregrineMQ.unsubscribe(function3)

    expect(peregrineMQ.length).toEqual(2)
  })

  it('should be able to unsubcribe from specific channel and prune if no subscribers left', () => {
    peregrineMQ.subscribe('topic', function1)
    peregrineMQ.subscribe('topic.login', function2)
    peregrineMQ.subscribe('topic.login', function3)
    peregrineMQ.subscribe('topic.registration', function3)
    peregrineMQ.subscribe('topic.dashboard', function3)

    expect(peregrineMQ.getChannels().length).toBe(4)

    peregrineMQ.unsubscribe(function3, { channel: 'topic.login', prune: true })
    peregrineMQ.unsubscribe(function2, { channel: 'topic.login', prune: true })

    expect(peregrineMQ.getChannels().length).toBe(3)
  })

  it('should be able to unsubcribe from channel and prune if no subscribers left', () => {
    peregrineMQ.subscribe('topic', function1)
    peregrineMQ.subscribe('topic.login', function2)
    peregrineMQ.subscribe('topic.login', function3)
    peregrineMQ.subscribe('topic.registration', function3)
    peregrineMQ.subscribe('topic.dashboard', function3)

    expect(peregrineMQ.getChannels().length).toBe(4)

    peregrineMQ.unsubscribe(function3, { prune: true })
    peregrineMQ.unsubscribe(function2, { prune: true })

    expect(peregrineMQ.getChannels().length).toBe(1)
  })

  it('Must be able to maintaine internal state with unsubscribe of channels', () => {
    const SIZE = 1000
    const listOfOddFunctions = []
    const listOfEvenFunctions = []

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < SIZE; i++) {
      const func = (): void => {}

      if (i % 2) {
        listOfOddFunctions.push(peregrineMQ.subscribe('topic.oddchannel', func))
      } else {
        listOfEvenFunctions.push(peregrineMQ.subscribe('topic.evenChannel', func))
      }
    }

    expect(peregrineMQ.length).toEqual(SIZE)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(SIZE)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(2)

    for (const func of listOfEvenFunctions) {
      func()
    }

    expect(peregrineMQ.length).toEqual(SIZE - listOfEvenFunctions.length)
    // @ts-ignore
    expect(peregrineMQ.listeners.size).toEqual(SIZE - listOfEvenFunctions.length)
    // @ts-ignore
    expect(peregrineMQ.channels.size).toEqual(1)
  })
})
