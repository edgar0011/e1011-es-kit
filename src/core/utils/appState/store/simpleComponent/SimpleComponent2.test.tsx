/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render } from '../../../test/testRenderer'

import {
  SimpleComponent2,
  SimpleState, simpleStore2, getRenderCount, setRenderCount,
} from './SimpleComponent2'


describe('SimpleComponent, bound to useStore', () => {
  const initState: Partial<SimpleState> = simpleStore2.getState()

  console.log('initState', initState)

  it('renders SimpleComponent2 with store, setState', async () => {
    expect.assertions(7)
    setRenderCount(0)
    simpleStore2.setState(initState)
    const rendered = render(<SimpleComponent2 />)

    const simpleComponentElement = rendered?.container.querySelector('div') as HTMLDivElement

    const titleElement = simpleComponentElement.querySelectorAll('h3')[0]
    const otherElements = simpleComponentElement.querySelectorAll('p')
    const countElement = otherElements[0]
    const dataElement = otherElements[1]

    const buttonElement = simpleComponentElement.querySelector('button') as HTMLButtonElement

    expect(rendered?.container).toBeDefined()
    expect(otherElements?.length).toEqual(2)

    expect(titleElement.innerHTML).toEqual(initState?.title)
    expect(Number(countElement.innerHTML)).toEqual(initState?.count)

    expect(dataElement.innerHTML).toEqual('')

    fireEvent(buttonElement, new MouseEvent('click', { bubbles: true, cancelable: true }))
    fireEvent(buttonElement, new MouseEvent('click', { bubbles: true, cancelable: true }))

    console.log('simpleStore.getState()', simpleStore2.getState())

    expect(Number(countElement.innerHTML)).toEqual(111)

    // only 2 times rendersm button click sets count to 111 always
    expect(getRenderCount()).toEqual(2)
    setRenderCount(0)
    rendered.unmount()
  })


  it('renders SimpleComponent2 with store, selectors', async () => {
    expect.assertions(4)
    const rendered = render(<SimpleComponent2 />)

    const simpleComponentElement = rendered?.container.querySelector('div') as HTMLDivElement

    const titleElement = simpleComponentElement.querySelectorAll('h3')[0]

    console.log('titleElement.innerHTML', titleElement.innerHTML)

    act(() => {
      simpleStore2.setState({
        ...simpleStore2.getState(),
        data: [1, 2, 3],
      })
    })

    expect(getRenderCount()).toEqual(1)

    act(() => {
      simpleStore2.setState({
        ...simpleStore2.getState(),
        title: 'New Title',
      })
    })

    act(() => {
      simpleStore2.setState({
        ...simpleStore2.getState(),
        title: 'New Title',
      })
    })
    console.log('titleElement.innerHTML', titleElement.innerHTML)
    expect(getRenderCount()).toEqual(2)


    await act(async () => {
      await simpleStore2.actions.addData()
    })
    await act(async () => {
      await simpleStore2.actions.addData()
    })

    console.log('titleElement.innerHTML', titleElement.innerHTML)
    expect(titleElement.innerHTML).toEqual('Added Data Title')
    expect(getRenderCount()).toEqual(3)

    setRenderCount(0)
  })
})
