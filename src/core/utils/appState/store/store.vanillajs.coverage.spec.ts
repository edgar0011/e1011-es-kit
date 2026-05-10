import { delay } from '../../helpers/other'

import {
  EqualityFn,
  Listener,
  StoreWithActions,
  canSetStateMerge,
  createStore,
  getSetStateMerge,
  shallowEqual,
} from './store.vanillajs'


type TestState = {
  count: number
  name: string
  items: string[]
}

describe('TinyStore – extended coverage', () => {
  let initialState: Partial<TestState>

  beforeEach(() => {
    // ensure merge mode is reset to default before each test
    canSetStateMerge(true)

    initialState = {
      count: 0,
      name: 'initial',
      items: ['a', 'b'],
    }
  })

  afterAll(() => {
    // clean up global
    canSetStateMerge(true)
  })


  // ─── SET_STATE_MERGE = false ────────────────────────────────────────

  describe('canSetStateMerge(false) – replace mode', () => {
    it('setState replaces state entirely instead of merging', async () => {
      canSetStateMerge(false)
      const store = createStore<TestState>(initialState)

      await store.setState({ count: 99 })

      // With merge=false, only { count: 99 } remains – name/items are gone
      expect(store.getState()).toEqual({ count: 99 })
      expect(store.getState().name).toBeUndefined()
    })

    it('getSetStateMerge reflects the current value', () => {
      expect(getSetStateMerge()).toBe(true)
      canSetStateMerge(false)
      expect(getSetStateMerge()).toBe(false)
    })
  })


  // ─── unsubscribe() method (not just the returned function) ──────────

  describe('store.unsubscribe()', () => {
    it('removes listener via the unsubscribe method', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      store.subscribe(listener)

      await store.setState({ count: 1 })
      expect(listener).toHaveBeenCalledTimes(1)

      store.unsubscribe(listener)

      await store.setState({ count: 2 })
      expect(listener).toHaveBeenCalledTimes(1) // not called again
    })
  })


  // ─── subscribe selector mismatch error ──────────────────────────────

  describe('subscribe – selector mismatch', () => {
    it('throws when listener.selector differs from the selector argument', () => {
      const store = createStore<TestState>(initialState)
      const selectorA = (s: Partial<TestState>): TestState['count'] | undefined => s.count
      const selectorB = (s: Partial<TestState>): TestState['name'] | undefined => s.name
      const listener = jest.fn() as Listener<TestState>

      listener.selector = selectorA

      expect(() => store.subscribe(listener, selectorB)).toThrow(
        'Error, mismatch selector, listener.selector !== selector.',
      )
    })

    it('does NOT throw when listener.selector matches the selector argument', () => {
      const store = createStore<TestState>(initialState)
      const selector = (s: Partial<TestState>): TestState['count'] | undefined => s.count
      const listener = jest.fn() as Listener<TestState>

      listener.selector = selector

      expect(() => store.subscribe(listener, selector)).not.toThrow()
    })

    it('assigns selector from argument when listener has none', () => {
      const store = createStore<TestState>(initialState)
      const selector = (s: Partial<TestState>): TestState['count'] | undefined => s.count
      const listener = jest.fn() as Listener<TestState>

      store.subscribe(listener, selector)

      expect(listener.selector).toBe(selector)
    })
  })


  // ─── listener throwing mid-notification ─────────────────────────────

  describe('listener error isolation', () => {
    it('a throwing listener does NOT prevent subsequent listeners from being called', async () => {
      const store = createStore<TestState>(initialState)

      const listenerA = jest.fn() as Listener<TestState>
      const throwingListener = jest.fn(() => {
        throw new Error('boom')
      }) as Listener<TestState>
      const listenerB = jest.fn() as Listener<TestState>

      store.subscribe(listenerA)
      store.subscribe(throwingListener)
      store.subscribe(listenerB)

      await expect(store.setState({ count: 1 })).rejects.toThrow('boom')

      // All listeners are called despite the error in the middle
      expect(listenerA).toHaveBeenCalledTimes(1)
      expect(throwingListener).toHaveBeenCalledTimes(1)
      expect(listenerB).toHaveBeenCalledTimes(1)
    })

    it('first error is thrown after all listeners have been notified', async () => {
      const store = createStore<TestState>(initialState)
      const callOrder: string[] = []

      const listenerA = jest.fn(() => { callOrder.push('A') }) as Listener<TestState>
      const throwingListener = jest.fn(() => {
        callOrder.push('throw')
        throw new Error('first error')
      }) as Listener<TestState>
      const listenerC = jest.fn(() => { callOrder.push('C') }) as Listener<TestState>

      store.subscribe(listenerA)
      store.subscribe(throwingListener)
      store.subscribe(listenerC)

      await expect(store.setState({ count: 1 })).rejects.toThrow('first error')

      expect(callOrder).toEqual(['A', 'throw', 'C'])
    })
  })


  // ─── selector equality: primitives vs objects ───────────────────────

  describe('selector equality check', () => {
    it('skips listener when selected primitive value has not changed', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): TestState['count'] | undefined => s.count

      store.subscribe(listener)

      // same count=0, different name – listener should NOT fire
      await store.setState({ name: 'changed' })
      expect(listener).toHaveBeenCalledTimes(0)

      // actually change count – listener should fire
      await store.setState({ count: 5 })
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('skips listener when non-memoized selector returns same shape (shallowEqual default)', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      // Non-memoized selector: always returns a new object reference
      listener.selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })

      store.subscribe(listener)

      // count hasn't changed — shallowEqual catches it despite new reference
      await store.setState({ name: 'a' })
      await store.setState({ name: 'b' })

      expect(listener).toHaveBeenCalledTimes(0)
    })

    it('fires listener when non-memoized selector returns different values', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })

      store.subscribe(listener)

      await store.setState({ count: 10 })
      await store.setState({ count: 10 }) // same — skipped
      await store.setState({ count: 20 })

      expect(listener).toHaveBeenCalledTimes(2)
    })
  })


  // ─── equalityFn ─────────────────────────────────────────────────────

  describe('equalityFn – custom equality', () => {
    const shallowEqual: EqualityFn<TestState> = (a, b) => {
      if (a === b) { return true }
      if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) { return false }
      const keysA = Object.keys(a as object)
      const keysB = Object.keys(b as object)

      if (keysA.length !== keysB.length) { return false }
      return keysA.every(
        (key) => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key],
      )
    }

    it('skips listener when equalityFn returns true for non-memoized selector', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      // Non-memoized selector returning new object each time
      const selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })

      store.subscribe(listener, selector, shallowEqual)

      // count hasn't changed – shallowEqual should prevent the call
      await store.setState({ name: 'a' })
      await store.setState({ name: 'b' })

      expect(listener).toHaveBeenCalledTimes(0)
    })

    it('fires listener when equalityFn detects actual change', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      const selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })

      store.subscribe(listener, selector, shallowEqual)

      await store.setState({ count: 10 })
      await store.setState({ count: 10 }) // same – should be skipped
      await store.setState({ count: 20 })

      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('can be set directly on the listener object', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })
      listener.equalityFn = shallowEqual

      store.subscribe(listener)

      await store.setState({ name: 'x' })
      await store.setState({ count: 5 })

      expect(listener).toHaveBeenCalledTimes(1) // only the count change
    })

    it('equalityFn from subscribe does not overwrite existing listener.equalityFn', async () => {
      const store = createStore<TestState>(initialState)
      const customEq = jest.fn(() => true) as EqualityFn<TestState>
      const otherEq = jest.fn(() => false) as EqualityFn<TestState>
      const listener = jest.fn() as Listener<TestState>

      listener.equalityFn = customEq

      store.subscribe(listener, undefined, otherEq)

      await store.setState({ count: 99 })

      // customEq was kept (not overwritten), so it's used
      expect(customEq).toHaveBeenCalled()
      expect(otherEq).not.toHaveBeenCalled()
    })
  })


  // ─── concurrent setState calls ──────────────────────────────────────

  describe('concurrent setState', () => {
    it('last-write-wins with concurrent non-awaited setState calls', async () => {
      const store = createStore<TestState>(initialState)

      // Fire multiple setStates without awaiting
      const p1 = store.setState({ count: 1 })
      const p2 = store.setState({ count: 2 })
      const p3 = store.setState({ count: 3 })

      await Promise.all([p1, p2, p3])

      expect(store.getState().count).toBe(3)
    })
  })


  // ─── sync actions (non-async) ───────────────────────────────────────

  describe('sync actions', () => {
    it('sync action does NOT get Pending/Error tracking', async () => {
      const store = createStore<TestState>(initialState, {
        increment: (getState, setState) => {
          setState({ count: (getState().count || 0) + 1 })
        },
      }) as StoreWithActions<TestState>

      await store.actions.increment()

      expect(store.getState().count).toBe(1)
      // Sync actions should not create Pending/Error keys
      expect((store.getState() as any).incrementPending).toBeUndefined()
      expect((store.getState() as any).incrementError).toBeUndefined()
    })
  })


  // ─── async action error handling ────────────────────────────────────

  describe('async action error handling', () => {
    it('sets actionNameError on the state when an async action throws', async () => {
      const store = createStore<TestState>(initialState, {
        failingAction: async () => {
          await delay(50)
          throw new Error('async fail')
        },
      }) as StoreWithActions<TestState>

      await expect(store.actions.failingAction()).rejects.toThrow('async fail')

      expect((store.getState() as any).failingActionPending).toBe(false)
      expect((store.getState() as any).failingActionError).toBeInstanceOf(Error)
      expect((store.getState() as any).failingActionError.message).toBe('async fail')
    })

    it('sync action error is NOT caught – it propagates and no Error key is set', async () => {
      const store = createStore<TestState>(initialState, {
        failSync: () => {
          throw new Error('sync fail')
        },
      }) as StoreWithActions<TestState>

      await expect(store.actions.failSync()).rejects.toThrow('sync fail')

      // isFunctionAsync returns false → no Error tracking
      expect((store.getState() as any).failSyncPending).toBeUndefined()
      expect((store.getState() as any).failSyncError).toBeUndefined()
    })
  })


  // ─── reducer with sync actions ──────────────────────────────────────

  describe('reducer with sync actions', () => {
    it('reducer runs after a sync action and updates state', async () => {
      const reducer = jest.fn(
        (state: Partial<TestState>, actionName: string) => {
          if (actionName === 'increment') {
            return { ...state, name: `incremented-${state.count}` }
          }
          return state
        },
      )

      const store = createStore<TestState>(
        initialState,
        {
          increment: (getState, setState) => {
            setState({ count: (getState().count || 0) + 1 })
          },
        },
        reducer,
      ) as StoreWithActions<TestState>

      await store.actions.increment()

      expect(reducer).toHaveBeenCalledTimes(1)
      // Reducer sees post-action state (count already 1)
      expect(store.getState().name).toBe('incremented-1')
    })
  })


  // ─── multiple subscriptions and unsubscriptions ─────────────────────

  describe('multiple listeners', () => {
    it('supports multiple independent listeners', async () => {
      const store = createStore<TestState>(initialState)
      const listenerA = jest.fn() as Listener<TestState>
      const listenerB = jest.fn() as Listener<TestState>

      const unsubA = store.subscribe(listenerA)

      store.subscribe(listenerB)

      await store.setState({ count: 1 })

      expect(listenerA).toHaveBeenCalledTimes(1)
      expect(listenerB).toHaveBeenCalledTimes(1)

      unsubA()

      await store.setState({ count: 2 })

      expect(listenerA).toHaveBeenCalledTimes(1) // still 1
      expect(listenerB).toHaveBeenCalledTimes(2)
    })
  })


  // ─── subscribe returns previousValue on subscribe ───────────────────

  describe('previousValue initialization', () => {
    it('sets previousValue on subscribe so first setState with same value is skipped', async () => {
      const store = createStore<TestState>({ count: 5, name: 'init', items: [] })
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): TestState['count'] | undefined => s.count

      store.subscribe(listener)

      // previousValue was set to 5 on subscribe
      // setState with same count=5 should be skipped
      await store.setState({ name: 'changed' })
      expect(listener).toHaveBeenCalledTimes(0)
    })
  })


  // ─── action handler receives extra arguments ────────────────────────

  describe('action handler extra arguments', () => {
    it('passes extra args through to the action handler', async () => {
      const handler = jest.fn(async (getState, setState, value: unknown, flag: unknown) => {
        await delay(10)
        setState({ count: value as number, name: flag as string })
      })

      const store = createStore<TestState>(initialState, {
        update: handler,
      }) as StoreWithActions<TestState>

      await store.actions.update(42, 'active')

      expect(handler).toHaveBeenCalledWith(
        expect.any(Function), // getState
        expect.any(Function), // setState
        42,
        'active',
      )
      expect(store.getState().count).toBe(42)
      expect(store.getState().name).toBe('active')
    })
  })


  // ─── store without actions returns Store (no actions key) ───────────

  describe('createStore return type', () => {
    it('returns a store without actions property when no actions provided', () => {
      const store = createStore<TestState>(initialState)

      expect(store.getState).toBeDefined()
      expect(store.setState).toBeDefined()
      expect(store.subscribe).toBeDefined()
      expect((store as any).actions).toBeUndefined()
    })

    it('returns a store with actions property when actions provided', () => {
      const store = createStore<TestState>(initialState, {
        noop: () => {},
      }) as StoreWithActions<TestState>

      expect(store.actions).toBeDefined()
      expect(store.actions.noop).toBeInstanceOf(Function)
    })
  })


  // ─── setState returns updated state ─────────────────────────────────

  describe('setState return value', () => {
    it('returns the merged state after setState', async () => {
      const store = createStore<TestState>(initialState)

      const result = await store.setState({ count: 10 })

      expect(result).toEqual({ count: 10, name: 'initial', items: ['a', 'b'] })
    })
  })


  // ─── shallowEqual as default for selectors ──────────────────────────

  describe('shallowEqual (built-in default for selectors)', () => {
    it('non-memoized object selector: skips when values unchanged', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      // inline selector — new object ref every time
      // eslint-disable-next-line max-len
      listener.selector = (s: Partial<TestState>): Pick<Partial<TestState>, 'count' | 'name'> => ({ count: s.count, name: s.name })
      store.subscribe(listener)

      // change items only — selected {count, name} stays the same
      await store.setState({ items: ['x'] })

      expect(listener).toHaveBeenCalledTimes(0)
    })

    it('non-memoized object selector: fires when selected values change', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      // eslint-disable-next-line max-len
      listener.selector = (s: Partial<TestState>): Pick<Partial<TestState>, 'count' | 'name'> => ({ count: s.count, name: s.name })
      store.subscribe(listener)

      await store.setState({ count: 99 })

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('array selector: skips when elements are the same', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): string[] => s.items ?? []
      store.subscribe(listener)

      // change name only — items ref stays the same
      await store.setState({ name: 'changed' })

      expect(listener).toHaveBeenCalledTimes(0)
    })

    it('array selector: fires when array content changes', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): string[] => [...(s.items ?? [])]
      store.subscribe(listener)

      await store.setState({ items: ['x', 'y'] })

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('no selector: still uses reference equality (entire state object)', async () => {
      const store = createStore<TestState>(initialState)
      const listener = jest.fn() as Listener<TestState>

      // no selector — listener receives full state
      store.subscribe(listener)

      // any setState creates a new merged object, so listener always fires
      await store.setState({ name: 'same' })
      await store.setState({ name: 'same' })

      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('explicit equalityFn overrides the shallowEqual default', async () => {
      const store = createStore<TestState>(initialState)
      const alwaysEqual = jest.fn(() => true) as EqualityFn<TestState>
      const listener = jest.fn() as Listener<TestState>

      listener.selector = (s: Partial<TestState>): { count: TestState['count'] | undefined } => ({ count: s.count })
      listener.equalityFn = alwaysEqual

      store.subscribe(listener)

      await store.setState({ count: 999 })

      // custom equalityFn says "equal" → listener not called
      expect(listener).toHaveBeenCalledTimes(0)
      expect(alwaysEqual).toHaveBeenCalled()
    })
  })
})


