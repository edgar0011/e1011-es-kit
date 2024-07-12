/**
 * @jest-environment jsdom
 */

import { Tag } from './Tag'
import { TagVariant } from './tag.types'
import classes from './tag.module.scss'

import { render } from 'core/utils/test/testRenderer'


test('renders Tag with classes', async () => {
  const rendered = render(<Tag variant={TagVariant.information} text='unit test is cool' />)

  const elements = rendered?.container.querySelectorAll('.tag')

  const element = elements[0] as HTMLElement

  expect(rendered?.container).toBeDefined()
  expect(elements?.length).toEqual(1)
  expect(element?.getAttribute('class')?.includes('tag')).toEqual(true)
  expect(element?.getAttribute('class')?.includes('information')).toEqual(true)
  expect(element?.getAttribute('class')?.includes('high')).toEqual(false)
  expect(element?.getAttribute('class')?.includes(classes.tag)).toEqual(true)
})
