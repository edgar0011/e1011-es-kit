import { ArrayFirst, ArrayLast } from './array'

describe('ArrayFirst', () => {
  it('should get the first element of an array', () => {
    expect(ArrayFirst([1, 2, 3, 4, 5])).toEqual(1)
  })

  it('should get the first element of a string array', () => {
    expect(ArrayFirst(['a', 'b', 'c'])).toEqual('a')
  })

  it('should return undefined for an empty array', () => {
    expect(ArrayFirst([])).toBeUndefined()
  })

  it('should get the first element of a single-element array', () => {
    expect(ArrayFirst([42])).toEqual(42)
  })
})

describe('ArrayLast', () => {
  it('should get the last element of an array', () => {
    expect(ArrayLast([1, 2, 3, 4, 5])).toEqual(5)
  })

  it('should get the last element of a string array', () => {
    expect(ArrayLast(['a', 'b', 'c'])).toEqual('c')
  })

  it('should return undefined for an empty array', () => {
    expect(ArrayLast([])).toBeUndefined()
  })

  it('should get the last element of a single-element array', () => {
    expect(ArrayLast([42])).toEqual(42)
  })
})
