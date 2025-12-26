/* eslint-disable no-extend-native */
Object.defineProperty(Array.prototype, 'last', {
  get() { return this[this.length - 1] },
  set(v) { this[this.length - 1] = v; return this },
})


Object.defineProperty(Array.prototype, 'first', {
  get() { return this[0] },
  set(v) { this[0] = v; return this },
})

// redeclare array, to have last, first accessors
declare global {
  interface Array<T> {
    last: T | undefined
    first: T | undefined
  }
}

export default Array.prototype


export const ArrayFirst = Array.prototype.first
export const ArrayLast = Array.prototype.last
