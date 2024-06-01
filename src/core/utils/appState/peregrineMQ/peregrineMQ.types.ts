export type CallbackPayload = string | number | Record<any, any>
export type Callback = (message: string, data?: CallbackPayload) => void

export type SubscribersSet = Set<Callback>

export interface Config {
  /**
   *  If true, enables automatic pruning of channels with no subscribers.
   */
  allowAutoPrune?: boolean

  /**
   *  The interval in milliseconds at which to check for channels with no
   *  subscribers.
   */
  pruneInterval?: number

  /**
   * If true, will allow the use of clear method to remove all channels and listeners.
   */
  allowClear?: boolean
}

export interface UnsubscribeOptions {
  /**
   * Channel to unsubscribe from
   */
  channel?: string

  /**
   * If true, will remove the channel from the collection when the last subscriber is removed
   */
  prune?: boolean
}

export interface PeregrineMQApi {
  /**
   * Sets the configuration options for a PeregrineMQ instance.
   *
   * @param {Config} config - An object containing configuration options for the function.
   * @return {void}
   */
  configure: (config: Config) => void

  /**
   * Collection of all channels and their subscribers
   * @function
   * @return { string[] }
   */
  getChannels: () => string[]

  /**
   * Prunes all channels with no subscribers.
   *
   * @function
   * @returns {void}
   */
  prune: () => void

  /**
   * Removes a channel from the collection.
   *
   * @param {string} channel - The name of the channel to remove.
   * @returns {boolean} - Returns true if the channel was successfully removed, false otherwise.
   */
  removeChannel: (channel: string) => boolean

  /**
   * Publishes the message, passing the data to it's subscribers
   * @function
   * @param { String } channel The channel to publish
   * @param {} data The data to pass to subscribers
   * @return { Boolean }
   */
  publish: (channel: string, data?: unknown) => boolean

  /**
   * Subscribes the passed function to the passed message.
   * Every returned token is unique and should be stored if you need to unsubscribe
   * @function
   * @param { String } channel The channel name to subscribe to
   * @param { Function } callback The function to call when a new message is published
   * @return { Function } The unsubscribe function
   */
  subscribe: (channel: string, callback: Callback) => () => boolean

  /**
   * Unsubscribes a callback from a channel. Returns true if the callback was successfully
   * unsubscribed, false otherwise.
   *
   * @param callback The callback to unsubscribe.
   * @param channel (optional) The channel from which to unsubscribe the callback. If no channel is
   * specified, the callback will be unsubscribed from all channels.
   *
   * @returns True if the callback was successfully unsubscribed, false otherwise.
   */
  unsubscribe: (callback: Callback, options?: UnsubscribeOptions) => boolean

  /**
   * Returns true if the specified callback is subscribed to the specified channel (or to any
   * channel, if no channel is specified), false otherwise.
   *
   * @param callback The callback to check for subscription.
   * @param channel (optional) The channel to check for subscription. If no channel is specified, all
   * channels will be checked.
   *
   * @returns True if the specified callback is subscribed to the specified channel (or to any
   * channel, if no channel is specified), false otherwise.
   */
  isSubscribed: (callback: Callback, channel?: string) => boolean

  /**
   * Removes all channels and subsribers from collection
   * @function
   * @alias clear
   */
  clear: () => void

    /**
   * Returns the specific instance of PeregrineMQ
   *
   * @returns A string identifier of the specific instance of PeregrineMQ
   */
   getId: () => string
}
