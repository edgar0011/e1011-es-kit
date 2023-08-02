export enum TinyStateMachineEventType {
  CHANGE = 'change',
  TRANSITIONED_TO = 'transitionedTo',
  TRANSITIONED_FROM = 'transitionedFrom',
  ADDED_TO_QUEUE = 'addedToQueue',
  REMOVED_FROM_QUEUE = 'removedFromQueue'
}

export type ListenerCallBack = (
  stateEvent: TinyStateMachineEvent,
  state?: ITinyStateMachineState
) => void;

export class TinyStateMachineEvent extends Event {
  constructor(type: TinyStateMachineEventType, eventInitDict?: any) {
    super(type, eventInitDict)
  }
}

interface IPubSub {
  subscribe: (listener: ListenerCallBack) => () => void
  unsubscribe: (listener: ListenerCallBack) => void
  publish: (...args: any[]) => void
}

export interface ITinyStateMachineState extends IPubSub {
  name: string
}

export class TinyStateMachineState implements ITinyStateMachineState {
  #name: string

  #listeners: Set<ListenerCallBack>

  constructor(name: string) {
    this.#name = name
    this.#listeners = new Set<ListenerCallBack>()
  }

  get name(): string {
    return this.#name
  }

  subscribe = (listener: ListenerCallBack) => {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  unsubscribe = (listener: ListenerCallBack) => {
    this.#listeners.delete(listener)
  }

  publish = (event: TinyStateMachineEvent) => {
    if (!this.#listeners?.size) {
      return
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const listener of this.#listeners) {
      listener(event)
    }
  }

  toString = () => `TinyStateMachineSate: ${this.#name}`

  get [Symbol.toStringTag]() {
    return `TinyStateMachineSate: ${this.#name}`
  }
}

export interface ITinyStateMachine extends IPubSub {
  states: Set<TinyStateMachineState>
  addState: (state: TinyStateMachineState) => void
  removeState: (state: TinyStateMachineState) => void
  currentState: undefined | TinyStateMachineState
  gotoState: (state: TinyStateMachineState) => boolean

}

export const createStates = (stateNames: string[]) => new Set(
  stateNames.map((name: string) => new TinyStateMachineState(name)),
)

export class TinyStateMachine implements ITinyStateMachine {
  #states: Set<TinyStateMachineState>

  #listeners: Set<ListenerCallBack>

  #currentState: undefined | TinyStateMachineState

  constructor(states: Set<TinyStateMachineState>) {
    this.#states = states
    this.#listeners = new Set<ListenerCallBack>()
  }

  addState = (state: TinyStateMachineState) => {
    this.#states.add(state)
  }

  removeState = (state: TinyStateMachineState) => {
    this.#states.delete(state)
  }

  get states () {
    return this.#states
  }

  get currentState () {
    return this.#currentState
  }

  subscribe = (listener: ListenerCallBack) => {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  unsubscribe = (listener: ListenerCallBack) => {
    this.#listeners.delete(listener)
  }

  publish = (event: TinyStateMachineEvent, state?: TinyStateMachineState) => {
    if (!this.#listeners?.size) {
      return
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const listener of this.#listeners) {
      listener(event, state)
    }
  }

  #getStateByName = (stateName: string): undefined | TinyStateMachineState => Array
    .from(this.#states).find((state: TinyStateMachineState) => state.name === stateName)

  #getStateByState
    = (state: TinyStateMachineState): undefined | TinyStateMachineState => (this.#states.has(state) ? state : undefined)

  gotoState = (state: TinyStateMachineState | string) => {
    const foundState = typeof state === 'string'
      ? this.#getStateByName(state as string)
      : this.#getStateByState(state as TinyStateMachineState)

    if (!foundState) {
      throw Error(`TinyStateMachin::gotoState state not found: ${state}`)
    }

    const prevState: undefined | TinyStateMachineState = this.#currentState

    this.#currentState = foundState
    this.publish(new TinyStateMachineEvent(TinyStateMachineEventType.TRANSITIONED_FROM), prevState)
    this.publish(new TinyStateMachineEvent(TinyStateMachineEventType.TRANSITIONED_TO), foundState)

    prevState?.publish(new TinyStateMachineEvent(TinyStateMachineEventType.TRANSITIONED_FROM))
    this.#currentState.publish(new TinyStateMachineEvent(TinyStateMachineEventType.TRANSITIONED_TO))
    return true
  }

  next = (): TinyStateMachineState | null => {
    let nextState: TinyStateMachineState
    const arrayOfStates: TinyStateMachineState[] = Array.from(this.#states)

    if (!this.#currentState) {
      [nextState] = arrayOfStates

      return this.gotoState(nextState) ? nextState : null
    }

    const currentStateIndex = arrayOfStates
      .findIndex((state: TinyStateMachineState) => state === this.#currentState)

    if (currentStateIndex < this.#states.size - 2) {
      nextState = arrayOfStates[currentStateIndex + 1]
      return this.gotoState(nextState) ? nextState : null
    }

    return null
  }
}



export const stateIterator = function* () {
  let operation: string
  let state: string = stateIterator.IS_RUNNING

  while (true) {
    // console.log('inside while loop')

    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore


    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    operation = yield state

    // // console.log('operation', operation)
    // // console.log('state', state)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (operation === stateIterator.DO_END) {
      state = stateIterator.IS_FINITE
      yield state
      break
    }
  }
  yield* [1, 2, 3]
  yield 123

  return 10
}

stateIterator.DO_END = '__DO__END__'
stateIterator.IS_FINITE = '__IS__FINITE__'
stateIterator.IS_RUNNING = '__IS__RUNNING__'
