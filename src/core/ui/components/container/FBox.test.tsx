/**
 * @jest-environment jsdom
 */

import { render } from '../../../utils/test/testRenderer'

import { FBox } from './FBox'
import classes from './fbox.module.scss'

test('renders FBox with classes', async () => {
  const rendered = render(<FBox direction='column' data-selected tabIndex='0' />)

  const fboxElements = rendered?.container.querySelectorAll(`.${classes['flexible-box']}`)

  const fboxElement = fboxElements[0] as HTMLElement

  expect(rendered?.container).toBeDefined()
  expect(fboxElements?.length).toEqual(1)

  console.log('fboxElement', fboxElement.outerHTML)

  console.log('fboxElement.getAttribute(\'data-selected\')', fboxElement.getAttribute('data-selected'))

  expect(fboxElement?.getAttribute('style')?.includes('direction: column')).toEqual(true)
  expect(fboxElement?.getAttribute('data-selected')).toEqual('true')
})


