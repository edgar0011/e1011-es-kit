import { delay } from '../../utils/helpers'

import { pxToRem, defaultFontSize } from './style'

describe('styling utils', () => {
  it(`pxToRem to convert pixels to rem (${defaultFontSize})`, async () => {
    expect.assertions(1)
    await delay(1000)
    expect(pxToRem(200)).toEqual(200 / defaultFontSize)
  })
})
