/**
 * @jest-environment jsdom
 */

import { ced, customElementDefine } from './coreElements'
import { CustomTitle } from './exampleCustomElement'


describe('customElement utils', () => {
  it('customElementDefine shoudl work as expected', () => {
    expect(ced).toEqual(customElementDefine)

    expect(customElements.get('custom-title')).toEqual(CustomTitle)
  })
})
