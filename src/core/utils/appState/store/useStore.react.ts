import { useSyncExternalStore } from 'react'

import { Store, StoreWithActions, Selector } from './store.vanillajs'


/**
 * Represents the type for the partial store state used in the `useStore` hook.
 */
export type useStoreType<T> = Partial<T>

export type useStoreWithSetterType<T> = [Partial<T>, Store<T>['setState']]

type returnSetterTrueType = true

export function useStore<T>(
  store: Store<T> | StoreWithActions<T>,
  selector: Selector<T>): useStoreType<T>

export function useStore<T>(
  store: Store<T> | StoreWithActions<T>,
  selector: Selector<T>,
  returnSetter: returnSetterTrueType): useStoreWithSetterType<T>
/**
 * Custom hook to subscribe to a store and retrieve the selected state.
 * @param store - The store to subscribe to.
 * @param selector - Optional selector function to transform the store state.
 * @param returnSetter - Optional flag to have setState returned
 * @returns The selected state from the store. or selected state and seState tuple
 */
export function useStore<T>(
  store: Store<T> | StoreWithActions<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
  returnSetter = false,
  // TODO pass selector
  // useSyncExternalStore((...args) => {
  //  args[0].selector?? store.subscribe(...args) }, () => selector(store.getState()));
): useStoreType<T> | useStoreWithSetterType<T> {
  const getter = useSyncExternalStore(store.subscribe, () => (selector(store.getState()) as Partial<T>))

  if (returnSetter) {
    return [getter, store.setState] as useStoreWithSetterType<T>
  }

  return getter as useStoreType<T>
}

/**
 * Represents the type for the API returned by the `useStoreApi` hook.
 */
export type useStoreApiType<T> = [
  useStoreType<T>,
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
