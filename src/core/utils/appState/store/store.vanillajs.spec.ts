import { delay } from '../../helpers/other'

import { Listener, createStore } from './store.vanillajs'


type CommentsState = {
  data: number[]
  date: Date
  messages: string[]
  priority?: number
}

describe('Simple Tiny Store', () => {
  let initialState: CommentsState

  beforeEach(() => {
    initialState = {
      data: [1, 2, 3],
      date: new Date(),
      messages: [
        'message 1',
        'message 2',
        'message 3',
      ],
    }
  })

  it('should have state', () => {
    const store = createStore<CommentsState>(initialState)

    console.log('store', store)
    console.log('store.getState()', store.getState())

    expect(store).toBeDefined()
    expect(store.getState()).toEqual(initialState)
  })

  it('should call subscribers', () => {
    const store = createStore<CommentsState>(initialState)

    console.log('store', store)
    // const subscriber = (state: Partial<CommentsState>) => console.log('state subscriber, state:', state);

    const subscriber = jest.fn((state: Partial<CommentsState>) => console.log('state subscriber, state:', state))
    const unsubscribe = store.subscribe(subscriber)

    store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    expect(subscriber).toHaveBeenCalled()
    expect(subscriber).toHaveBeenCalledTimes(1)
    unsubscribe()

    store.setState({
      ...initialState,
      messages: ['Only one message after unsibscribed'],
    })

    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it('should call and await async subscribers', async () => {
    expect.assertions(3)
    const store = createStore<CommentsState>(initialState)

    console.log('store', store)

    const subscriberCallback: Listener<CommentsState>
    = async (state: Partial<CommentsState>) => {
      await delay(1000)
      console.log('awaited state subscriber, state:', state)
    }

    const subscriber = jest.fn(subscriberCallback)
    const unsubscribe = store.subscribe(subscriber)

    await store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    expect(subscriber).toHaveBeenCalled()
    expect(subscriber).toHaveBeenCalledTimes(1)
    unsubscribe()

    store.setState({
      ...initialState,
      messages: ['Only one message after unsibscribed'],
    })

    expect(subscriber).toHaveBeenCalledTimes(1)
  })


  it('should call subscribers with selected part of state', () => {
    const store = createStore<CommentsState>(initialState)

    console.log('store', store)

    const subscriberCallback: Listener<CommentsState>
      = (state: Partial<CommentsState>) => console.log('state subscriber, state:', state)

    // normall use outside of test, mocking
    // subscriberCallback.selector = ((state: Partial<CommentsState>) => ({ messages: state.messages }));

    const subscriber = jest.fn(subscriberCallback)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    subscriber.selector = ((state: Partial<CommentsState>) => ({ messages: state.messages }))

    const unsubscribe = store.subscribe(subscriber)

    store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    expect(subscriber).toHaveBeenCalled()
    expect(subscriber).toHaveBeenCalledWith({ messages: ['Only one message'] })
    unsubscribe()

    store.setState({
      ...initialState,
      messages: ['Only one message after unsibscribed'],
    })

    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it('actions for fast state handling, and should call subscribers', async () => {
    const store = createStore<CommentsState>(initialState, {
      addPriority: async (getState, setState) => {
        await delay(1000)
        setState({
          ...getState(),
          priority: 3,
        })
      },
    })

    console.log('store', store)
    // const subscriber = (state: Partial<CommentsState>) => console.log('state subscriber, state:', state);

    const subscriber = jest.fn((state: Partial<CommentsState>) => console.log('state subscriber, state:', state))
    const unsubscribe = store.subscribe(subscriber)

    store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    // async function needs to be awaited or expect in queued micro task
    await store?.actions?.addPriority?.()
    // store?.actions?.addPriority?.()

    queueMicrotask(() => {
      expect(subscriber).toHaveBeenCalled()
      expect(subscriber).toHaveBeenCalledTimes(2)

      unsubscribe()

      store.setState({
        ...initialState,
        messages: ['Only one message after unsibscribed'],
      })

      expect(subscriber).toHaveBeenCalledTimes(2)
    })
  })
})




