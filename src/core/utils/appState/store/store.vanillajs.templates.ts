import { ActionHandler, Store, StoreWithActions, createStore } from './store.vanillajs'


export type DataState<T, ES = any> = {
  dataId: string
  isLoading: boolean
  error?: unknown
  data?: T
  other?: ES
}


type Load<T, ES> = (
  getState: Store<DataState<T, ES>>['getState'],
  setState: Store<DataState<T, ES>>['setState'],
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T, ES>>>


type LoadHandler<T, ES> = (
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T, ES>>>

/**
 * Creates a data store with actions.
 * @param dataId - The ID of the data.
 * @param actions - Optional actions for the data store.
 * @returns The created data store with actions.
 */
export const createDataStore
= <T, ES = any>(
  dataId: string,
  actions?: Record<string, ActionHandler<DataState<T, ES>>>): StoreWithActions<DataState<T, ES>>
& { actions: { load: LoadHandler<T, ES> } } => {
  const loadActions: { load: Load<T, ES> } = {
    ...actions,
    /**
     * Loads data into the data store.
     * @param getState - Function to get the current state of the data store.
     * @param setState - Function to set the state of the data store.
     * @param dataPromise - The data promise to be loaded.
     * @returns A promise that resolves to the updated state of the data store.
     */
    load: async (
      getState: Store<DataState<T, ES>>['getState'],
      setState: Store<DataState<T, ES>>['setState'],
      dataPromise: unknown | Promise<unknown>,
    ) => {
      const dataState: Partial<DataState<T, ES>> = {}

      setState({ isLoading: true })

      try {
        const response: unknown = await dataPromise

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataState.data = response?.data || response
      } catch (error) {
        dataState.error = error
      }
      return setState({ ...dataState, isLoading: false })
    },
  }

  return (createStore<DataState<T, ES>>({
    dataId,
    isLoading: false,
  }, loadActions)) as StoreWithActions<DataState<T, ES>>
  & { actions: { load: LoadHandler<T, ES> } }
}

