import { isValidFormat, isValidModulo11, parse } from './birthnumberCZSKvalidator'


describe('Birthnumber validator, parser', () => {
  it('should test valid format', () => {
    expect(isValidFormat('7711309782')).toEqual(true)

    expect(isValidFormat('771130/9782')).toEqual(true)

    expect(isValidFormat('771130978')).toEqual(true)

    expect(isValidFormat('771130/978')).toEqual(true)

    expect(isValidFormat('9910101300')).toEqual(true)

    // invalid
    expect(isValidFormat('123456/7890')).toEqual(false)

    expect(isValidFormat('123456789')).toEqual(false)

    expect(isValidFormat('123456/789')).toEqual(false)

    // testing
    expect(isValidFormat('2210702220')).toEqual(false)


    expect(isValidFormat('1234560ds7f89')).toEqual(false)
    expect(isValidFormat('123456/7f89')).toEqual(false)
  })

  it('should test valid modulo11', () => {
    expect(isValidModulo11('7401040020')).toEqual(true)

    expect(isValidModulo11('7711309782')).toEqual(true)

    expect(isValidModulo11('9910101300')).toEqual(true)

    // num digits lower then 10, hence true by default
    expect(isValidModulo11('771130978')).toEqual(true)
  })


  it('should parse birthumber correctly', () => {
    let date = parse('7401040020')
    expect(date?.year).toEqual(1974)
    expect(date?.month).toEqual('01')
    expect(date?.day).toEqual('04')

    date = parse('740104/0020')
    expect(date?.year).toEqual(1974)
    expect(date?.month).toEqual('01')
    expect(date?.day).toEqual('04')

    date = parse('771130978')
    expect(date?.year).toEqual(1877)
    expect(date?.month).toEqual('11')
    expect(date?.day).toEqual('30')

    date = parse('771130/978')
    expect(date?.year).toEqual(1877)
    expect(date?.month).toEqual('11')
    expect(date?.day).toEqual('30')

    date = parse('7711309782')
    expect(date?.year).toEqual(1977)
    expect(date?.month).toEqual('11')
    expect(date?.day).toEqual('30')

    date = parse('771130/9782')
    expect(date?.year).toEqual(1977)
    expect(date?.month).toEqual('11')
    expect(date?.day).toEqual('30')

    console.log(parse('9910101230'))
  })
})
