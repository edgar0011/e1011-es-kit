export const regexBuilder
= (domain: string, prefix = '', suffix = ''): RegExp => {
  const normPrefix = prefix.replace('.', '\\.')
  const normSuffix = suffix.replace('.', '\\.')

  if (normPrefix && normSuffix) {
    return new RegExp(
      `^(${normPrefix})+(.+)+(${normSuffix})+@(${domain})$`,
    )
  } if (normPrefix) {
    return new RegExp(
      `^(${normPrefix})+(.+)+@(${domain})$`,
    )
  } if (normSuffix) {
    return new RegExp(
      `^(.+)+(${normSuffix})+@(${domain})$`,
    )
  }
  return new RegExp(
    `^(${domain})$`,
  )
}

export const emailMatch = (rgx:RegExp, email:string): boolean => rgx.test(email)

// eslint-disable-next-line default-param-last
export const emailMatcher = (domain: string, prefix = '', suffix = '', email:string): boolean => {
  const rgx: RegExp = regexBuilder(domain, prefix, suffix)

  return emailMatch(rgx, email)
}

// const rgx = regexBuilder('gmail.com', 'ext.')
// const rgx2 = regexBuilder('gmail.com', '', 'ddssds')

// console.log(rgx.test('ddssds@gmail.com'))
// console.log(rgx.test('extddssds@gmail.com'))
// console.log(rgx.test('ext.ddssds@gmail.com'))

// console.log(rgx2.test('xddssds@gmail.com'))
// console.log(rgx2.test('extddssds@gmail.com'))
// console.log(rgx2.test('ext.ddssds@gmail.com'))
