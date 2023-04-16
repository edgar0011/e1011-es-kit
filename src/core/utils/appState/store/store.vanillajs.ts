
// TinyStore, inspired by https://github.com/jherr/syncexternalstore/blob/main/csr/src/store.js
export type ListenerCallBack<T> = (state: Partial<T>) => void

export type Selector<T> = (state: Partial<T>) => Partial<T>;

export type Listener<T> = {
  selector?: Selector<T>
  previousValue?: Partial<T>
} & ListenerCallBack<T>

export type Store<T> = {
  getState: () => Partial<T>
  setState: (state: Partial<T>) => Promise<Partial<T>>
  subscribe: (listener: Listener<T>) => () => void
}
// & { actions?: { [actionName: string]: ActionHandlerCaller } }

export type StoreWithActions<T> = Store<T> & { actions: { [actionName: string]: ActionHandlerCaller } }


export type ActionHandler<T> = (
  getState: Store<T>['getState'],
  setState: Store<T>['setState'],
  ...rest: unknown[]
) => void | Partial<T> | Promise<void | Partial<T>>


export type ActionHandlerCaller = (...args: unknown[]) => void


export const createStore = <T>(
  initialState: Partial<T>,
  actions?: Record<string, ActionHandler<T>>,
): Store<T> | StoreWithActions<T> => {
  let currentState: Partial<T> = initialState
  const listeners = new Set<Listener<T>>()

  const getState = () => currentState

  // TODO debounce, batch? what is the meaningful time between setState ofr UI to be rendered and registerd by User?
  const setState = async (newState: Partial<T>) => {
    currentState = newState

    // eslint-disable-next-line no-restricted-syntax
    for (const listener of listeners) {
      // has Listener selector?
      const selector: Selector<T> | undefined = listener?.selector

      // TODO compare selected value to the previous values of that listener/selector pair
      // if listener.previousValue === selector(currentState) no call
      // else listener.previousValue = selector(currentState) and call
      // l1 cache, weak references?
      const newValue: Partial<T> = selector ? selector(currentState) : currentState

      // TODO plugin equality
      if (listener.previousValue === undefined || listener.previousValue !== newValue) {
        listener.previousValue = newValue
        // eslint-disable-next-line no-await-in-loop
        await listener(newValue)
      }
    }
    return currentState
  }

  const storeBaseicApi: Store<T> = {
    getState,
    setState,
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }


  const resolvedActions: Record<string, ActionHandlerCaller> | null | undefined
    = actions ? Object.entries(actions)?.reduce(
      (
        aggregator: Record<string, ActionHandlerCaller>,
        [actionName, actionHandler]: [string, ActionHandler<T>],
      ) => ({
        ...aggregator,
        [actionName]: async(...rest: unknown[]) => actionHandler(getState, setState, ...rest),
      }),
      {},
    ) : null

  const storeCombinedWithActions = {
    ...storeBaseicApi,
    ...(resolvedActions ? { actions: { ...resolvedActions } } : {}),
  }

  return resolvedActions
    ? storeCombinedWithActions as StoreWithActions<T>
    : storeCombinedWithActions as Store<T>
}
