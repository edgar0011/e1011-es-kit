# PeregrineMQ Class

Represents a message queue with publish/subscribe functionality.

## Import

```typescript
import { PeregrineMQ } from 'path/to/peregrineMQ';
```

## Constructor

Creates a new instance of PeregrineMQ.

### Signature

```typescript
constructor(config?: Config)
```

### Parameters

- `config` (optional): The configuration options for PeregrineMQ.

## Properties

### length

Gets the total number of subscribers across all channels.

#### Signature

```typescript
readonly length: number
```

## Methods

### config

Configures PeregrineMQ with the specified options.

#### Signature

```typescript
config(config: Config): { pruneIntervalHandler?: NodeJS.Timer }
```

#### Parameters

- `config`: The configuration options for PeregrineMQ.

#### Returns

An object containing the prune interval handler (if auto prune is enabled).

### getChannels

Retrieves the list of channels in PeregrineMQ.

#### Signature

```typescript
getChannels(): string[]
```

#### Returns

An array of channel names.

### prune

Removes empty channels from PeregrineMQ.

#### Signature

```typescript
prune(): string[]
```

#### Returns

An array of pruned channel names.

### removeChannel

Removes a channel from PeregrineMQ.

#### Signature

```typescript
removeChannel(channel: string): boolean
```

#### Parameters

- `channel`: The channel to remove.

#### Returns

A boolean indicating if the removal was successful.

### publish

Publishes data to a channel.

#### Signature

```typescript
publish<T>(channel: string, data?: T): boolean
```

#### Parameters

- `channel`: The channel to publish the data to.
- `data` (optional): The data to publish.

#### Returns

A boolean indicating if the publication was successful.

### subscribe

Subscribes to a channel and registers a callback.

#### Signature

```typescript
subscribe(channel: string, callback: Callback): () => boolean
```

#### Parameters

- `channel`: The channel to subscribe to.
- `callback`: The callback function to register as a subscriber.

#### Returns

A function that can be used to unsubscribe the callback.

### unsubscribe

Unsubscribes a callback from a channel.

#### Signature

```typescript
unsubscribe(callback: Callback, options?: UnsubscribeOptions): boolean
```

#### Parameters

- `callback`: The callback function to unsubscribe.
- `options` (optional): Additional options for unsubscribing.

#### Returns

A boolean indicating if the unsubscribe operation was successful.

### isSubscribed

Checks if a callback is subscribed to a channel.

#### Signature

```typescript
isSubscribed(callback: Callback, channel?: string): boolean
```


#### Parameters

- `callback`: The callback function to check.
- `channel` (optional): The channel to check subscription for.

#### Returns

A boolean indicating if the callback is subscribed to the channel (or any channel if no channel is specified).

### clear

Clears all channels and listeners in PeregrineMQ.

#### Signature

```typescript
clear(): void
```

#### Throws

```typescript
- `Error`: If clearing PeregrineMQ is not allowed.
```

Please note that this documentation assumes the availability of the `Config`, `Callback`, `PeregrineMQApi`, and `SubscribersSet` types from the `'appState/peregrineMQ/peregrineMQ.types'` module.
