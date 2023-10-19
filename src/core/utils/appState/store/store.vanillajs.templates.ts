import { ActionHandler, Reducer, Store, StoreWithActions, createStore } from './store.vanillajs'


type DefaultES = { [key: string]: any }


export type DataState<T, ES = DefaultES> = {
  dataId: string
  isLoading: boolean
  error?: unknown
  data?: T
} & ES


type Load<T, ES = DefaultES> = (
  getState: Store<DataState<T, ES>>['getState'],
  setState: Store<DataState<T, ES>>['setState'],
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T, ES>>>


type LoadHandler<T, ES = DefaultES> = (
  dataPromise: unknown | Promise<unknown>,
) => Promise<Partial<DataState<T, ES>>>

/**
 * Creates a data store with actions.
 * @param dataId - The ID of the data.
 * @param actions - Optional actions for the data store.
 * @returns The created data store with actions.
 */
export const createDataStore
= <T, ES = DefaultES>(
  dataId: string,
  initialState?: Partial<ES>,
  actions?: Record<string, ActionHandler<DataState<T, ES>>>,
  reducer?: Reducer<DataState<T, ES>>,
): StoreWithActions<DataState<T, ES>>
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
      const dataState: Partial<DataState<T, ES>> = getState()

      setState({ ...dataState, isLoading: true })

      try {
        const response: unknown = await dataPromise

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataState.data = response?.data || response
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataState.error = error
      }
      return setState({ ...dataState, isLoading: false })
    },
  }

  return (createStore<DataState<T, ES>>({
    ...initialState,
    dataId,
    isLoading: false,
  } as Partial<DataState<T, ES>>, loadActions, reducer)) as StoreWithActions<DataState<T, ES>>
  & { actions: { load: LoadHandler<T, ES> } }
}
