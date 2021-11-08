import _ from 'lodash'

/**
 * @abstract
 */
export default class Model {
  /**
   * The Model's Servie
   * @const
   * @type {Service}
   */
  static service

  /**
   * All Models
   * @private
   * @type {Object<Class<Model>>}
   */
  static models = {}

  /**
   * GraphQL fragment
   * @private
   * @returns {string}
   */
  static get fragment() {
    return this.getFragment()
  }

  /**
   * Model's local schema
   * @abstract
   * @protected
   * @const
   * @type {Object}
   */
  static schema = {}

  /**
   * Get the compiled fragment
   * @private
   * @param {string[]} [stack]
   * @returns {string}
   */
  static getFragment(stack = []) {
    if (!this.$fragment) {
      const id = this.name
      const regExp = /@(\w+)/g
      const models = Model.models
      const graphQL = models[id].graphql

      this.$fragment = graphQL.replace(regExp, (value, name) => {
        return stack.includes(name) ? '{ id }' : `${models[name].getFragment(stack.concat(id))}`
      })
    }

    return this.$fragment
  }

  /**
   * Register the model
   * @param {string} fragment
   * @returns {string}
   */
  static setFragment(fragment) {
    this.models[this.name] = this
    return fragment
  }

  /**
   * Normalize an object according to a schema
   * @param {Object|Array} data
   * @param {Object|Array} schema
   * @returns {Object|Array}
   */
  static normalize(data, schema = this.schema) {
    return _.transform(schema, (acc, definition, key) => {
      const value = data[key]

      switch (true) {
        case typeof value === 'undefined':
          break

        case _.isArray(definition):
          acc[key] = value.flatMap(v => this.normalize([v], definition))
          break

        case definition.prototype instanceof Model:
          acc[key] = definition.schema.id ? { id: value.id } : value
          break

        case typeof definition === 'function':
          acc[key] = definition(value)
          break

        case _.isPlainObject(definition):
          acc[key] = this.normalize(value, definition)
          break

        default:
          acc[key] = value
      }
    })
  }

  /**
   * @static
   * @param {Object} [data]
   * @returns {this}
   */
  static make(data) {
    return new this().merge(data)
  }

  /**
   * @param {Object} data
   * @returns {this}
   */
  merge(data) {
    return Object.assign(this, data)
  }
}
