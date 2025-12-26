/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck


import { CSSProperties } from 'react'

export type PendingAction<A> = `${A}Pending`
export type ErrorAction<A> = `${A}Error`
export type ActionName<A> = `${A}`

export type ActionsReturnType<A, TActionHandler> = Record<ActionName<A>, TActionHandler>

export type ActionsStateReturnType<A>
  = Partial<Record<PendingAction<A>, boolean>> & Partial<Record<ErrorAction<A>, boolean>>


type ActionHandlerCaller<T> = (...args: unknown[]) => void | Partial<T> | Promise<void | Partial<T>>


function invert<T, A extends string>(
  arr: A[], state: Partial<T>,
): Partial<T> & ActionsStateReturnType<A> {
  arr.forEach((x) => {
    state[`${x}Error`] = true
    state[`${x}Pending`] = true
  })

  return state as (Partial<T> & ActionsStateReturnType<A>)
}

function invert2<T, A extends string>(
  arr: A[], actions: ActionsReturnType<A>, actionHandler: ActionHandlerCaller<T>,
): ActionsReturnType<A, ActionHandlerCaller<T>> {
  arr.forEach((x) => {
    actions[`${x}`] = actionHandler
  })

  return actions as ActionsReturnType<A>
}

function invert3<T, A extends string>(
  arr: A[], actions: ActionsReturnType<A>, state: Partial<T>, actionHandler: ActionHandlerCaller<T>,
): [Partial<T> & ActionsStateReturnType<A>, ActionsReturnType<A, ActionHandlerCaller<T>>] {
  arr.forEach((x) => {
    state[`${x}Error`] = actionHandler
    state[`${x}Pending`] = actionHandler
    actions[`${x}`] = actionHandler
  })

  return [state, actions] as [Partial<T> & ActionsStateReturnType<A>, ActionsReturnType<A, ActionHandlerCaller<T>>]
}

function invert4<T, A extends string>(
  actionsDict: Record<A, () => void >,
  // actionsDict: A[],
  actions: ActionsReturnType<A>,
  state: Partial<T>,
  actionHandler: ActionHandlerCaller<T>,
): (Partial<T> & ActionsStateReturnType<A>) & { actions: ActionsReturnType<A, ActionHandlerCaller<T>>} {
  (Object.keys(actionsDict) as A[]).forEach((x: A) => {
    state[`${x}Error`] = actionHandler
    state[`${x}Pending`] = actionHandler
    actions[`${x}`] = actionHandler
  })

  return { ...state, actions } as (Partial<T> & ActionsStateReturnType<A>) & { actions: ActionsReturnType<A, ActionHandlerCaller<T>>}
}

const example = invert(['foo', 'bar', 'baz'], {}, () => {})
const example2 = invert2(['foo', 'bar', 'baz'], {}, () => {})
const example3 = invert3(['foo', 'bar', 'baz'], {}, () => {})


const createDataModel = <T, A extends string>(mode: number, arr: Record<A, () => void >, store: Partial<T>): ReturnType<typeof invert4<T, A>> => invert4(arr, store)

type DataStore = {
  data: Record<string, unknown>[]
}


// const model = createDataModel(1, { foo: () => {}, bar: () => {}, baz: () => {} }, {} as DataStore)
// const model = createDataModel(1, ['foo', 'bar', 'baz'], {} as DataStore)
// model.



function invertZero<A extends string>(
  actionsDict: Record<A, () => void >,
): Record<A, CSSProperties> {
  const obj = {};

  (Object.keys(actionsDict) as A[]).forEach((x: A) => {
    obj[`${x}`] = actionsDict[x]
  })

  return obj
}

const createDataModelZero = <A extends string, >(arr: Record<A, CSSProperties >): Record<A, CSSProperties> => invertZero(arr)

const model = createDataModelZero({ foo: () => {}, bar: () => {}, baz: () => {} })

