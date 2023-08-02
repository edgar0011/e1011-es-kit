import {
  ITinyStateMachineState,
  TinyStateMachine, TinyStateMachineEvent, TinyStateMachineState, createStates, stateIterator,
} from './tiny-state-machine.base'

describe('TinyStateMachine', () => {
  let states: Set<TinyStateMachineState>

  beforeEach(() => {
    // states = new Set([
    //   new TinyStateMachineState('start'),
    //   new TinyStateMachineState('progress'),
    //   new TinyStateMachineState('end'),
    // ])
    states = createStates([
      'start',
      'progress',
      'end',
    ])
  })

  it('should handle states', () => {
    const tsm = new TinyStateMachine(states)

    const listener = jest.fn((event: TinyStateMachineEvent, state?: ITinyStateMachineState) => {
      console.log('TinyStateMachine listener', event)
      console.log('TinyStateMachine listener', state)
      console.log('TinyStateMachine listener', `${state}`)
    })

    tsm.subscribe(listener)

    expect(tsm.states).toEqual(states)
    expect(tsm.currentState).toBeUndefined()

    tsm.gotoState('start')
    expect(tsm.currentState).toEqual(Array.from(states)[0])
  })

  it('should call subcribers', () => {
    const tsm = new TinyStateMachine(states)

    const listener = jest.fn((event: TinyStateMachineEvent, state?: ITinyStateMachineState) => {
      console.log('TinyStateMachine listener', event)
      console.log('TinyStateMachine listener', state)
      console.log('TinyStateMachine listener', `${state}`)
    })

    tsm.subscribe(listener)

    tsm.gotoState('start')

    expect(listener).toHaveBeenCalledTimes(2)
  })


  it('should got to next state properly', () => {
    const tsm = new TinyStateMachine(states)

    const listener = jest.fn((event: TinyStateMachineEvent, state?: ITinyStateMachineState) => {
      console.log('TinyStateMachine listener', event)
      console.log('TinyStateMachine listener', state)
      console.log('TinyStateMachine listener', `${state}`)
    })

    tsm.subscribe(listener)

    tsm.gotoState('start')
    const state: TinyStateMachineState | null = tsm.next()

    expect(listener).toHaveBeenCalledTimes(4)
    expect(state?.name).toEqual(Array.from(states)[1].name)
    expect(state).toEqual(Array.from(states)[1])
    expect(tsm.currentState).toEqual(Array.from(states)[1])
  })

  // simple generator base state / iterator
  it('should iterate states', () => {
    const tsm = stateIterator()

    console.log('tsm', tsm)
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log('tsm.next()', tsm.next(stateIterator.DO_END))
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
    console.log('tsm.next()', tsm.next())
  })
})

