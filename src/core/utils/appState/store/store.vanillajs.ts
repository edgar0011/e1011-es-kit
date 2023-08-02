
// TinyStore, inspired by https://github.com/jherr/syncexternalstore/blob/main/csr/src/store.js

/**
 * Represents the callback function for a store listener.
 */
export type ListenerCallBack<T> = (state: Partial<T>) => void

/**
 * Represents a selector function that transforms the store state.
 */
export type Selector<T> = (state: Partial<T>) => Partial<T>;

/**
 * Represents a listener for the store.
 */
export type Listener<T> = {
  selector?: Selector<T>
  previousValue?: Partial<T>
} & ListenerCallBack<T>

/**
 * Represents a store.
 */
export type Store<T> = {
  /**
   * Get the current state of the store.
   * @returns The current state of the store.
   */
  getState: () => Partial<T>
  /**
   * Set the state of the store.
   * @param state - The new state to set.
   * @returns A promise that resolves to the new state.
   */
  setState: (state: Partial<T>) => Promise<Partial<T>>
  /**
   * Subscribe a listener to the store.
   * @param listener - The listener function to be subscribed.
   * @returns A function to unsubscribe the listener.
   */
  subscribe: (listener: Listener<T>) => () => void
  /**
   * Unubscribe a listener from the store.
   * @param listener - The listener function to be unsubscribed.
   */
  unsubscribe: (listener: Listener<T>) => void
}
// & { actions?: { [actionName: string]: ActionHandlerCaller } }

/**
 * Represents a store with additional actions.
 */
export type StoreWithActions<T> = Store<T> & { actions: { [actionName: string]: ActionHandlerCaller } }

/**
 * Represents an action handler function.
 */
export type ActionHandler<T> = (
  getState: Store<T>['getState'], // Function to get the current state of the store
  setState: Store<T>['setState'], // Function to set the state of the store
  ...rest: unknown[]
) => void | Partial<T> | Promise<void | Partial<T>>

/**
 * Represents an reducer function.
 */
export type Reducer<T> = (
  state: Partial<T>,
  action: string,
  ...rest: unknown[]
) => Partial<T>


/**
 * Represents a function that calls an action handler.
 */
export type ActionHandlerCaller = (...args: unknown[]) => void


/**
 * Creates a new store.
 * @param initialState - The initial state of the store.
 * @param actions - Optional actions for the store.
 * @returns The created store.
 */
export const createStore = <T>(
  initialState: Partial<T>,
  actions?: Record<string, ActionHandler<T>>,
  reducer?: Reducer<T>,
): Store<T> | StoreWithActions<T> => {
  let currentState: Partial<T> = initialState
  const listeners = new Set<Listener<T>>()

  /**
   * Gets the current state of the store.
   * @returns The current state of the store.
   */
  const getState = () => currentState

  // TODO debounce, batch? what is the meaningful time between setState ofr UI to be rendered and registerd by User?
  /**
   * Sets the state of the store.
   * @param newState - The new state to set.
   * @returns A promise that resolves to the new state.
   */
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

  /**
   * Represents the basic API of the store.
   */
  const storeBaseicApi: Store<T> = {
    /**
     * Get the current state of the store.
     * @returns The current state of the store.
     */
    getState,
    /**
     * Set the state of the store.
     * @param state - The new state to set.
     * @returns A promise that resolves to the new state.
     */
    setState,
    /**
     * Subscribe a listener to the store.
     * @param listener - The listener function to be subscribed.
     * @returns A function to unsubscribe the listener.
     */
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    /**
     * Unsubscribe a listener from the store.
     * @param listener - The listener function to be unsubscribed.
     */
    unsubscribe: (listener: Listener<T>) => {
      listeners.delete(listener)
    },
  }

  /**
   * Resolves the actions and creates action handlers.
   */
  const resolvedActions: Record<string, ActionHandlerCaller> | null | undefined
    = actions ? Object.entries(actions)?.reduce(
      (
        aggregator: Record<string, ActionHandlerCaller>,
        [actionName, actionHandler]: [string, ActionHandler<T>],
      ) => ({
        ...aggregator,
        [actionName]: async(...rest: unknown[]) => {
          const resultOfAction = await actionHandler(getState, setState, ...rest)

          if (reducer) {
            setState(reducer(getState(), actionName, ...rest))
          }
          return resultOfAction
        },
      }),
      {},
    ) : null

  /**
   * Represents the store combined with actions.
   */
  const storeCombinedWithActions = {
    ...storeBaseicApi,
    ...(resolvedActions ? { actions: { ...resolvedActions } } : {}),
  }

  return resolvedActions
    ? storeCombinedWithActions as StoreWithActions<T>
    : storeCombinedWithActions as Store<T>
}
