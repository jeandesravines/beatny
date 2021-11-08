import _ from 'lodash'

/**
 * Allow to transform an Object to its Dot Notation form
 */
export default class DotNotation {
  /**
   * Normalize an object to its [Dot Notation](https://docs.mongodb.com/manual/core/document/#dot-notation)
   * form
   * @private
   * @param {Object} data
   * @param {string} [prefix = '']
   * @returns {Object}
   * @see https://docs.mongodb.com/manual/core/document/#dot-notation
   */
  static toPaths(data, prefix = '') {
    const iteratee = (acc, value, key) => {
      const keyPrefix = prefix + key
      const result = _.isPlainObject(value)
        ? DotNotation.toPaths(value, `${keyPrefix}.`)
        : { [keyPrefix]: value }

      return { ...acc, ...result }
    }

    return _.reduce(data, iteratee, {})
  }

  /**
   * Denormalize a Dot notation Object
   * @param {*} data
   * @returns {Object}
   */
  static toObject(data) {
    const iteratee = (acc, current, path) => {
      const index = path.indexOf('.')
      const start = index < 0 ? path : path.slice(0, index)
      const end = path.slice(index + 1)
      const result =
        index < 0 ? current : _.merge(acc[start], DotNotation.toObject({ [end]: current }))

      acc[start] = result
    }

    return _.transform(data, iteratee, {})
  }
}
