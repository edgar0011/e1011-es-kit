import { delay } from '../../utils/helpers'

import { pxToRem, defaultFontSize, convertHex, convertRGB } from './style'

describe('styling utils', () => {
  it(`pxToRem to convert pixels to rem (${defaultFontSize})`, async () => {
    expect.assertions(1)
    await delay(1000)
    expect(pxToRem(200)).toEqual(200 / defaultFontSize)
  })

  it('should convert hex to rgb', () => {
    const hex = convertHex('#FFFFFF', 0.5)

    expect(hex).toEqual('#FFFFFF80'.toLowerCase())

    const hex2 = convertHex('#FFFFFF', 100)

    expect(hex2).toEqual('#FFFFFFFF'.toLowerCase())

    const hex3 = convertHex('#FFFFFF', 100, true)

    expect(hex3).toEqual('rgba(255,255,255,1)'.toLowerCase())
  })

  it('should convert rgb to hex', () => {
    const hex = convertRGB(255, 255, 255, 0.5)

    expect(hex).toEqual('#FFFFFF80'.toLowerCase())

    const hex2 = convertRGB(255, 255, 255, 1)

    expect(hex2).toEqual('#FFFFFFFF'.toLowerCase())
  })
})
