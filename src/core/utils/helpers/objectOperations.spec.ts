import { delay } from './helpers'
import { duplicatesInArray } from './objectOperations'

describe('Should find duplicates in array', () => {
  it('Should find duplicates in array', () => {
    const arr = [1, 2, 3, 4, 2, 3, 6, 7, 8, 9, 8]

    const duplicatesMap = duplicatesInArray(arr)
    console.log(duplicatesMap)
    expect(Object.keys(duplicatesMap as Record<string, number>).length).toEqual(3)
  })

  it('Should find duplicates in mixed types array', async () => {
    const arr = [1, 2, 3, 2, 'a', 5, 'a']
    expect.assertions(2)
    await delay(2000)
    // const response = await axios.get('http://www.google.com')
    // console.log(response)
    // console.log(response.data)
    const duplicatesMap = duplicatesInArray(arr)
    console.log(duplicatesMap)
    expect(Object.keys(duplicatesMap as Record<string, number>).length).toEqual(2)
    expect(duplicatesMap).toEqual({ 2: 2, a: 2 })
  })
})
