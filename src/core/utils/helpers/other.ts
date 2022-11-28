import { memoizeWith, identity } from 'ramda'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nestedTernary = (condition: boolean, branchA: any, branchB: any): any => (condition ? branchA : branchB)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const memoize = memoizeWith(identity)

// Beware fellow developer, this is to be used with caution and precison
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const memoizeComplex = memoizeWith((...args) => JSON.stringify(args))

export const memoizer
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
= (memoizeFunc = (...args) => JSON.stringify(args)) => memoizeWith(memoizeFunc)

export const debounce = (func: () => void, wait = 100, immediate = false): () => void => {
  let timeout: any

  return function debounced(...args) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context: unknown = this
    const later = () => {
      clearTimeout(timeout)
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

export const delay = (delay: number): Promise<string> => new Promise((resolve) => {
  setTimeout(() => resolve(`delayed: ${delay}`), delay)
})
