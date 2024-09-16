import { v4 as uuidv4 } from 'uuid'

import {
  Callback, Config, PeregrineMQApi, PublishToChannelReturnType,
  PublishReturnType, SubscribersSet,
  UnsubscribeOptions, NON_EXISTENT_CHANNEL_TYPE,
  NON_EXISTENT_CHANNEL,
  CallbackPayload,
} from './peregrineMQ.types'


export class PeregrineMQClearError extends Error {
  constructor() {
    super('Clearing PeregrineMQ is not allowed. Please read the documentation for more information.')
    this.name = 'PeregrineMQClearError'
  }
}

/**
 * Represents a message queue with publish/subscribe functionality.
 */
export class PeregrineMQ implements PeregrineMQApi {
  private id: string

  private config: Config = {
    allowAutoPrune: false,
    pruneInterval: 10000,
    allowClear: false,
  }

  /**
   * The map of channels and their subscribers sets.
   */
  private channels: Map<string, SubscribersSet> = new Map()

  /**
   * The map of listeners and their subscribed channels.
   */
  private listeners: Map<Callback, SubscribersSet[]> = new Map()

  /**
   * Adds a callback as a listener to a channel.
   * @param callback The callback function to add as a listener.
   * @param channel The channel to add the listener to.
   */
  private addListener = (callback: Callback, channel: string): void => {
    const listener = this.listeners.get(callback)
    const subscribersSet = this.channels.get(channel)

    if (subscribersSet) {
      if (listener) {
        listener.push(subscribersSet)
      } else {
        this.listeners.set(callback, [subscribersSet])
      }
    }
  }

  /**
   * Removes the callback from the listeners collection if it is not subscribed to any channels.
   * @description Removes the callback only when it is not present in any other subscriberSet
   * (Ref to Map<string, SubscribersSet>).
   * @param callback The callback to remove from listeners.
   */
  private removeListener = (callback: Callback): void => {
    const channelSubscriberSets = this.listeners.get(callback)
    let isEmpty = true

    // eslint-disable-next-line no-restricted-syntax
    for (const channelSubscriberSet of channelSubscriberSets || []) {
      isEmpty = !channelSubscriberSet.has(callback)
      if (!isEmpty) {
        break
      }
    }

    if (isEmpty) {
      this.listeners.delete(callback)
    }
  }

  /**
   * Publishes data to a channel.
   * @param channel The channel to publish the data to.
   * @param isParent Indicates if the channel is a parent channel.
   * @param data The data to publish.
   * @returns A boolean indicating if the publication was successful.
   */
  private publishToChannel = (
    channel: string, isParent: boolean, data?: unknown,
  ): PublishToChannelReturnType => {
    const subscribersSet = this.channels.get(channel)

    if (!subscribersSet) {
      return NON_EXISTENT_CHANNEL as NON_EXISTENT_CHANNEL_TYPE
    }

    const iterator = subscribersSet[Symbol.iterator]()
    let subscriberFunc = iterator.next().value

    const results = []

    // eslint-disable-next-line no-plusplus
    while (subscriberFunc) {
      // eslint-disable-next-line no-await-in-loop
      results.push(subscriberFunc(channel, data as CallbackPayload))
      subscriberFunc = iterator.next().value
    }
    return results?.length === 1 ? results[0] : results
  }

  /**
   * Creates a new instance of PeregrineMQ.
   * @param id Specific instance of PeregrineMQ identifier
   * @param config The configuration options for PeregrineMQ.
   */
  constructor(id?: string, config?: Config) {
    this.id = id || uuidv4()
    this.configure(config || {})
  }

  /**
   * Gets the total number of subscribers across all channels.
   */
  get length(): number {
    return [...this.channels.values()].reduce((acc, subscribersList) => acc + subscribersList.size, 0)
  }

