import { FC, PropsWithChildren, memo, useCallback } from 'react'
import { createSelector } from 'reselect'

import { useStore, useStoreType } from '../useStore.react'
import { StoreWithActions, createStore } from '../store.vanillajs'
import { LayoutBox } from '../../../../ui/components/container/LayoutBox'
import { delay } from '../../../helpers/other'


export type SimpleState = {
  title: string
  count: number
  data: number[]
}

export type SimpleComponentType = PropsWithChildren

export const simpleStore: StoreWithActions<SimpleState> = createStore<SimpleState>({
  title: 'Inittial Title',
  count: 0,
  data: [],
}, {
  addData: async (getState, setState) => {
    console.log('addData start')
    await delay(1000)
    console.log('addData end')
    setState({
      ...getState(),
      title: 'Added Data Title',
    })
  },
}) as StoreWithActions<SimpleState>

let renderCount = 0

export const getRenderCount = (): number => renderCount
export const setRenderCount = (count: number) => {
  renderCount = count
}


const titleSelector = (state: Partial<SimpleState>) => state.title
const countSelector = (state: Partial<SimpleState>) => state.count

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const simpleSelector = createSelector(
  titleSelector,
  countSelector,
  (title: SimpleState['title'], count: SimpleState['count']) => {
    console.log('simpleSelector called')
    return {
      title,
      count,
    }
  },
)

// const simpleSelector = (state: Partial<SimpleState>) => ({
//   title: state.title,
//   count: state.count,
// })

export const SimpleComponent: FC<SimpleComponentType>
= memo<SimpleComponentType>(({ children }: SimpleComponentType) => {
  renderCount += 1

  const { title, count, data }: useStoreType<SimpleState> = useStore(simpleStore, simpleSelector)

  const simpleComponentButtonCkickHandler = useCallback(() => {
    const prevState = simpleStore.getState()

    simpleStore.setState({
      ...prevState,
      count: (prevState.count || 0) + 1,
    })
  }, [])

  return (
    <LayoutBox direction='column'>
      <h3>{title}</h3>
      <p>{count}</p>
      <p>{JSON.stringify(data)}</p>
      <button type='button' id='simpleComponentButton' onClick={simpleComponentButtonCkickHandler}>Add Count</button>
      {children && (
      <LayoutBox>
        {children }
      </LayoutBox>
      )}
    </LayoutBox>
  )
})

SimpleComponent.displayName = 'SimpleComponent'
