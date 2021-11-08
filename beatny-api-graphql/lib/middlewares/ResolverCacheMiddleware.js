import hash from 'object-hash'

/**
 * A middle ware used to cache query result in the context
 */
export default class ResolverCacheMiddleware {
  /**
   * Get the given resolver proxied with the cache feature
   * @returns {function(resolve: function, root: Object, args: Object, context: Object, info: Object): Promise<*>}
   */
  static middleware() {
    return (resolve, root, args, context, info) => {
      const proxy = this.getProxy(root, context, info)

      return resolve(proxy, args, context, info)
    }
  }

  /**
   * Get a Proxy for the `root` param to use it as a function
   * @private
   * @param {(Object|null)} root
   * @param {Object} context
   * @param {Object} info
   * @returns {Proxy<Function>}
   */
  static getProxy(root, context, info) {
    return new Proxy(() => {}, {
      get: (target, prop) => root[prop],
      apply: (target, props, [service]) =>
        new Proxy(service, {
          get(applyTarget, prop) {
            const value = service[prop]
            const method = typeof value === 'function' ? value.bind(service) : null

            return method
              ? (...params) => ResolverCacheMiddleware.handle(method, params, context, info)
              : value
          }
        })
    })
  }

  /**
   * Get hased key from info and params
   * @private
   * @param {*[]} params
   * @param {{ parentType: string, fieldName: string }} info
   * @returns {String}
   */
  static getHashKey(params, info) {
    const { parentType, fieldName } = info
    const key = `${parentType}.${fieldName}`
    const hashKey = hash(params, {
      algorithm: 'md5',
      unorderedArrays: false
    })

    return `${key}.${hashKey}`
  }

  /**
   * Set a value from the context
   * @private
   * @param {Object} context
   * @param {string} key
   * @returns {*}
   */
  static getItem(context, key) {
    return context[key]
  }

  /**
   * Set the value to the context
   * @private
   * @param {Object} context
   * @param {string} key
   * @param {*} value
   * @returns {*}
   */
  static setItem(context, key, value) {
    // eslint-disable-next-line no-param-reassign
    context[key] = value

    return value
  }

  /**
   * Return the resolver result using an in-memory cache layer
   * @private
   * @param {function(...params: *): *} method
   * @param {*[]} params
   * @param {Object} context
   * @param {Object} info
   * @returns {Promise<*>}
   */
  static async handle(method, params, context, info) {
    const key = ResolverCacheMiddleware.getHashKey(params, info)
    const value = ResolverCacheMiddleware.getItem(context, key)
    const hasValue = typeof value !== 'undefined'

    return hasValue ? value : ResolverCacheMiddleware.setItem(context, key, method(...params))
  }
}
