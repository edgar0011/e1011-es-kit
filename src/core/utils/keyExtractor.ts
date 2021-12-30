import { memoizeComplex } from './helpers/other'

type ItemLikeObject = {
  key?: string
  id?: string | number
}

export function keyExtractorFunction<Item extends ItemLikeObject>(item: Item, index: number): string {
  return String(item?.key ?? item?.id ?? index)
}

export const keyExtractor = memoizeComplex(keyExtractorFunction)
