/**
 * Key functionality smoke tests — verifies critical utilities work correctly.
 */
import {
  toLowerCase,
  toUpperCase,
  truncateText,
  sanitizeId,
} from '../core/utils/helpers/textValueOperations'
import {
  restrictNumberInLimits,
  numberOperation,
  Operation,
} from '../core/utils/helpers/valueOperations'
import { debounce, delay, memoize } from '../core/utils/helpers/other'
import { createStore } from '../core/utils/appState/store'
import { PeregrineMQ } from '../core/utils/appState/peregrineMQ'
import { EventName, KeyCode, Alerts } from '../core/constants'

/* ------------------------------------------------------------------ */
/*  String helpers                                                    */
/* ------------------------------------------------------------------ */
describe('string helpers', () => {
  describe('toLowerCase', () => {
    it('converts string to lowercase', () => {
      expect(toLowerCase('HELLO')).toBe('hello')
    })

    it('returns empty string for falsy input', () => {
      expect(toLowerCase('')).toBe('')
    })
  })

  describe('toUpperCase', () => {
    it('converts string to uppercase', () => {
      expect(toUpperCase('hello')).toBe('HELLO')
    })

    it('returns empty string for falsy input', () => {
      expect(toUpperCase('')).toBe('')
    })
  })

  describe('truncateText', () => {
    it('truncates text exceeding maxNumChars', () => {
      expect(truncateText('Hello, World!', 5)).toBe('Hello...')
    })

    it('does not truncate text within limit', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })

    it('uses custom indicator', () => {
      expect(truncateText('Hello, World!', 5, '…')).toBe('Hello…')
    })

    it('returns full text when maxNumChars is 0', () => {
      expect(truncateText('Hello, World!', 0)).toBe('Hello, World!')
    })
  })

  describe('sanitizeId', () => {
    it('lowercases and replaces spaces with hyphens', () => {
      expect(sanitizeId('Hello World')).toBe('hello-world')
    })

    it('removes quotes', () => {
      expect(sanitizeId('"Test"')).toBe('test')
    })
  })
})

/* ------------------------------------------------------------------ */
/*  Value operations                                                  */
/* ------------------------------------------------------------------ */
describe('value operations', () => {
  describe('restrictNumberInLimits', () => {
    it('clamps value to min', () => {
      expect(restrictNumberInLimits(-5, { min: 0 })).toBe(0)
    })

    it('clamps value to max', () => {
      expect(restrictNumberInLimits(150, { max: 100 })).toBe(100)
    })

    it('returns value when within limits', () => {
      expect(restrictNumberInLimits(50, { min: 0, max: 100 })).toBe(50)
    })

    it('returns value when no limit is provided', () => {
      expect(restrictNumberInLimits(42)).toBe(42)
    })
  })

  describe('numberOperation', () => {
    it('adds values', () => {
      expect(numberOperation(10, 5, Operation.ADD)).toBe(15)
    })

    it('subtracts values', () => {
      expect(numberOperation(10, 5, Operation.SUBTRACT)).toBe(5)
    })

    it('multiplies values', () => {
      expect(numberOperation(10, 5, Operation.MULTIPLY)).toBe(50)
    })

    it('divides values', () => {
      expect(numberOperation(10, 5, Operation.DIVIDE)).toBe(2)
    })

    it('returns 0 for division by zero', () => {
      expect(numberOperation(10, 0, Operation.DIVIDE)).toBe(0)
    })

    it('respects limits on result', () => {
      expect(numberOperation(10, 100, Operation.ADD, { max: 50 })).toBe(50)
    })
  })
})

/* ------------------------------------------------------------------ */
/*  Async helpers                                                     */
/* ------------------------------------------------------------------ */
describe('async helpers', () => {
  describe('debounce', () => {
    it('returns a function', () => {
      const debounced = debounce(() => {}, 100)

      expect(typeof debounced).toBe('function')
    })
  })

  describe('delay', () => {
    it('resolves after the specified delay', async () => {
      const result = await delay(10)

      expect(result).toBe('delayed: 10')
    })
  })

  describe('memoize', () => {
    it('caches function results', () => {
      let callCount = 0
      const fn = memoize((x: number) => {
        callCount += 1
        return x * 2
      })

      expect(fn(5)).toBe(10)
      expect(fn(5)).toBe(10)
      expect(callCount).toBe(1)
    })
  })
})

