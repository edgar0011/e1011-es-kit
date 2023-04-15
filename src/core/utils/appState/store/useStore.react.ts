import { useSyncExternalStore } from 'react'

import type { Store, Selector } from './store.vanillajs'


export type useStoreType<T> = [
  Partial<T>,
  Store<T>['setState'],
  Store<T>['actions'],
]


export const useStore = <T>(
  store: Store<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
  // TODO pass selector
  // useSyncExternalStore((...args) => {
  //  args[0].selector?? store.subscribe(...args) }, () => selector(store.getState()));
): useStoreType<T> => [
    useSyncExternalStore(store.subscribe, () => selector(store.getState())),
    store.setState,
    store.actions,
  ]


export type useStoreApiType<T> = [
  ReturnType<typeof useStore>,
  Store<T>['getState'],
  Store<T>['setState'],
  Store<T>['actions'],
]


export const useStoreApi = <T>(
  store: Store<T>,
  selector: Selector<T> = (state: Partial<T>) => state,
): useStoreApiType<T> => ([
    useStore(store, selector),
    store.getState,
    store.setState,
    store.actions,
  ])
