import { createSelector } from 'reselect'

import { delay } from '../../helpers/other'

import { Listener, Store, StoreWithActions, createStore } from './store.vanillajs'


type CommentsState = {
  data: number[]
  date: Date
  messages: string[]
  priority?: number
  validatedMessage?: string
}

const baseSelector = (state: Partial<CommentsState>): Partial<CommentsState> => state

const messagesSelector = createSelector(
  baseSelector,
  (state: Partial<CommentsState>) => state.messages,
)
const prioritySelector = createSelector(
  baseSelector,
  (state: Partial<CommentsState>) => state.priority,
)

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
    const store: Store<CommentsState> = createStore<CommentsState>(initialState)

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

    const subscriber: Listener<CommentsState> = jest.fn(subscriberCallback)

    // subscriber.selector = ((state: Partial<CommentsState>) => ({ messages: state.messages }))
    // subscriber.selector = messagesSelector
    // const unsubscribe = store.subscribe(subscriber)
    // or Selector provided as 2nd argument to subscribe
    const unsubscribe = store.subscribe(subscriber, messagesSelector)

    store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    expect(subscriber).toHaveBeenCalled()
    expect(subscriber).toHaveBeenCalledWith(['Only one message'])
    unsubscribe()

    store.setState({
      ...initialState,
      messages: ['Only one message after unsibscribed'],
    })

    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it('actions for fast state handling, and should call subscribers', async () => {
    const store: StoreWithActions<CommentsState> = createStore<CommentsState>(initialState, {
      addPriority: async (getState, setState, priority) => {
        await delay(300)
        setState({
          ...getState(),
          priority: (priority as number) || 3,
        })
      },
    }) as StoreWithActions<CommentsState>

    console.log('store', store)
    // const subscriber = (state: Partial<CommentsState>) => console.log('state subscriber, state:', state);

    const subscriber = jest.fn((state: Partial<CommentsState>) => console.log('state subscriber, state:', state))
    const unsubscribe = store.subscribe(subscriber)

    store.setState({
      ...initialState,
      messages: ['Only one message'],
    })

    // async function needs to be awaited or expect in queued micro task
    await store.actions?.addPriority?.(11)

    // store.actions?.addPriority?.()

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


  it('subscriber called only for value different then previous call of setState:listener', async () => {
    expect.assertions(2)

    const store: StoreWithActions<CommentsState> = createStore<CommentsState>(initialState, {
      addPriority: async (getState, setState, ...args: unknown[]) => {
        await delay(250)
        setState({
          ...getState(),
          priority: args[0] as unknown as number,
        })
      },
    }) as StoreWithActions<CommentsState>

    console.log('store', store)

    const subscriber: Listener<CommentsState>
      = jest.fn(
        (state: Partial<CommentsState>) => console.log('state subscriber, state:', state),
      ) as Listener<CommentsState>

    // subscriber.selector = (state: Partial<CommentsState>) => state?.priority
    subscriber.selector = prioritySelector
    store.subscribe(subscriber)

    // async function needs to be awaited or expect in queued micro task
    await store.actions?.addPriority?.(3)
    await store.actions?.addPriority?.(3)
    await store.actions?.addPriority?.(4)
    await store.actions?.addPriority?.(4)
    await store.actions?.addPriority?.(5)
    await store.actions?.addPriority?.(5)
    await store.actions?.addPriority?.(4)

    queueMicrotask(() => {
      expect(subscriber).toHaveBeenCalled()
      expect(subscriber).toHaveBeenCalledTimes(4)
    })
  })

  it('reducer called for specific action', async () => {
    expect.assertions(4)

    const reducer = jest.fn((state, actionName, args) => {
      console.log('reducer')
      console.log('actionName', actionName)
      console.log('state', state)
      console.log('args', args)
      switch (actionName) {
        case 'addPriority': {
          return {
            ...state,
            validatedMessage: `Priority added ${args}`,
          }
          break
        }

        case 'removePriority': {
          return {
            ...state,
            validatedMessage: 'Priority removed!',
          }
          break
        }

        default: {
          return state
        }
      }
      return state
    })

    const store: StoreWithActions<CommentsState> = createStore<CommentsState>(initialState, {
      addPriority: async (getState, setState, ...args: unknown[]) => {
        await delay(250)
        setState({
          ...getState(),
          priority: args[0] as unknown as number,
        })
      },
      removePriority: (getState, setState) => {
        setState({
          ...getState(),
          priority: 0,
        })
      },
    }, reducer) as StoreWithActions<CommentsState>

    console.log('store', store)

    const subscriber: Listener<CommentsState>
      = jest.fn((state: Partial<CommentsState>) => console.log('state subscriber, state:', state))

    // subscriber.selector = (state: Partial<CommentsState>) => state?.priority
    subscriber.selector = prioritySelector
    store.subscribe(subscriber)

    // async function needs to be awaited or expect in queued micro task
    await store.actions?.addPriority?.(3)

    expect(store.getState().validatedMessage).toEqual('Priority added 3')

    await store.actions?.removePriority?.()

    console.log(store.getState())

    expect(store.getState().validatedMessage).toEqual('Priority removed!')

    queueMicrotask(() => {
      expect(subscriber).toHaveBeenCalled()
      expect(reducer).toHaveBeenCalledTimes(2)
    })
  })
})
