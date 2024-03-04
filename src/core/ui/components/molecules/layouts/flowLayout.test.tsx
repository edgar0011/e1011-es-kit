/**
 * @jest-environment jsdom
 */

import { render } from '../../../../utils/test/testRenderer'

import { FlowLayout } from './FlowLayout'
import classes from './flowLayout.module.scss'


const itemDTOs = [
  {
    id: 'item1',
    Component: () => <div>Item 1</div>,
  },
]

describe('components/molecules/layouts/FlowLayout', () => {
  it('renders FlowLayout with classes', async () => {
    const rendered = render(<FlowLayout className='anotherClass' itemDTOs={itemDTOs} />)

    const elements = rendered?.container.querySelectorAll('.anotherClass')

    const element = elements[0] as HTMLElement

    expect(rendered?.container).toBeDefined()
    expect(elements?.length).toEqual(1)
    expect(element?.getAttribute('class')?.includes('anotherClass')).toEqual(true)
    expect(element?.getAttribute('class')?.includes(classes.flowLayout)).toEqual(true)
  })
})
