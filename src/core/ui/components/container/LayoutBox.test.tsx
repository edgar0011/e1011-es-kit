/**
 * @jest-environment jsdom
 */

import { render } from '../../../utils/test/testRenderer'

import { LayoutBox } from './LayoutBox'
import classes from './layoutBox.module.scss'


test('renders LayoutBox with classes', async () => {
  const rendered = render(<LayoutBox direction='column' data-selected tabIndex={0} />)

  const layoutBoxElements = rendered?.container.querySelectorAll(`.${classes['flexible-box']}`)

  const layoutBoxElement = layoutBoxElements[0] as HTMLElement

  expect(rendered?.container).toBeDefined()
  expect(layoutBoxElements?.length).toEqual(1)

  expect(layoutBoxElement?.getAttribute('style')?.includes('direction: column')).toEqual(true)
  expect(layoutBoxElement?.getAttribute('data-selected')).toEqual('true')
})




