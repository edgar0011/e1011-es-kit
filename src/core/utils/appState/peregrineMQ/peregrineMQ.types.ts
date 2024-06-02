export type CallbackPayload = string | number | Record<any, any>;
export type Callback = (message: string, data?: CallbackPayload) => void;

export type SubscribersSet = Set<Callback>;

export interface Config {
  /**
   *  If true, enables automatic removal of channels without subscribers.
   */
  allowAutoPrune?: boolean

  /**
   *  The interval, in milliseconds, for checking channels with no subscribers.
   */
  pruneInterval?: number

  /**
   * If true, allows the use of the clear method to remove all channels and listeners.
   */
  allowClear?: boolean
}

export interface UnsubscribeOptions {
  /**
   * The channel to unsubscribe from.
   */
  channel?: string

  /**
   * If true, removes the channel from the collection when the last subscriber is removed.
   */
  prune?: boolean
}

export interface PeregrineMQApi {
  /**
   * Sets the configuration options for a PeregrineMQ instance.
   *
   * @param {Config} config - An object containing configuration options for the instance.
   * @return {void}
   */
  configure: (config: Config) => void

  /**
   * Retrieves a list of all channels and their subscribers.
   *
   * @return { string[] }
   */
  getChannels: () => string[]

  /**
   * Removes all channels that have no subscribers.
   *
   * @return {void}
   */
  prune: () => void

  /**
   * Removes a specified channel from the collection.
   *
   * @param {string} channel - The name of the channel to remove.
   * @return {boolean} - Returns true if the channel was successfully removed, otherwise false.
   */
  removeChannel: (channel: string) => boolean

  /**
   * Publishes a message to a specified channel, passing the data to its subscribers.
   *
   * @param {string} channel - The channel to publish the message to.
   * @param {unknown} [data] - The data to pass to subscribers.
   * @return {boolean} - Returns true if the message was successfully published, otherwise false.
   */
  publish: (channel: string, data?: unknown) => boolean

  /**
   * Subscribes a function to a specified channel.
   * The returned unsubscribe function is unique and should be stored for later use.
   *
   * @param {string} channel - The channel name to subscribe to.
   * @param {Callback} callback - The function to call when a new message is published.
   * @return {() => boolean} - The unsubscribe function.
   */
  subscribe: (channel: string, callback: Callback) => () => boolean

  /**
   * Unsubscribes a callback from a channel.
   * Returns true if the callback was successfully unsubscribed, otherwise false.
   *
   * @param {Callback} callback - The callback to unsubscribe.
   * @param {UnsubscribeOptions} [options] - Options for unsubscribing, including the channel.
   * @return {boolean} - Returns true if the callback was successfully unsubscribed, otherwise false.
   */
  unsubscribe: (callback: Callback, options?: UnsubscribeOptions) => boolean

  /**
   * Checks if a specified callback is subscribed to a specified channel (or any channel if not specified).
   *
   * @param {Callback} callback - The callback to check for subscription.
   * @param {string} [channel] - The channel to check for subscription. If not specified, all channels will be checked.
   * @return {boolean} - Returns true if the callback is subscribed, otherwise false.
   */
  isSubscribed: (callback: Callback, channel?: string) => boolean

  /**
   * Removes all channels and subscribers from the collection.
   *
   * @function
   * @alias clear
   */
  clear: () => void

  /**
   * Retrieves the identifier for the specific instance of PeregrineMQ.
   *
   * @return {string} - A string identifier for the specific instance.
   */
  getId: () => string
}
