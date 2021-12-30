import { Limit, numberOperation, restrictNumberInLimits, Operation } from './valueOperations'

describe('valueOperations', () => {
  it('should limit number value', () => {
    const limit: Limit = { min: 0, max: 10 }

    expect(restrictNumberInLimits(11, limit)).toEqual(limit.max)

    expect(restrictNumberInLimits(5, limit)).toEqual(5)

    expect(restrictNumberInLimits(-6, limit)).toEqual(limit.min)
  })

  it('should do correct numeric operations', () => {
    const limit: Limit = { min: 0, max: 10 }

    expect(numberOperation(11, 6, Operation.ADD)).toEqual(17)

    expect(numberOperation(2, 6, Operation.ADD)).toEqual(8)

    expect(numberOperation(5, 6, Operation.ADD, limit)).toEqual(limit.max)

    expect(numberOperation(5, 6, Operation.SUBTRACT, limit)).toEqual(limit.min)

    expect(numberOperation(5, 6, Operation.SUBTRACT)).toEqual(-1)
  })
})
