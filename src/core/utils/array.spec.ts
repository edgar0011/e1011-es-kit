/* eslint-disable no-extend-native */
import './array'

describe('Array prototype extensions', () => {
  describe('last getter', () => {
    it('should get the last element of an array', () => {
      const arr = [1, 2, 3, 4, 5]

      expect(arr.last).toEqual(5)
    })

    it('should get the last element of a string array', () => {
      const arr = ['a', 'b', 'c']

      expect(arr.last).toEqual('c')
    })

    it('should return undefined for an empty array', () => {
      const arr: number[] = []

      expect(arr.last).toBeUndefined()
    })

    it('should get the last element of a single-element array', () => {
      const arr = [42]

      expect(arr.last).toEqual(42)
    })
  })

  describe('last setter', () => {
    it('should set the last element of an array', () => {
      const arr = [1, 2, 3, 4, 5]

      arr.last = 10
      expect(arr.last).toEqual(10)
      expect(arr).toEqual([1, 2, 3, 4, 10])
    })

    it('should set the last element of a string array', () => {
      const arr = ['a', 'b', 'c']

      arr.last = 'z'
      expect(arr.last).toEqual('z')
      expect(arr).toEqual(['a', 'b', 'z'])
    })

    it('should set the last element of a single-element array', () => {
      const arr = [1]

      arr.last = 99
      expect(arr.last).toEqual(99)
      expect(arr).toEqual([99])
    })

    it('should handle setting last on an empty array', () => {
      const arr: number[] = []

      arr.last = 5
      // Setting last on empty array sets index -1, which doesn't add an element
      expect(arr.length).toEqual(0)
    })
  })

  describe('first getter', () => {
    it('should get the first element of an array', () => {
      const arr = [1, 2, 3, 4, 5]

      expect(arr.first).toEqual(1)
    })

    it('should get the first element of a string array', () => {
      const arr = ['a', 'b', 'c']

      expect(arr.first).toEqual('a')
    })

    it('should return undefined for an empty array', () => {
      const arr: number[] = []

      expect(arr.first).toBeUndefined()
    })

    it('should get the first element of a single-element array', () => {
      const arr = [42]

      expect(arr.first).toEqual(42)
    })
  })

  describe('first setter', () => {
    it('should set the first element of an array', () => {
      const arr = [1, 2, 3, 4, 5]

      arr.first = 10
      expect(arr.first).toEqual(10)
      expect(arr).toEqual([10, 2, 3, 4, 5])
    })

    it('should set the first element of a string array', () => {
      const arr = ['a', 'b', 'c']

      arr.first = 'z'
      expect(arr.first).toEqual('z')
      expect(arr).toEqual(['z', 'b', 'c'])
    })

    it('should set the first element of a single-element array', () => {
      const arr = [1]

      arr.first = 99
      expect(arr.first).toEqual(99)
      expect(arr).toEqual([99])
    })

    it('should set the first element of an empty array', () => {
      const arr: number[] = []

      arr.first = 5
      expect(arr.first).toEqual(5)
      expect(arr).toEqual([5])
    })
  })
})

