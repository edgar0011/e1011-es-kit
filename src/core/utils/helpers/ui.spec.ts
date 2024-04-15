/**
 * @jest-environment jsdom
 */

import { anchorClick, classNames, generateId, noop } from './ui'

describe('classNames', () => {
  it('should have proper classNames string', () => {
    const classes = classNames(
      'my-class',
      true && 'other-class',
      false && 'some-other-class',
      !null && 'some-other-class2',
      (true || false) ?? 'last-class',
      ...['external-class', 'external-class2'],
    )

    expect(classes).toBe('my-class other-class some-other-class2 external-class external-class2')
  })

  it('should test generateId', () => {
    const generatedIds = [
      generateId('button'),
      generateId('button'),
      generateId('button'),
      generateId('button'),
      generateId('button'),
    ]

    expect(generatedIds).toEqual(['button0', 'button1', 'button2', 'button3', 'button4'])
  })

  it('should test anchroClick', async () => {
    anchorClick('https://www.google.com', '_blank')

    expect(anchorClick.aElement).toBeDefined()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const spyClick = jest.spyOn(anchorClick.aElement, 'click')

    anchorClick('https://www.google.com', '_blank', true)

    expect(spyClick).toHaveBeenCalled()

    expect(anchorClick.aElement).toBeNull()
  })

  it('should test noop', async () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      stopImmediatePropagation: jest.fn(),
    }

    const customEvent = new CustomEvent('ui-test-event')

    noop(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
    expect(event.stopImmediatePropagation).toHaveBeenCalled()

    const spyPreventDefault = jest.spyOn(customEvent, 'preventDefault')
    const spyStopPropagation = jest.spyOn(customEvent, 'stopPropagation')
    const spyStopImmediatePropagation = jest.spyOn(customEvent, 'stopImmediatePropagation')

    noop(customEvent)

    expect(spyPreventDefault).toHaveBeenCalled()
    expect(spyStopPropagation).toHaveBeenCalled()
    expect(spyStopImmediatePropagation).toHaveBeenCalled()
  })
})
