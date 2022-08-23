import { delay } from './other'
import { duplicatesInArray, formatJsonString, chunkArray } from './objectOperations'

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

describe('formatJsonString', () => {
  it('Should format object same as JSON.stringify', () => {
    const g = { name: 'g', values: [1, 2, 3], meta: { context: undefined, wrapped: true } }

    expect(formatJsonString(g)).toEqual(JSON.stringify(g))

    expect(formatJsonString(g, null, 2)).toEqual(JSON.stringify(g, null, 2))
  })

  it('Should format object for graphql', () => {
    const g = { name: 'g', values: [1, 2, 3], meta: { context: undefined, wrapped: true, label: 'Data' } }

    console.log(formatJsonString(g, null, 2, { graphQL: true }))
  })
})

describe('chunkArray', () => {
  it('Should slice array', () => {
    const data = Array(1000).fill(1).map((_, index) => index)

    const chunkSize = 310
    const chunkedArray = chunkArray(data, chunkSize)

    expect(chunkedArray.length).toEqual(Math.ceil(data.length / chunkSize))
    expect(chunkedArray.reduce((sum, { length }) => sum + length, 0)).toEqual(data.length)
  })
})
