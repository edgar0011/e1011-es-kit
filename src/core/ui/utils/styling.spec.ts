import { pxToRem, defaultFontSize } from './style'

it(`pxToRem to convert pixels to rem (${defaultFontSize})`, () => {
  expect(pxToRem(200)).toEqual(200 / defaultFontSize)
})
