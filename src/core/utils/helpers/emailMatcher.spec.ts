import { emailMatch, regexBuilder, emailMatcher } from './emailMatcher'

describe('emailMatcher', () => {
  it('should match email with prefix mask', () => {
    const rgx = regexBuilder('gmail.com', 'ext.')

    expect(rgx.test('ddssds@gmail.com')).toBe(false)
    expect(rgx.test('extddssds@gmail.com')).toBe(false)
    expect(rgx.test('ext.ddssds@gmail.com')).toBe(true)

    expect(rgx.test('ddssds@gmail.com')).toEqual(emailMatch(rgx, 'ddssds@gmail.com'))
    expect(rgx.test('extddssds@gmail.com')).toEqual(emailMatch(rgx, 'extddssds@gmail.com'))
    expect(rgx.test('ext.ddssds@gmail.com')).toEqual(emailMatch(rgx, 'ext.ddssds@gmail.com'))
  })

  it('should match email with suffix mask', () => {
    const rgx = regexBuilder('gmail.com', '', '.ddssds')

    expect(rgx.test('xddssds@gmail.com')).toBe(false)
    expect(rgx.test('extddssds@gmail.com')).toBe(false)
    expect(rgx.test('ext.ddssds@gmail.com')).toBe(true)

    expect(rgx.test('xddssds@gmail.com')).toEqual(emailMatcher('gmail.com', '', '.ddssds', 'xddssds@gmail.com'))
    expect(rgx.test('extddssds@gmail.com')).toEqual(emailMatcher('gmail.com', '', '.ddssds', 'extddssds@gmail.com'))
    expect(rgx.test('ext.ddssds@gmail.com')).toEqual(emailMatcher('gmail.com', '', '.ddssds', 'ext.ddssds@gmail.com'))
  })

  it('should match email with prefix and suffix mask', () => {
    const rgx = regexBuilder('gmail.com', 'ext.', '.Novak')

    expect(rgx.test('JanNovak@gmail.com')).toBe(false)
    expect(rgx.test('Jan.Novak@gmail.com')).toBe(false)
    expect(rgx.test('extJan.Novak@gmail.com')).toBe(false)
    expect(rgx.test('ext.Jan.Novak@gmail.com')).toBe(true)
  })

  it('should match email without any prefix and suffix mask', () => {
    const rgx = regexBuilder('martin.weiser@gmail.com')

    expect(rgx.test('JanNovak@gmail.com')).toBe(false)
    expect(rgx.test('Jan.Novak@gmail.com')).toBe(false)
    expect(rgx.test('martinweiser@gmail.com')).toBe(false)
    expect(rgx.test('martin.weiser@gmail.com')).toBe(true)
  })
})
