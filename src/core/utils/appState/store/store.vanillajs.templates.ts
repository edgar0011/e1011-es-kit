import { Store, StoreWithActions, createStore } from './store.vanillajs'


export type DataState<T> = {
  dataId: string
  isLoading: boolean
  error?: unknown
  data?: T
}

type CreateDataStoreType = <T>(dataId: string) => StoreWithActions<DataState<T>>

export const createDataStore: CreateDataStoreType = <T>(dataId: string) => createStore<DataState<T>>({
  dataId,
  isLoading: false,
}, {
  load: async (
    getState: Store<DataState<T>>['getState'],
    setState: Store<DataState<T>>['setState'],
    dataPromise: unknown | Promise<unknown>,
  ) => {
    const re: Partial<DataState<T>> = {}

    try {
      const response: unknown = await dataPromise

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      re.data = response?.data || response
    } catch (error) {
      re.error = error
    }
    setState({ ...re, isLoading: false })
  },
}) as StoreWithActions<DataState<T>>

