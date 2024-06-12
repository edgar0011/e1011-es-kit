
// TinyStore, inspired by https://github.com/jherr/syncexternalstore/blob/main/csr/src/store.js

import { isFunctionAsync } from '../../helpers'

/**
 * Represents the callback function for a store listener.
 */
export type ListenerCallBack<T> = (state: Partial<T>) => void

/**
 * Represents a selector function that transforms the store state.
 */
// export type Selector<T> = (state: Partial<T>) => Partial<T>;
export type SelectedValueType<T> = Partial<T> | Partial<keyof T>
| string | number | boolean | undefined | string[] | number[] | boolean[] | undefined[];
export type Selector<T> = (state: Partial<T>) => SelectedValueType<T>;


/**
 * Represents a listener for the store.
 */
export type Listener<T> = {
  selector?: Selector<T>
  previousValue?: SelectedValueType<T>
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
   * @param selector - Optional selector function to transform the store state.
   * @returns A function to unsubscribe the listener.
   */
  subscribe: (listener: Listener<T>, selector?: Selector<T>) => () => void
  /**
   * Unubscribe a listener from the store.
   * @param listener - The listener function to be unsubscribed.
   */
  unsubscribe: (listener: Listener<T>) => void
}
// & { actions?: { [actionName: string]: ActionHandlerCaller } }

// TODO infer actionNames from createStore arguments
/**
 * Represents a store with additional actions.
 */
export type StoreWithActions<T> = Store<T> & { actions: { [actionName: string]: ActionHandlerCaller<T> } }

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
export type ActionHandlerCaller<T> = (...args: unknown[]) => void | Partial<T> | Promise<void | Partial<T>>


type Actions<T> = { [key: string]: ActionHandler<T>}
/**
 * Creates a new store.
 * @param initialState - The initial state of the store.
 * @param actions - Optional actions for the store.
 * @returns The created store.
 */
export const createStore = <T>(
  initialState: Partial<T>,
  actions?: Actions<T>,
  reducer?: Reducer<T>,
): Store<T> | StoreWithActions<T> => {
  let currentState: Partial<T> = initialState
  const listeners = new Set<Listener<T>>()

  /**
   * Gets the current state of the store.
   * @returns The current state of the store.
   */
  const getState = (): Partial<T> => currentState

  // TODO debounce, batch? what is the meaningful time between setState ofr UI to be rendered and registerd by User?
  /**
   * Sets the state of the store.
   * @param newState - The new state to set.
   * @returns A promise that resolves to the new state.
   */
  const setState = async (newState: Partial<T>): Promise<Partial<T>> => {
    currentState = newState

    // eslint-disable-next-line no-restricted-syntax
    for (const listener of listeners) {
      // has Listener selector?
      const selector: Selector<T> | undefined = listener?.selector

      // TODO compare selected value to the previous values of that listener/selector pair
      // if listener.previousValue === selector(currentState) no call
      // else listener.previousValue = selector(currentState) and call
      // l1 cache, weak references?
      const newValue: SelectedValueType<T> = selector ? selector(currentState) : currentState

      // TODO plugin equality
      if (listener.previousValue === undefined || listener.previousValue !== newValue) {
        listener.previousValue = newValue
        // eslint-disable-next-line no-await-in-loop
        await listener(newValue as Partial<T>)
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
    subscribe: (listener: Listener<T>, selector?: Selector<T>) => {
      if (selector && listener.selector && listener.selector !== selector) {
        throw new Error('Error, mismatch selector, listener.selector !== selector.')
      }
      if (selector && !listener.selector) {
        // eslint-disable-next-line no-param-reassign
        listener.selector = selector
      }

      if (listener.selector) {
        // setting the previousValue for the next cache/equality check
        // eslint-disable-next-line no-param-reassign
        listener.previousValue = listener.selector(getState())
      }

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
  const resolvedActions: Actions<T> | null | undefined
    = actions ? Object.entries(actions)?.reduce(
      (
        aggregator: Record<string, ActionHandlerCaller<T>>,
        [actionName, actionHandler]: [string, ActionHandler<T>],
      ) => ({
        ...aggregator,
        [actionName]: async(...rest: unknown[]): Promise<void | Partial<T>> => {
          // TODO try to not call subscriber too many times becuase of Error and Pending values
          const isAsync = isFunctionAsync(actionHandler as () => unknown)

          if (isAsync) {
            setState({
              ...getState(),
              [`${actionName}Error`]: null,
              [`${actionName}Pending`]: true,
            })
          }

          try {
            const resultOfAction = await actionHandler(getState, setState, ...rest)

            // TODO try to mutate state only once with the results, that means pass custom setState to action,
            // so that it would matk pending and error already inside action
            if (reducer) {
              setState(reducer(getState(), actionName, ...rest))
            }

            if (isAsync) {
              setState({ ...getState(), [`${actionName}Pending`]: false })
            }

            return resultOfAction
          } catch (error) {
            if (isAsync) {
              setState({
                ...getState(),
                [`${actionName}Pending`]: false,
                [`${actionName}Error`]: error,
              })
            }
            throw error
          }
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
