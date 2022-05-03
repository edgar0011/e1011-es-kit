export type Limit = {
  min?: number
  max?: number
};

export const numberDefined = (value?: number | undefined | null): boolean => value !== undefined && value !== null

export const restrictNumberInLimits = (value: number, limit?: Limit): number => Math.max(
  Math.min(value, numberDefined(limit?.max) ? (limit?.max as number) : Infinity),
  numberDefined(limit?.min) ? (limit?.min as number) : -Infinity,
)

export enum Operation {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

export const numberOperation = (
  value: number,
  operand: number,
  operation: Operation,
  limit?: Limit,
): number => {
  let result = 0

  switch (operation) {
    case Operation.ADD: {
      result = value + operand
      break
    }
    case Operation.SUBTRACT: {
      result = value - operand
      break
    }
    case Operation.MULTIPLY: {
      result = value * operand
      break
    }
    case Operation.DIVIDE: {
      result = operand === 0 ? 0 : value / operand
      break
    }
    default:
      value
  }

  return restrictNumberInLimits(result, limit)
}

export const incerementValue
  = (value: number, inc = 1, limit?: Limit): number => numberOperation(value, inc, Operation.ADD, limit)

export const decrementValue
  = (value: number, inc = 1, limit?: Limit): number => numberOperation(value, inc, Operation.SUBTRACT, limit)

export const setValue = (
  value: number | string | Record<string, unknown> | any,
  limit?: Limit,
): any => (typeof value === 'number' && limit ? restrictNumberInLimits(value, limit) : value)
