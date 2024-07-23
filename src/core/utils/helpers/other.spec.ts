import { AsyncFunctionTemplate, isFunctionAsync, memoize, memoizeComplex, memoizer } from './other'

describe('memoize', () => {
  it('should memoize function product with text primitive args', () => {
    const tobeMemoizedInner = (name: string): string => `Decorated ${name}`
    const tobeMemoized = jest.fn(tobeMemoizedInner)
    const memoized = memoize(tobeMemoized)

    // 1st
    expect(tobeMemoized('Karel')).toEqual('Decorated Karel')

    // 2nd, 3rd
    expect(memoized('Karel')).toEqual(tobeMemoized('Karel'))

    // defacto 2nd
    expect(memoized('Karel')).toEqual('Decorated Karel')

    // 4th
    expect(memoized('Linda')).toEqual('Decorated Linda')

    expect(tobeMemoized.mock.calls.length).toBe(4)
  })

  it('should memoize function product with multimple primitive args', () => {
    const tobeMemoizedInner = (name: string, index = 0): string => `Decorated ${name}, ${index}`
    const tobeMemoized = jest.fn(tobeMemoizedInner)
    const memoized = memoizeComplex(tobeMemoized)

    // 1st
    expect(tobeMemoized('Karel', 1)).toEqual('Decorated Karel, 1')

    // 2nd, 3rd
    expect(memoized('Karel', 2)).toEqual(tobeMemoized('Karel', 2))

    // defacto 2nd
    expect(memoized('Karel', 2)).toEqual('Decorated Karel, 2')

    // 4th
    expect(memoized('Linda')).toEqual('Decorated Linda, 0')

    expect(tobeMemoized.mock.calls.length).toBe(4)
  })

  it('should create memoise fc, via memoizer factory', () => {
    const tobeMemoizedInner = (name: string, index = 0): string => `Decorated ${name}, ${index}`
    const tobeMemoized = jest.fn(tobeMemoizedInner)
    // const memoizeFunc = memoizer((name, index) => `${name}-${index}`) versus:
    const memoizeFunc = memoizer((name) => `${name}`)
    const memoized = memoizeFunc(tobeMemoized)

    // 1st
    expect(tobeMemoized('Karel', 1)).toEqual('Decorated Karel, 1')

    // 2nd, 3rd
    expect(memoized('Karel', 2)).toEqual(tobeMemoized('Karel', 2))

    // defacto 2nd
    expect(memoized('Karel', 3)).toEqual('Decorated Karel, 2')

    expect(memoized('Karel', 4)).toEqual('Decorated Karel, 2')

    // 4th
    expect(memoized('Linda')).toEqual('Decorated Linda, 0')

    expect(tobeMemoized.mock.calls.length).toBe(4)
  })

  it('Should detect async function', () => {
    const funcA = async (name: string): Promise<string> => `FuncA ${name}`

    console.log('funcA', funcA)
    // console.log('funcA[Symbol.toStringTag]', funcA[Symbol.toStringTag])
    console.log('funcA.constructor', funcA.constructor)
    console.log('AsyncFunction.prototype.constructor', AsyncFunctionTemplate.prototype.constructor)
    expect(isFunctionAsync(funcA)).toEqual(true)
  })
})
