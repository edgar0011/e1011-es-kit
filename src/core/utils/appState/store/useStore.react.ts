import { useSyncExternalStore } from 'react'

import type { Store, Selector } from './store.vanillajs'

export const useStore = <T>(
  store: Store<T>,
  selector: Selector<T> = (state) => state,
  // TODO pass selector
  // useSyncExternalStore((...args) => {
  //  args[0].selector?? store.subscribe(...args) }, () => selector(store.getState()));
) => [useSyncExternalStore(store.subscribe, () => selector(store.getState())), store.setState, store.actions]

export type useStateType<T> = [ReturnType<typeof useStore>, Store<T>['setState'], Store<T>['actions'] ]

export const useState = <T>(
  store: Store<T>,
  selector: Selector<T> = (state) => state,
): useStateType<T> => ([
    useStore(store, selector),
    store.setState,
    store?.actions,
  ])
