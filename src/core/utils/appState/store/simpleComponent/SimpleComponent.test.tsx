/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render } from '../../../test/testRenderer'

import { SimpleComponent, SimpleState, simpleStore, getRenderCount, setRenderCount } from './SimpleComponent'


describe('SimpleComponent, bound to useStore', () => {
  const initState: Partial<SimpleState> = simpleStore.getState()

  it('renders SimpleComponent with store', async () => {
    expect.assertions(7)
    const rendered = render(<SimpleComponent />)

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

    expect(Number(countElement.innerHTML)).toEqual((initState?.count || 0) + 2)

    expect(getRenderCount()).toEqual(3)
    setRenderCount(0)
    rendered.unmount()
  })

  it('renders SimpleComponent with store, selectors', async () => {
    expect.assertions(4)
    const rendered = render(<SimpleComponent />)

    const simpleComponentElement = rendered?.container.querySelector('div') as HTMLDivElement

    const titleElement = simpleComponentElement.querySelectorAll('h3')[0]

    console.log('titleElement.innerHTML', titleElement.innerHTML)

    act(() => {
      simpleStore.setState({
        ...simpleStore.getState(),
        data: [1, 2, 3],
      })
    })

    expect(getRenderCount()).toEqual(1)

    act(() => {
      simpleStore.setState({
        ...simpleStore.getState(),
        title: 'New Title',
      })
    })

    act(() => {
      simpleStore.setState({
        ...simpleStore.getState(),
        title: 'New Title',
      })
    })
    console.log('titleElement.innerHTML', titleElement.innerHTML)
    expect(getRenderCount()).toEqual(2)


    await act(async () => {
      await simpleStore.actions.addData()
    })
    await act(async () => {
      await simpleStore.actions.addData()
    })

    console.log('titleElement.innerHTML', titleElement.innerHTML)
    expect(titleElement.innerHTML).toEqual('Added Data Title')
    expect(getRenderCount()).toEqual(3)

    setRenderCount(0)
  })
})
