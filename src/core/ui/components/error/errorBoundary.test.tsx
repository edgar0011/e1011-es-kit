/**
 * @jest-environment jsdom
 */

import { render } from '../../../utils/test/testRenderer'

import classes from './errorBoundary.module.scss'
import { ErrorBoundary } from './ErrorBoundary'


const ErrorUI = (): React.ReactElement => {
  throw new Error('This Is Error')
}

describe('components/molecules/error/ErrorBoundary', () => {
  it('renders ErrorBoundary with classes', async () => {
    const rendered = render(<ErrorBoundary><ErrorUI /></ErrorBoundary>)

    const elements = rendered?.container.querySelectorAll(`.${classes.errorBoundary}`)

    const element = elements[0] as HTMLElement

    expect(rendered?.container).toBeDefined()
    expect(elements.length).toEqual(1)
    expect(element?.getAttribute('class')?.includes(classes.errorBoundary)).toEqual(true)
  })
})

