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

const simpleIdentiy = (value: string | number) => `${value}`

export const formatObj = (
  obj: Record<string, string | number>,
  delimiter = ', ',
  mapValue: ((value: string | number) => string) = simpleIdentiy,
  mapKey: ((value: string | number) => string) = simpleIdentiy,
): string => (typeof obj === 'object'
  ? Object.entries(obj).map(([key, value]) => `${mapKey(key)}: ${mapValue(value)}`).join(delimiter)
  : '')

export const chunkArray = (dataArray: any[], chunkSize = 100): (any[])[] => {
  const result = []

  const len = dataArray.length

  for (let i = 0; i < len; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize)

    result.push(chunk)
  }
  return result
}

type TreeNodeStr = (string | TreeNodeStr)[]

type TreeNode = {
  name: string
  children?: Record<string, TreeNode>
}

// ['app', ['user', 'dashboard', ['ui', ['header', 'footer', 'menu'], 'realTime']]]

export const arrayToObjectTree = (itemsInTree: TreeNodeStr[]) => {
  let previousParent: TreeNode

  const innerMake = (items: TreeNodeStr[]): Record<string, TreeNode> => {
    const treeObject: Record<string, TreeNode> = items.reduce((tree: Record<string, TreeNode>, item, index, array) => {
      let resolvedTree: Record<string, TreeNode> = { ...tree }

      if (typeof item === 'string') {
        resolvedTree[item] = { name: item }
        if (!previousParent) {
          previousParent = resolvedTree[item]
        }

        if (index === 0 && Array.isArray(array[1])) {
          previousParent = resolvedTree[item]
        }
      }
      if (Array.isArray(item)) {
        let parent = previousParent

        if (index > 1) {
          resolvedTree[item[0] as string] = resolvedTree[item[0] as string] || { name: item[0] }
          parent = resolvedTree[item[0] as string]

          resolvedTree = { ...resolvedTree, ...innerMake(item as TreeNodeStr[]) }
        } else {
          parent.children = innerMake(item as TreeNodeStr[])
        }
      }
      return resolvedTree
    }, {})

    return treeObject
  }

  return innerMake(itemsInTree)
}
