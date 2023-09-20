import { useSyncExternalStore } from 'react'

import { Store, StoreWithActions, Selector } from './store.vanillajs'


/**
 * Represents the type for the partial store state used in the `useStore` hook.
 */
export type useStoreType<T> = Partial<T>

/**
 * Custom hook to subscribe to a store and retrieve the selected state.
 * @param store - The store to subscribe to.
 * @param selector - Optional selector function to transform the store state.
 * @returns The selected state from the store.
 */
export function useStore<T>(
  store: Store<T> | StoreWithActions<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
  // TODO pass selector
  // useSyncExternalStore((...args) => {
  //  args[0].selector?? store.subscribe(...args) }, () => selector(store.getState()));
): useStoreType<T> {
  return useSyncExternalStore(store.subscribe, () => (selector(store.getState()) as Partial<T>))
}

/**
 * Represents the type for the API returned by the `useStoreApi` hook.
 */
export type useStoreApiType<T> = [
  ReturnType<typeof useStore>,
  Store<T>['getState'],
  Store<T>['setState'],
  StoreWithActions<T>['actions'],
]

/**
 * Custom hook to retrieve the store API including state, getters, setters, and actions (if applicable).
 * @param store - The store to retrieve the API from.
 * @param selector - Optional selector function to transform the store state.
 * @returns The store API including state, getters, setters, and actions (if applicable).
 */
export function useStoreApi<T>(
  store: Store<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
): useStoreApiType<T> {
  return [
    useStore(store, selector),
    store.getState,
    store.setState,
    (store as StoreWithActions<T>).actions,
  ]
}
