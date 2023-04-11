
// TinyStore, inspired by https://github.com/jherr/syncexternalstore/blob/main/csr/src/store.js
export type ListenerCallBack<T> = (state: Partial<T>) => void

export type Selector<T> = (state: Partial<T>) => Partial<T>;

export type Listener<T> = {
  selector?: Selector<T>
} & ListenerCallBack<T>

export type Store<T> = {
  getState: () => Partial<T>
  setState: (state: Partial<T>) => void
  subscribe: (listener: Listener<T>) => () => void
} & { actions?: { [actionName: string]: ActionHandlerCaller } }

export type ActionHandler<T> = (state: Partial<T>) => Partial<T>

export type ActionHandlerCaller = () => void


export const createStore = <T>(initialState: Partial<T>, actions?: Record<string, ActionHandler<T>>): Store<T> => {
  let currentState: Partial<T> = initialState
  const listeners = new Set<Listener<T>>()

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

      // TODO parallelize await
      // eslint-disable-next-line no-await-in-loop
      await listener(selector ? selector(currentState) : currentState)
    }
  }

  const storeBaseicApi: Store<T> = {
    getState: () => currentState,
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
        [actionName]: () => setState(actionHandler(currentState)),
      }),
      {},
    ) : null

  const storeCombinedWithActions = {
    ...storeBaseicApi,
    ...(resolvedActions ? { actions: { ...resolvedActions } } : {}),
  }

  return storeCombinedWithActions
}
