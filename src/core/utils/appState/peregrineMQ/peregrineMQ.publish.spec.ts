/**
 * @jest-environment jsdom
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { peregrineMQInstance as peregrineMQ } from './index'

describe('PeregrineMQ publish method', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const function1 = jest.fn((channel, data) => undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const function2 = jest.fn((channel, data) => undefined)

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

  it('publish method should return false for nonexisting channel', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    expect(peregrineMQ.publish('nonExistingChannel')).toBeFalsy()
    expect(peregrineMQ.publish('non.existing.nested.channel')).toBeFalsy()

    expect(peregrineMQ.publish('topic.login.nonExistingChannel')).toBeFalsy()
  })

  it('should call all subscribers, even if there are non existing descedants ', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[1], function1)

    expect(peregrineMQ.publish('topic.login')).toBeTruthy()

    expect(function1.mock.calls).toHaveLength(1)
  })

  it('should call all descedant subscribers, even if channel do not exist', () => {
    const channels = ['topic', 'topic.login']

    peregrineMQ.subscribe(channels[0], function1)
    peregrineMQ.subscribe(channels[1], function2)

    expect(peregrineMQ.publish('topic.login.nonExistingChannel')).toBeFalsy()

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
