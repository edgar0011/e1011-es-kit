import { useSyncExternalStore } from 'react'

import { Store, StoreWithActions, Selector } from './store.vanillajs'


export type useStoreType<T> = Partial<T>


export function useStore<T>(
  store: Store<T> | StoreWithActions<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
  // TODO pass selector
  // useSyncExternalStore((...args) => {
  //  args[0].selector?? store.subscribe(...args) }, () => selector(store.getState()));
): useStoreType<T> {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}


export type useStoreApiType<T> = [
  ReturnType<typeof useStore>,
  Store<T>['getState'],
  Store<T>['setState'],
  StoreWithActions<T>['actions'],
]


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
