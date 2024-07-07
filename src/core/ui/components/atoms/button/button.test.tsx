/**
 * @jest-environment jsdom
 */

import { Button } from './Button'
import classes from './button.module.scss'

import { render } from 'core/utils/test/testRenderer'


describe('components/atoms/button/Button', () => {
  it('renders Button with classes', async () => {
    const rendered = render(<Button className='anotherClass' />)

    const elements = rendered?.container.querySelectorAll('.anotherClass')

    const element = elements[0] as HTMLElement

    expect(rendered?.container).toBeDefined()
    expect(elements?.length).toEqual(1)
    expect(element?.getAttribute('class')?.includes('anotherClass')).toEqual(true)
    expect(element?.getAttribute('class')?.includes(classes.button)).toEqual(true)
  })
})