/* ------------------------------------------------------------------ */
/*  Store                                                             */
/* ------------------------------------------------------------------ */
describe('createStore', () => {
  it('creates a store with initial state', () => {
    const store = createStore({ count: 0 })

    expect(store.getState()).toEqual({ count: 0 })
  })

  it('updates state via setState', async () => {
    const store = createStore({ count: 0 })

    await store.setState({ count: 5 })
    expect(store.getState()).toEqual({ count: 5 })
  })

  it('notifies subscribers on state change', async () => {
    const store = createStore({ count: 0 })
    const listener = jest.fn()

    store.subscribe(listener)

    await store.setState({ count: 1 })
    expect(listener).toHaveBeenCalledWith({ count: 1 })
  })

  it('unsubscribes listeners', async () => {
    const store = createStore({ count: 0 })
    const listener = jest.fn()
    const unsubscribe = store.subscribe(listener)

    unsubscribe()
    await store.setState({ count: 1 })
    expect(listener).not.toHaveBeenCalled()
  })

  it('merges state by default', async () => {
    const store = createStore({ a: 1, b: 2 })

    await store.setState({ a: 10 })
    expect(store.getState()).toEqual({ a: 10, b: 2 })
  })
})

/* ------------------------------------------------------------------ */
/*  PeregrineMQ                                                       */
/* ------------------------------------------------------------------ */
describe('PeregrineMQ', () => {
  let mq: InstanceType<typeof PeregrineMQ>

  beforeEach(() => {
    mq = new PeregrineMQ('test-instance', { allowClear: true })
  })

  afterEach(() => {
    mq.clear()
  })

  it('creates an instance with an id', () => {
    expect(mq.getId()).toBe('test-instance')
  })

  it('subscribe and publish', () => {
    const callback = jest.fn()

    mq.subscribe('test-channel', callback)

    mq.publish('test-channel', 'hello')
    expect(callback).toHaveBeenCalledWith('test-channel', 'hello')
  })

  it('unsubscribe stops notifications', () => {
    const callback = jest.fn()
    const unsub = mq.subscribe('test-channel', callback)

    unsub()
    mq.publish('test-channel', 'hello')
    expect(callback).not.toHaveBeenCalled()
  })

  it('getChannels returns subscribed channels', () => {
    mq.subscribe('channel-a', jest.fn())
    mq.subscribe('channel-b', jest.fn())
    expect(mq.getChannels()).toEqual(expect.arrayContaining(['channel-a', 'channel-b']))
  })

  it('tracks total subscriber count via length', () => {
    mq.subscribe('ch1', jest.fn())
    mq.subscribe('ch1', jest.fn())
    mq.subscribe('ch2', jest.fn())
    expect(mq.length).toBe(3)
  })
})

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
describe('constants values', () => {
  it('EventName has expected values', () => {
    expect(EventName.Click).toBe('click')
    expect(EventName.KeyDown).toBe('keydown')
    expect(EventName.Focus).toBe('focus')
    expect(EventName.Blur).toBe('blur')
    expect(EventName.Scroll).toBe('scroll')
  })

  it('KeyCode has expected values', () => {
    expect(KeyCode.Enter).toBe(13)
    expect(KeyCode.Escape).toBe(27)
    expect(KeyCode.Space).toBe(32)
    expect(KeyCode.UpArrow).toBe(38)
    expect(KeyCode.DownArrow).toBe(40)
  })

  it('Alerts has expected values', () => {
    expect(Alerts.info).toBe('info')
    expect(Alerts.success).toBe('success')
    expect(Alerts.error).toBe('error')
    expect(Alerts.warning).toBe('warning')
  })
})
