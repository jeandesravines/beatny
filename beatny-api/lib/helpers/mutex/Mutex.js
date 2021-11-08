/**
 * An asynchronous Mutex
 */
export default class Mutex {
  /**
   * @private
   * @var
   * @type {number}
   */
  calledAt = 0

  /**
   * @private
   * @var
   * @type {?Promise<*>}
   */
  deferred = Promise.resolve()

  /**
   * @private
   * @var
   * @type {number}
   */
  ttl

  /**
   * Create a Mutex with a TTL
   * @param {number} ttl
   */
  constructor(ttl) {
    this.ttl = ttl
  }

  /**
   * Lock the Mutex if possible or wait for the previous call's response
   * @param {Function} handle
   * @returns {Promise<*>}
   */
  async lock(handle) {
    await this.deferred

    const now = Date.now()

    if (this.calledAt + this.ttl < now) {
      this.calledAt = now
      this.deferred = handle()
    }

    return this.deferred
  }
}
