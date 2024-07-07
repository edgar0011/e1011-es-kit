/**
 * @jest-environment jsdom
 */
import classes from './popup.module.scss'
import { Popup } from './Popup'

import { render } from 'core/utils/test/testRenderer'


test('renders Popup with classes', async () => {
  const rendered = render(<Popup className='anotherClass' />)

  const elements = rendered?.container.querySelectorAll(`.${classes['popup-container']}`)
  const elements2 = rendered?.container.querySelectorAll(`.${classes['popup-container-inner']}`)


  expect(rendered?.container).toBeDefined()
  expect(elements?.length).toEqual(1)
  expect(elements2?.length).toEqual(1)
})
