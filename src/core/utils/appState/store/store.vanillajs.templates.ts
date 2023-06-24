import { ActionHandler, Store, StoreWithActions, createStore } from './store.vanillajs'


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

/**
 * Creates a data store with actions.
 * @param dataId - The ID of the data.
 * @param actions - Optional actions for the data store.
 * @returns The created data store with actions.
 */
export const createDataStore
= <T>(dataId: string, actions?: Record<string, ActionHandler<T>>): StoreWithActions<DataState<T>>
& { actions: { load: LoadHandler<T> } } => {
  const loadActions: { load: Load<T> } = {
    ...actions,
    /**
     * Loads data into the data store.
     * @param getState - Function to get the current state of the data store.
     * @param setState - Function to set the state of the data store.
     * @param dataPromise - The data promise to be loaded.
     * @returns A promise that resolves to the updated state of the data store.
     */
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
  }, loadActions)) as StoreWithActions<DataState<T>>
  & { actions: { load: LoadHandler<T> } }
}