// ─── shallowEqual unit tests ───────────────────────────────────────────

describe('shallowEqual – unit', () => {
  it('returns true for identical references', () => {
    const obj = { a: 1 }

    expect(shallowEqual(obj, obj)).toBe(true)
  })

  it('returns true for equal primitives', () => {
    expect(shallowEqual(5, 5)).toBe(true)
    expect(shallowEqual('hello', 'hello')).toBe(true)
    expect(shallowEqual(true, true)).toBe(true)
    expect(shallowEqual(undefined, undefined)).toBe(true)
  })

  it('returns false for different primitives', () => {
    expect(shallowEqual(5, 6)).toBe(false)
    expect(shallowEqual('a', 'b')).toBe(false)
    expect(shallowEqual(true, false)).toBe(false)
  })

  it('returns true for objects with same own keys and values', () => {
    expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true)
  })

  it('returns false for objects with different values', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('returns false for objects with different keys', () => {
    expect(shallowEqual<Record<string, number>>({ a: 1 }, { b: 1 })).toBe(false)
    expect(shallowEqual<Record<string, number>>({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('returns true for arrays with same elements', () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(shallowEqual(['a', 'b'], ['a', 'b'])).toBe(true)
  })

  it('returns false for arrays with different elements', () => {
    expect(shallowEqual([1, 2], [1, 3])).toBe(false)
  })

  it('returns false for arrays with different lengths', () => {
    expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  it('returns false when comparing null to object', () => {
    expect(shallowEqual(null as any, { a: 1 })).toBe(false)
    expect(shallowEqual({ a: 1 }, null as any)).toBe(false)
  })

  it('does not deep-compare nested objects (shallow only)', () => {
    const nested1 = { inner: { x: 1 } }
    const nested2 = { inner: { x: 1 } }

    // Different inner references → not shallow-equal
    expect(shallowEqual(nested1, nested2)).toBe(false)
  })
})
