import { Store, StoreWithActions, createStore } from './store.vanillajs'


export type DataState<T> = {
  dataId: string
  isLoading: boolean
  error?: unknown
  data?: T
}

// type CreateDataStoreType = <T>(dataId: string) => StoreWithActions<DataState<T>>


type Load<T> = (
  getState: Store<DataState<T>>['getState'],
  setState: Store<DataState<T>>['setState'],
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T>>>


type LoadHandler<T> = (
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T>>>

export const createDataStore = <T>(dataId: string): Store<DataState<T>>
& { actions: { load: LoadHandler<T> } } => {
  const actions: { load: Load<T> } = {
    load: async (
      getState: Store<DataState<T>>['getState'],
      setState: Store<DataState<T>>['setState'],
      dataPromise: unknown | Promise<unknown>,
    ) => {
      const re: Partial<DataState<T>> = {}

      setState({ isLoading: true })

      try {
        const response: unknown = await dataPromise

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        re.data = response?.data || response
      } catch (error) {
        re.error = error
      }
      return setState({ ...re, isLoading: false })
    },
  }

  return (createStore<DataState<T>>({
    dataId,
    isLoading: false,
  }, actions)) as StoreWithActions<DataState<T>>
  & { actions: { load: LoadHandler<T> } }
}

