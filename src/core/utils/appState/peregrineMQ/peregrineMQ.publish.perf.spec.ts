/**
 * @jest-environment jsdom
 */
import { peregrineMQInstance as peregrineMQ } from './index'

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

describe.skip('PeregrineMQ publish method performance', () => {
  beforeAll(() => {
    peregrineMQ.configure({ allowClear: true })
  })

  beforeEach(() => {
    peregrineMQ.clear()
  })

  it('Perf: should be able to subscribe and publish 500 000 functions to channel', () => {
    const SIZE = 500000

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < SIZE; i++) {
      const func = jest.fn(() => undefined)

      peregrineMQ.subscribe('topic', func)
    }

    expect(peregrineMQ.length).toEqual(SIZE)

    peregrineMQ.publish('topic')
  })

  it('Perf: should be able to subscribe 1 000 000 random functions to random channels and publish', () => {
    const SIZE = 1000000

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < SIZE; i++) {
      const func = (): void => {}

      peregrineMQ.subscribe(`topic.channel-${i}`, func)
    }

    expect(peregrineMQ.length).toEqual(SIZE)

    console.time('PeregrineMQ publish test')

    // eslint-disable-next-line no-restricted-syntax
    for (const channel of peregrineMQ.getChannels()) {
      peregrineMQ.publish(channel)
    }

    console.timeEnd('PeregrineMQ publish test')
  })

  it('Perf: real-world scenario up to 500 channels and up to 10000 subscribers', () => {
    const CHANNEL_SIZE = randomNumber(100, 500)
    const listOfFunctions = []

    // eslint-disable-next-line no-plusplus
    for (let channelIndex = 0; channelIndex < CHANNEL_SIZE; channelIndex++) {
      const SIZE = randomNumber(100, 10000)

      // eslint-disable-next-line no-plusplus
      for (let subIndex = 0; subIndex < SIZE; subIndex++) {
        const func = (): void => {}

        listOfFunctions.push(func)
        peregrineMQ.subscribe(`topic.channel-${channelIndex}`, func)
      }
    }

    expect(peregrineMQ.length).toEqual(listOfFunctions.length)

    console.info(`PeregrineMQ Number of channels: ${CHANNEL_SIZE}`)
    console.info(`PeregrineMQ Number of listeners: ${listOfFunctions.length}`)
    console.time('PeregrineMQ publish test')

    // eslint-disable-next-line no-restricted-syntax
    for (const channel of peregrineMQ.getChannels()) {
      peregrineMQ.publish(channel)
    }

    console.timeEnd('PeregrineMQ publish test')
  })
})
