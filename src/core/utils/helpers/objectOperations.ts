export const duplicatesInArray = (arr: unknown[]): null | Record<string, number> => {
  const setFromArr = new Set(arr)

  if (Array.from(setFromArr).length !== arr.length) {
    const foundDuplicates: Record<string, number> = {}
    const itemsMap: Record<string, number> = {}

    arr.forEach((item: unknown) => {
      if (itemsMap[String(item)] !== undefined) {
        foundDuplicates[String(item)] = itemsMap[String(item)] + 1
        itemsMap[String(item)] += 1
      } else {
        itemsMap[String(item)] = 1
      }
    })
    return foundDuplicates
  }
  return null
}

type Replacer = ((this: any, key: string, value: any) => any) | undefined
type Options = {
  graphQL?: boolean
  [key: string]: any
}

export const formatJsonString = (
  value: any, replacer?: Replacer, space?: string | number | undefined, { graphQL, ...options }: Options = {},
): string => {
  if (!graphQL) {
    return JSON.stringify(value, replacer, space)
  }
  const strValues: string[] = []

  Object.entries(value).forEach(([key, value]) => {
    let str = `${key}: `

    if (typeof value === 'object' && !Array.isArray(value)) {
      str += `${formatJsonString(value, replacer, space, { graphQL, ...options })}`
    } else {
      str += JSON.stringify(value)
    }
    strValues.push(str)
  })
  return `{${strValues.join(', ')}}`
}
