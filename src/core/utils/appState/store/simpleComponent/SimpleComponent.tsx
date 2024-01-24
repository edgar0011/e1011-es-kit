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
  title: 'Initial Title',
  count: 0,
  data: [1, 2, 3],
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
  addCount: (getState, setState) => {
    const prevState = getState()

    setState({
      ...prevState,
      count: (prevState.count || 0) + 1,
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
// const dataSelector = (state: Partial<SimpleState>) => state.data

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const simpleSelector = createSelector(
  titleSelector,
  countSelector,
  // dataSelector,
  (title: SimpleState['title'], count: SimpleState['count'], data: SimpleState['data']) => {
    console.log('simpleSelector called')
    return {
      title,
      count,
      data,
    }
  },
)

export const SimpleComponent: FC<SimpleComponentType>
= memo<SimpleComponentType>(({ children }: SimpleComponentType) => {
  renderCount += 1

  const { title, count, data }: useStoreType<SimpleState> = useStore(simpleStore, simpleSelector)

  const simpleComponentButtonClickHandler = useCallback(() => {
    simpleStore.actions.addCount()
  }, [])

  return (
    <LayoutBox direction='column'>
      <h3>{title}</h3>
      <p>{count}</p>
      <p>{JSON.stringify(data)}</p>
      <button type='button' id='simpleComponentButton' onClick={simpleComponentButtonClickHandler}>Add Count</button>
      {children && (
      <LayoutBox>
        {children }
      </LayoutBox>
      )}
    </LayoutBox>
  )
})

SimpleComponent.displayName = 'SimpleComponent'
