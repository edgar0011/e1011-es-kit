/**
 * @jest-environment jsdom
 */

import { ced, customElementDefine, createResolveAttribute, resolveAttributes } from './webComponent.utils'
import { CustomTitle } from './exampleCustomElement'


describe('customElementDefine util', () => {
  it('customElementDefine should work as expected', () => {
    expect(ced).toEqual(customElementDefine)

    expect(customElements.get('custom-title')).toEqual(CustomTitle)
  })
})

describe('createResolveAttribute util', () => {
  it('createResolveAttribute should work as expected', () => {
    const myTitle: Element & Record<string, unknown> = new CustomTitle() as (Element & Record<string, any>)

    const valueOfText = 'Value Of Text In Title'

    console.log('myTitle', myTitle)

    myTitle.setAttribute('valueOfText', valueOfText)

    expect(myTitle.getAttribute('valueOfText')).toEqual(valueOfText)

    expect(myTitle.valueOfText).toBeUndefined()

    console.log('myTitle.getAttribute', myTitle.getAttribute('valueOfText'))
    console.log('myTitle.valueOfText', myTitle.valueOfText)

    const resolveAttribute = createResolveAttribute(myTitle)

    resolveAttribute('valueOfText')

    expect(myTitle.valueOfText).toEqual(valueOfText)
  })

  it('resolveAttributes should work as expected', () => {
    const myTitle: Element & Record<string, unknown> = new CustomTitle() as (Element & Record<string, any>)

    const valueOfText = 'Value Of Text In Title'
    const someData = [3, 11, 17]

    console.log('myTitle', myTitle)

    myTitle.setAttribute('valueOfText', valueOfText)
    myTitle.setAttribute('someData', JSON.stringify(someData))

    expect(myTitle.getAttribute('valueOfText')).toEqual(valueOfText)
    expect(myTitle.getAttribute('someData')).toEqual(JSON.stringify(someData))

    expect(myTitle.valueOfText).toBeUndefined()
    expect(myTitle.someData).toBeUndefined()

    resolveAttributes(myTitle, ['valueOfText', 'someData'])

    expect(myTitle.valueOfText).toEqual(valueOfText)
    expect(myTitle.someData).toEqual(JSON.stringify(someData))
  })
})
