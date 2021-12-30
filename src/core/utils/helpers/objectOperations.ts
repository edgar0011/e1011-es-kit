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
