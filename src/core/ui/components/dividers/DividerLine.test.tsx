/**
 * @jest-environment jsdom
 */

import { render } from '../../../utils/test/testRenderer'

import { DividerLine } from './DividerLine'
import classes from './divider.module.scss'

test('renders DividerLine with classes', async () => {
  const rendered = render(<DividerLine />)

  const dividerLineElements = rendered?.container.querySelectorAll(`.${classes['divider-line']}`)

  const dividerElement = dividerLineElements[0] as HTMLElement

  expect(rendered?.container).toBeDefined()
  expect(dividerLineElements?.length).toEqual(1)
  expect(dividerElement?.getAttribute('class')?.includes('horizontal')).toEqual(true)
})


