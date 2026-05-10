import { delay } from '../../helpers/other'

import { StoreWithActions } from './store.vanillajs'
import { DataState, createDataStore } from './store.vanillajs.templates'


type Item = { id: number; title: string }
type ItemList = Item[]

describe('createDataStore – extended coverage', () => {
  it('initializes with dataId, isLoading=false, and custom initial state', () => {
    const store = createDataStore<ItemList>('items', { extraFlag: true })

    expect(store.getState().dataId).toBe('items')
    expect(store.getState().isLoading).toBe(false)
    expect((store.getState() as any).extraFlag).toBe(true)
    expect(store.getState().data).toBeUndefined()
    expect(store.getState().error).toBeUndefined()
  })

  it('always has a load action', () => {
    const store = createDataStore<ItemList>('items')

    expect(store.actions).toBeDefined()
    expect(store.actions.load).toBeInstanceOf(Function)
  })

  it('load sets isLoading=true then isLoading=false with data on success', async () => {
    const store = createDataStore<ItemList>('items')

    const fakeData: ItemList = [{ id: 1, title: 'Test' }]
    const promise = store.actions.load(Promise.resolve(fakeData))

    // isLoading should be true while promise is pending
    expect(store.getState().isLoading).toBe(true)

    await promise

    expect(store.getState().isLoading).toBe(false)
    expect(store.getState().data).toEqual(fakeData)
    expect(store.getState().error).toBeUndefined()
  })

  it('load unwraps response.data if present', async () => {
    const store = createDataStore<ItemList>('items')

    const fakeResponse = { data: [{ id: 2, title: 'Wrapped' }], status: 200 }

    await store.actions.load(Promise.resolve(fakeResponse))

    expect(store.getState().data).toEqual([{ id: 2, title: 'Wrapped' }])
  })

  it('load sets error on rejection', async () => {
    const store = createDataStore<ItemList>('items')

    const err = new Error('network error')

    await store.actions.load(Promise.reject(err))

    expect(store.getState().isLoading).toBe(false)
    expect(store.getState().error).toBe(err)
  })

  it('load works with a delayed promise', async () => {
    const store = createDataStore<ItemList>('items')

    const delayedData = (async (): Promise<ItemList> => {
      await delay(50)
      return [{ id: 3, title: 'Delayed' }]
    })()

    const promise = store.actions.load(delayedData)

    expect(store.getState().isLoading).toBe(true)

    await promise

    expect(store.getState().isLoading).toBe(false)
    expect(store.getState().data).toEqual([{ id: 3, title: 'Delayed' }])
  })

  it('custom actions are merged alongside load', async () => {
    const store = createDataStore<ItemList, { cleared: boolean }>('items', { cleared: false }, {
      clearData: (getState, setState) => {
        setState({ ...getState(), data: [], cleared: true })
      },
    }) as StoreWithActions<DataState<ItemList, { cleared: boolean }>>
    & { actions: { load: any; clearData: any } }

    await store.actions.load(Promise.resolve([{ id: 1, title: 'A' }]))
    expect(store.getState().data).toEqual([{ id: 1, title: 'A' }])

    await store.actions.clearData()
    expect(store.getState().data).toEqual([])
    expect(store.getState().cleared).toBe(true)
  })

  it('reducer is invoked for actions on a data store', async () => {
    const reducer = jest.fn((state, actionName) => {
      if (actionName === 'process') {
        return { ...state, processed: true }
      }
      return state
    })

    const store = createDataStore<ItemList, { processed?: boolean }>(
      'items',
      {},
      {
        process: async (getState, setState) => {
          await delay(10)
          setState(getState())
        },
      },
      reducer,
    ) as StoreWithActions<DataState<ItemList, { processed?: boolean }>>

    await store.actions.process()

    expect(reducer).toHaveBeenCalled()
    expect((store.getState() as any).processed).toBe(true)
  })

  it('subscriber is notified during load lifecycle', async () => {
    const store = createDataStore<ItemList>('items')
    const listener = jest.fn()

    store.subscribe(listener)

    await store.actions.load(Promise.resolve([{ id: 1, title: 'X' }]))

    // At minimum: isLoading=true, then final state with isLoading=false
    expect(listener.mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})
