/**
 * @jest-environment jsdom
 */

import { TextAndContent } from './TextAndContent'
import classes from './textAndContent.module.scss'

import { render } from 'core/utils/test/testRenderer'


describe('components/atoms/textAndContent/TextAndContent', () => {
  it('renders TextAndContent with classes', async () => {
    const rendered = render(<TextAndContent text='Here is some text' className='anotherClass' />)

    const elements = rendered?.container.querySelectorAll('.anotherClass')

    const element = elements[0] as HTMLElement

    expect(rendered?.container).toBeDefined()
    expect(elements?.length).toEqual(1)
    expect(element?.getAttribute('class')?.includes('anotherClass')).toEqual(true)
    expect(element?.getAttribute('class')?.includes(classes.textAndContent)).toEqual(true)
  })
})

