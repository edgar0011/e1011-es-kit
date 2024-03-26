import { FC, PropsWithChildren, memo, useCallback } from 'react'
import { createSelector } from 'reselect'

import { useStore, useStoreWithSetterType } from '../useStore.react'
import { StoreWithActions, createStore } from '../store.vanillajs'
import { LayoutBox } from '../../../../ui/components/container/layoutBox/LayoutBox'
import { delay } from '../../../helpers/other'


export type SimpleState = {
  title: string
  count: number
  data: number[]
}

export type SimpleComponentType = PropsWithChildren

export const simpleStore2: StoreWithActions<SimpleState> = createStore<SimpleState>({
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
export const setRenderCount = (count: number): void => {
  renderCount = count
}


const titleSelector = (state: Partial<SimpleState>): SimpleState['title'] | undefined => state.title
const countSelector = (state: Partial<SimpleState>): SimpleState['count'] | undefined => state.count
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


export const SimpleComponent2: FC<SimpleComponentType>
= memo<SimpleComponentType>(({ children }: SimpleComponentType) => {
  renderCount += 1

  const [{ title, count, data }, setState]: useStoreWithSetterType<SimpleState>
  = useStore(simpleStore2, simpleSelector, true)

  const simpleComponentButtonClickHandler = useCallback(() => {
    setState({
      ...simpleStore2.getState(),
      count: 111,
    })
  }, [setState])

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

SimpleComponent2.displayName = 'SimpleComponent2'
