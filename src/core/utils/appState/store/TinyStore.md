# TinyStore

TinyStore is a lightweight state management library inspired by [SyncExternalStore](https://github.com/jherr/syncexternalstore/blob/main/csr/src/store.js) and [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore). It provides a simple and efficient way to manage and update application state.

## Types

### ListenerCallBack<T>
Represents the callback function for a store listener.

### Selector<T>
Represents a selector function that transforms the store state.

### Listener<T>
Represents a listener for the store. It includes an optional `selector` function and `previousValue` property.

### Store<T>
Represents a store.

#### getState()
Get the current state of the store.

#### setState(state: Partial<T>): Promise<Partial<T>>
Set the state of the store.

- `state`: The new state to set.
- Returns a promise that resolves to the new state.

#### subscribe(listener: Listener<T>): () => void
Subscribe a listener to the store.

- `listener`: The listener function to be subscribed.
- Returns a function to unsubscribe the listener.

### StoreWithActions<T>
Represents a store with additional actions. Extends `Store<T>` and includes an `actions` property.

### ActionHandler<T>
Represents an action handler function.

- `getState`: Function to get the current state of the store.
- `setState`: Function to set the state of the store.
- `rest`: Additional arguments passed to the action handler.

### ActionHandlerCaller
Represents a function that calls an action handler.

### createStore(initialState: Partial<T>, actions?: Record<string, ActionHandler<T>>): Store<T> | StoreWithActions<T>
Creates a new store.

- `initialState`: The initial state of the store.
- `actions`: Optional actions for the store.
- Returns the created store.

## Usage

```typescript
import { createStore } from 'tiny-store';

// Define the initial state
const initialState = {
  counter: 0,
  user: null,
};

// Define action handlers
const actions = {
  increment: (getState, setState) => {
    const { counter } = getState();
    setState({ counter: counter + 1 });
  },
  setUser: (getState, setState, user) => {
    setState({ user });
  },
};

// Create a store
const store = createStore(initialState, actions);

// Get the current state
const state = store.getState();

// Set the state
store.setState({ counter: 10 });

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});

// Call an action handler
store.actions.increment();

// Unsubscribe from changes
unsubscribe();
```


#### In the above example, we create a store using createStore function, define initial state and action handlers, and interact with the store using getState, setState, and subscribe methods. Actions can be called using store.actions.<actionName>() syntax.


### To use 'tinyStore' with react component:

#### Define the state shape
```typescript
export type SimpleState = {
  title: string;
  count: number;
  data: number[];
};
```

#### Create the store instance using createStore and specify the initial state and actions:
```typescript
export const simpleStore: StoreWithActions<SimpleState> = createStore<SimpleState>(
  {
    title: 'Initial Title',
    count: 0,
    data: [],
  },
  {
    addData: async (getState, setState) => {
      console.log('addData start');
      await delay(1000);
      console.log('addData end');
      setState({
        ...getState(),
        title: 'Added Data Title',
      });
    },
  }
) as StoreWithActions<SimpleState>;
```

#### Implement selectors, in this example based on reselect (createSelector) library

```typescript
const titleSelector = (state: Partial<SimpleState>) => state.title;
const countSelector = (state: Partial<SimpleState>) => state.count;

const simpleSelector = createSelector(
  titleSelector,
  countSelector,
  (title: SimpleState['title'], count: SimpleState['count']) => {
    console.log('simpleSelector called');
    return {
      title,
      count,
    };
  }
);
```

#### Use useStore hook in a component
```typescript
export const SimpleComponent: FC<SimpleComponentType> = memo<SimpleComponentType>(({ children }: SimpleComponentType) => {
  // Retrieve the required data from the store using the useStore hook
  const { title, count, data }: useStoreType<SimpleState> = useStore(simpleStore, simpleSelector);

  // Define event handler for button click
  const simpleComponentButtonClickHandler = useCallback(() => {
    const prevState = simpleStore.getState();

    simpleStore.setState({
      ...prevState,
      count: (prevState.count || 0) + 1,
    });
  }, []);

  // Render the component
  return (
    <LayoutBox direction='column'>
      <h3>{title}</h3>
      <p>{count}</p>
      <p>{JSON.stringify(data)}</p>
      <button type='button' onClick={simpleComponentButtonClickHandler}>Add Count</button>
      {children && (
        <LayoutBox>
          {children}
        </LayoutBox>
      )}
    </LayoutBox>
  );
});

SimpleComponent.displayName = 'SimpleComponent';
```
