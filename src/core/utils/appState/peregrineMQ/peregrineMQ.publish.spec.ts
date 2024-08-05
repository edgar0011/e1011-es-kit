/**
 * @jest-environment jsdom
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { NON_EXISTENT_CHANNEL, peregrineMQInstance as peregrineMQ } from './index'

describe('PeregrineMQ publish method', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const function1 = jest.fn((channel, data) => ({ resultFunction1: true }))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const function2 = jest.fn(async (channel, data) => ({ resultFunction2: true }))

  beforeAll(() => {
    peregrineMQ.configure({ allowClear: true })
  })

  beforeEach(() => {
    peregrineMQ.clear()
  })

  it('publish method should call all parent descendants deeply', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    expect(function1.mock.calls).toHaveLength(0)
    expect(function2.mock.calls).toHaveLength(0)

    peregrineMQ.publish(channels[0])

    expect(function1.mock.calls).toHaveLength(1)
    expect(function2.mock.calls).toHaveLength(0)
  })

  it('publish method should call all parent descendants deeply', () => {
    const channels = [
      'topic',
      'topic.dashboard',
      'topic.dashboard.table',
      'topic.dashboard.table.body',
      'topic.dashboard.table.body.row',
      'topic.registration',
    ]

    const functionsArray: jest.Mock<undefined, []>[] = []

    channels.forEach((channel) => {
      const func = jest.fn(() => undefined)

      functionsArray.push(func)

      peregrineMQ.subscribe(channel, func)
    })

    expect(peregrineMQ.publish(channels[4])).toBeTruthy()

    expect(functionsArray[0].mock.calls).toHaveLength(1)
    expect(functionsArray[1].mock.calls).toHaveLength(1)
    expect(functionsArray[2].mock.calls).toHaveLength(1)
    expect(functionsArray[3].mock.calls).toHaveLength(1)
    expect(functionsArray[4].mock.calls).toHaveLength(1)
    expect(functionsArray[5].mock.calls).toHaveLength(0)

    expect(peregrineMQ.publish(channels[5])).toBeTruthy()
    expect(functionsArray[0].mock.calls).toHaveLength(2)
    expect(functionsArray[1].mock.calls).toHaveLength(1)
    expect(functionsArray[5].mock.calls).toHaveLength(1)
  })

  it('publish method should return false for nonexisting channel', async () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    const result1 = peregrineMQ.publish('nonExistingChannel')
    const result2 = peregrineMQ.publish('non.existing.nested.channel')
    // @ts-ignore
    const localResult3 = await Promise.allSettled(peregrineMQ.publish('topic.login.nonExistingChannel'))
    // @ts-ignore
    const result3 = localResult3.map(({ value }) => value)

    expect(result1).toEqual(NON_EXISTENT_CHANNEL)
    expect(result2).toEqual(
      [
        NON_EXISTENT_CHANNEL,
        NON_EXISTENT_CHANNEL,
        NON_EXISTENT_CHANNEL,
        NON_EXISTENT_CHANNEL,
      ],
    )

    expect(result3).toEqual([
      { resultFunction1: true },
      { resultFunction2: true },
      NON_EXISTENT_CHANNEL,
    ])
  })

  it('should call all subscribers, even if there are non existing descedants ', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[1], function1)

    expect(peregrineMQ.publish('topic.login')).toBeTruthy()

    expect(function1.mock.calls).toHaveLength(1)
  })

  it('should call all descedant subscribers, even if channel do not exist', async () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    const result = peregrineMQ.publish('topic.login.nonExistingChannel')

    // @ts-ignore
    expect((await Promise.allSettled(result)).map(({ value }) => value)).toEqual(
      [{ resultFunction1: true }, { resultFunction2: true }, NON_EXISTENT_CHANNEL],
    )

    expect(function1.mock.calls).toHaveLength(1)
    expect(function2.mock.calls).toHaveLength(1)
  })

  it('should call subscribers with message as first argument', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    peregrineMQ.publish(channels[0])

    expect(function1.mock.calls[0][0]).toEqual('topic')
    expect(function1.mock.calls[0][1]).toEqual(undefined)
  })

  it('should call subscribers with data as second argument', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    peregrineMQ.publish(channels[1], { property: 'data' })

    expect(function2.mock.calls[0][0]).toEqual('topic.login')
    expect(function2.mock.calls[0][1]).toEqual({ property: 'data' })
  })

  it('should call all subscribers, even when there are unsubscriptions within', () => {
    const channels = [
      'topic',
      'topic.dashboard',
      'topic.dashboard.table',
      'topic.dashboard.table.body',
      'topic.dashboard.table.body.row',
    ]

    const functionsArray: jest.Mock<undefined, []>[] = []

    channels.forEach((channel) => {
      const func = jest.fn(() => undefined)

      functionsArray.push(func)

      peregrineMQ.subscribe(channel, func)
    })

    peregrineMQ.unsubscribe(functionsArray[3])

    expect(peregrineMQ.publish(channels[4])).toBeTruthy()

    expect(functionsArray[0].mock.calls).toHaveLength(1)
    expect(functionsArray[1].mock.calls).toHaveLength(1)
    expect(functionsArray[2].mock.calls).toHaveLength(1)
    expect(functionsArray[3].mock.calls).toHaveLength(0)
    expect(functionsArray[4].mock.calls).toHaveLength(1)

    // resubscription
    peregrineMQ.subscribe(channels[3], functionsArray[3])
    expect(peregrineMQ.publish(channels[4])).toBeTruthy()

    expect(functionsArray[0].mock.calls).toHaveLength(2)
    expect(functionsArray[1].mock.calls).toHaveLength(2)
    expect(functionsArray[2].mock.calls).toHaveLength(2)
    expect(functionsArray[3].mock.calls).toHaveLength(1)
    expect(functionsArray[4].mock.calls).toHaveLength(2)
  })
})
