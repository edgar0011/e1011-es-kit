/**
 * Decorator functionality tests — verifies that decorators work correctly.
 */
import { Model, logger, convertor, converting } from '../core/utils/decorators/convert'

describe('decorators', () => {
  describe('exports', () => {
    it('exports logger as a function', () => {
      expect(typeof logger).toBe('function')
    })

    it('exports convertor as a function', () => {
      expect(typeof convertor).toBe('function')
    })

    it('exports converting as a function', () => {
      expect(typeof converting).toBe('function')
    })

    it('exports Model as a function (class)', () => {
      expect(typeof Model).toBe('function')
    })
  })

  describe('Model class', () => {
    let model: Model

    beforeEach(() => {
      model = new Model()
    })

    it('instantiates correctly', () => {
      expect(model).toBeInstanceOf(Model)
      expect(model.name).toBe('Model')
    })

    it('@converting("invert") inverts the return value of validate()', () => {
      // validate() returns true in source, but @converting('invert') should invert it to false
      const result = model.validate({ test: 'data' })

      expect(result).toBe(false)
    })

    it('@convertor does not modify message() behavior', () => {
      const result = model.message('hello')

      expect(result).toBe('hello')
    })

    it('@logger does not break the class', () => {
      // If logger broke the class, instantiation would fail above
      // Additionally, verify methods exist and are callable
      expect(typeof model.validate).toBe('function')
      expect(typeof model.message).toBe('function')
    })
  })
})
