/**
 * @jest-environment jsdom
 */

import { ced, customElementDefine, createResolveAttribute } from './coreElements'
import { CustomTitle } from './exampleCustomElement'


describe('customElementDefine util', () => {
  it('customElementDefine should work as expected', () => {
    expect(ced).toEqual(customElementDefine)

    expect(customElements.get('custom-title')).toEqual(CustomTitle)
  })
})

describe('createResolveAttribute util', () => {
  it('createResolveAttribute should work as expected', () => {
    const myTitle: Element & Record<string, any> = new CustomTitle() as (Element & Record<string, any>)

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
})
