/**
 * @jest-environment jsdom
 */

import { render } from '../../../../utils/test/testRenderer'

import { LayoutBox } from './LayoutBox'
import classes from './layoutBox.module.scss'


test('renders LayoutBox with classes', async () => {
  const rendered = render(<LayoutBox direction='column' data-selected tabIndex={0} />)

  const layoutBoxElements = rendered?.container.querySelectorAll(`.${classes['layout-box']}`)

  const layoutBoxElement = layoutBoxElements[0] as HTMLElement

  expect(rendered?.container).toBeDefined()
  expect(layoutBoxElements?.length).toEqual(1)

  expect(layoutBoxElement?.getAttribute('style')?.includes('direction: column')).toEqual(true)
  expect(layoutBoxElement?.getAttribute('data-selected')).toEqual('true')
})

test('supports grid layout and centered content', async () => {
  const rendered = render(<LayoutBox asGrid centered tabIndex={0} />)

  const layoutBoxElement = rendered?.container.querySelector(`.${classes['layout-box']}`) as HTMLElement
  const styleAttr = layoutBoxElement?.getAttribute('style') || ''

  expect(styleAttr.includes('display: grid')).toEqual(true)
  expect(styleAttr.includes('align-items: center')).toEqual(true)
  expect(styleAttr.includes('justify-content: center')).toEqual(true)
})

test('supports numeric width and height props', async () => {
  const rendered = render(<LayoutBox width={200} height={100} tabIndex={0} />)

  const layoutBoxElement = rendered?.container.querySelector(`.${classes['layout-box']}`) as HTMLElement
  const styleAttr = layoutBoxElement?.getAttribute('style') || ''

  expect(styleAttr.includes('width: 200px')).toEqual(true)
  expect(styleAttr.includes('height: 100px')).toEqual(true)
})

test('supports full width and height helpers', async () => {
  const rendered = render(<LayoutBox wFull hFull tabIndex={0} />)

  const layoutBoxElement = rendered?.container.querySelector(`.${classes['layout-box']}`) as HTMLElement
  const styleAttr = layoutBoxElement?.getAttribute('style') || ''

  expect(styleAttr.includes('width: 100%')).toEqual(true)
  expect(styleAttr.includes('height: 100%')).toEqual(true)
})

test('supports debug outline and flex helper', async () => {
  const rendered = render(<LayoutBox flex debug tabIndex={0} />)

  const layoutBoxElement = rendered?.container.querySelector(`.${classes['layout-box']}`) as HTMLElement
  const styleAttr = layoutBoxElement?.getAttribute('style') || ''

  expect(styleAttr.includes('flex:')).toEqual(true)
  expect(styleAttr.includes('outline: 1px solid red')).toEqual(true)
})
