/**
 * @jest-environment jsdom
 */

import { fireEvent } from '@testing-library/react'

import { Toggle } from './Toggle'
import classes from './toggle.module.scss'

import { noop } from 'core/utils'
import { render } from 'core/utils/test/testRenderer'

describe('components/atoms/toggle/Toggle', () => {
  test('renders Toggle with classes', async () => {
    const rendered = render(<Toggle id='toggle1' className='testclass' onChange={noop} />)

    const elements = rendered?.container.querySelectorAll('.toggle')

    const element = elements[0] as HTMLElement

    expect(rendered?.container).toBeDefined()
    expect(elements?.length).toEqual(1)
    expect(element?.getAttribute('class')?.includes('testclass')).toEqual(true)
    expect(element?.getAttribute('class')?.includes(classes.toggle)).toEqual(true)
  })

  test('Toggle is disabled', async () => {
    const rendered = render(<Toggle id='toggle1' className='testclass' disabled onChange={noop} />)

    const elements = rendered?.container.querySelectorAll('.toggle')

    expect(elements[0].querySelector('input')).toBeDisabled()
  })

  test('Toggle to be checked', async () => {
    const rendered = render(<Toggle id='toggle1' className='testclass' checked onChange={noop} />)

    const elements = rendered?.container.querySelectorAll('.toggle')

    // console.log(prettyDOM(elements[0]))

    expect(elements[0].querySelector('input')).toBeChecked()
  })

  test('Toggle has correct default value/state', async () => {
    const rendered = render(<Toggle id='toggle1' onChange={noop} />)

    const elements = rendered?.container.querySelectorAll('.toggle')

    expect(elements[0].querySelector('input')).not.toBeChecked()
    expect(elements[0].querySelector('input')).not.toBeDisabled()
  })

  test('Toggle changes state on click', async () => {
    const rendered = render(<Toggle id='toggle1' onChange={noop} />)

    const input = rendered?.container.querySelectorAll('.toggle')[0].querySelector('input')

    expect(input).not.toBeChecked()
    input && fireEvent.click(input)
    expect(input).toBeChecked()
  })
})