  /**
   * Configures PeregrineMQ with the specified options.
   * @param config The configuration options for PeregrineMQ.
   * @returns An object containing the prune interval handler (if auto prune is enabled).
   */
  configure = (config: Config): {
    clearPruneInterval?: () => void
    restartPruneInterval?: () => void
  } => {
    this.config = config
    const { allowAutoPrune, pruneInterval } = config

    let pruneIntervalHandler: ReturnType<typeof setInterval>

    if (allowAutoPrune) {
      pruneIntervalHandler = setInterval(() => {
        this.prune()
      }, pruneInterval)
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance: PeregrineMQ = this

    return {
      ...(allowAutoPrune
        ? {
          clearPruneInterval: (): void => {
            clearInterval(pruneIntervalHandler)
          },
          restartPruneInterval: (): void => {
            clearInterval(pruneIntervalHandler)
            pruneIntervalHandler = setInterval(() => {
              instance.prune()
            }, pruneInterval)
          },
        }
        : {}),
    }
  }

  /**
   * Gets an array of all channels.
   * @returns An array of channel names.
   */
  getChannels = (): string[] => [...this.channels.keys()]

  /**
   * Prunes the channels with no subscribers.
   * @returns An array of pruned channel names.
   */
  prune = (): string[] => {
    const iterator = this.channels[Symbol.iterator]()
    let subscribersSet = iterator.next().value
    const prunedChannels: string[] = []

    // eslint-disable-next-line no-plusplus
    while (subscribersSet) {
      if (subscribersSet[1]?.size === 0) {
        prunedChannels.push(subscribersSet[0])
        this.channels.delete(subscribersSet[0])
      }
      subscribersSet = iterator.next().value
    }

    return prunedChannels
  }

  /**
   * Removes a channel and its subscribers.
   * @param channel The channel to remove.
   * @returns A boolean indicating if the channel was successfully removed.
   */
  removeChannel = (channel: string): boolean => {
    const subscribersSet = this.channels.get(channel)

    if (subscribersSet && subscribersSet.size > 0) {
      const channelListeners = [...subscribersSet || []]

      subscribersSet.clear()

      let index = channelListeners.length

      // eslint-disable-next-line no-plusplus
      while (index--) {
        this.removeListener(channelListeners[index])
      }
    }

    return this.channels.delete(channel)
  }

  /**
   * Publishes data to a channel.
   * @param channel The channel to publish the data to.
   * @param data The data to publish.
   * @returns A boolean indicating if the publication was successful.
   */
  publish = <T>(channel: string, data?: T): PublishReturnType => {
    if (channel.includes('.')) {
      const nestedChannels = channel.split('.')

      let { length } = nestedChannels
      let it = 0
      const results = []

      // eslint-disable-next-line no-plusplus
      while (length--) {
        // eslint-disable-next-line no-await-in-loop
        const result = this.publishToChannel(
          nestedChannels.slice(0, it + 1).join('.'),
          length !== nestedChannels.length - 1,
          data,
        )

        it += 1
        results.push(result)
      }
      return results
    }

    return this.publishToChannel(channel, false, data)
  }

  /**
   * Subscribes a callback to a channel.
   * @param channel The channel to subscribe to.
   * @param callback The callback function to subscribe.
   * @returns A function to unsubscribe the callback.
   */
  subscribe = (channel: string, callback: Callback): () => boolean => {
    const subscribersList = this.channels.get(channel)

    if (subscribersList) {
      subscribersList.add(callback)
    } else {
      this.channels.set(channel, new Set([callback]))
    }

    this.addListener(callback, channel)

    return () => this.unsubscribe(callback, { channel, prune: true })
  }

  /**
   * Unsubscribes a callback from a channel or all channels.
   * @param callback The callback function to unsubscribe.
   * @param options Optional unsubscribe options.
   * @returns A boolean indicating if the callback was successfully unsubscribed.
   */
  unsubscribe = (callback: Callback, options?: UnsubscribeOptions): boolean => {
    const { channel, prune } = options || {}

    let unsubscribed = false

    if (channel) {
      const subscriberSet = this.channels.get(channel)

      unsubscribed = subscriberSet ? subscriberSet.delete(callback) : false
      if (prune && subscriberSet?.size === 0) {
        this.channels.delete(channel)
      }

      this.removeListener(callback)

      return unsubscribed
    }

    const subscriberSetArray = this.listeners.get(callback) || []

    // remove callback form listeners and all channels
    // TODO remove only if has
    // eslint-disable-next-line no-restricted-syntax
    for (const subscriberSet of subscriberSetArray) {
      unsubscribed = subscriberSet.delete(callback) as boolean

      if (prune && subscriberSet.size === 0) {
        this.prune()
      }
    }

    this.listeners.delete(callback)

    return unsubscribed
  }

  /**
   * Checks if a callback is subscribed to a specific channel or any channel.
   * @param callback The callback function to check.
   * @param channel Optional channel name to check subscription for.
   * @returns A boolean indicating if the callback is subscribed.
   */
  isSubscribed = (callback: Callback, channel?: string): boolean => {
    if (channel) {
      const subscribersList = this.channels.get(channel)

      return subscribersList ? subscribersList.has(callback) : false
    }

    return this.listeners.has(callback)
  }

  /**
   * Clears all channels and listeners.
   * @throws {Error} If clearing PeregrineMQ is not allowed.
   */
  clear = (): void => {
    if (this.config.allowClear) {
      this.channels.clear()
      this.listeners.clear()
    } else {
      throw new PeregrineMQClearError()
    }
  }

  /**
   * Returns the specific instance of PeregrineMQ.
   * @returns A string identifier of the specific instance of PeregrineMQ.
   */
  getId = (): string => this.id
}
