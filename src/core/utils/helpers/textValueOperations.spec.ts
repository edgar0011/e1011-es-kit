import {
  toLowerCase, toUpperCase, fileNameExt,
  removeWhitespaces,
  normalizeString, findStringInText,
} from './textValueOperations'

describe('textValueOperations', () => {
  it('should convert text to lower case', () => {
    const str = 'Helo World'

    expect(toLowerCase(str)).toEqual(str.toLowerCase())

    expect(toLowerCase('ABCDEFGH*&^@#(JHFJ')).toEqual('abcdefgh*&^@#(jhfj')
  })
  it('should convert text to upper case', () => {
    const str = 'Helo World'

    expect(toUpperCase(str)).toEqual(str.toUpperCase())

    expect(toUpperCase('abcdefgh*&^@#(jhfj')).toEqual('ABCDEFGH*&^@#(JHFJ')
  })

  it('should remove all white spaces', () => {
    const str = ' Helo World '

    expect(removeWhitespaces(str)).toEqual('HeloWorld')
  })

  it('should get filename ext', () => {
    const fileName = 'veryLongFileName.domain.csv'

    expect(fileNameExt(fileName)).toEqual('csv')
  })

  it('should get filename ext 2', () => {
    const fileName = 'd.html'

    expect(fileNameExt(fileName)).toEqual('html')
  })

  it('should get filename ext 3', () => {
    const fileName = 'd.htmlReallyLong'

    expect(fileNameExt(fileName)).toEqual('htmlReallyLong')
  })

  it('should not get filename ext', () => {
    const fileName = 'veryLongFileName-domain'

    expect(fileNameExt(fileName)).toEqual('')
  })

  it('should normalize string, remove diacritics', () => {
    const str = 'ěščřžýáíéůňľď'

    expect(normalizeString(str)).toEqual('escrzyaieunld')
  })

  it('should find string in text', () => {
    const str = 'needle'
    const text = 'haystack haystack haystack haystack haystack needlehaystack haystack haystack haystack '

    expect(findStringInText(str, text)).toBeTruthy()
  })

  it('should find string in text 2', () => {
    const str = 'řeřicha'
    const text = 'řekni Řeřicha'

    expect(findStringInText(str, text)).toBeTruthy()
  })

  it('should find string in text 2', () => {
    const str = 'řeřicha'
    const text = 'řekni Řeřicha'

    expect(findStringInText(str, text, false)).toBeFalsy()
  })

  it('should find string in text 2', () => {
    const str = 'řeřicha'
    const text = 'řekni Rericha'

    expect(findStringInText(str, text, false, false)).toBeFalsy()
  })
})
