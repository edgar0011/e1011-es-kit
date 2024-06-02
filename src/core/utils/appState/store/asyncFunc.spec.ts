const AsyncFunction = (async (): Promise<void> => {}).constructor

describe('Detect Async Function', () => {
  it('Should detect async function', () => {
    const funcA = async (name: string): Promise<string> => `FuncA ${name}`

    console.log('funcA', funcA)
    // console.log('funcA[Symbol.toStringTag]', funcA[Symbol.toStringTag])
    console.log('funcA.constructor', funcA.constructor)
    console.log('AsyncFunction.prototype.constructor', AsyncFunction.prototype.constructor)
    expect(funcA.constructor === AsyncFunction.prototype.constructor).toEqual(true)
  })
})
