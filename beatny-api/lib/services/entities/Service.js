import _ from 'lodash'
import got from 'got'
import * as configuration from '../../configuration'
import ApiGraphQLError from '../../errors/api-graphql/ApiGraphQLError'
import ApiGraphQLServerError from '../../errors/api-graphql/ApiGraphQLServerError'
import Logger from '../logger/Logger'

/**
 * Model's service
 * @template {T<Model>}
 * @abstract
 */
export default class Service {
  /**
   * @protected
   * @const {Class<T>}
   */
  model

  /**
   * @private
   * @const {string}
   */
  name

  /**
   * Create a Service
   * @protected
   * @param {string} name
   * @param {Class<T>} model
   */
  constructor(name, model) {
    this.name = name
    this.model = model
  }

  /**
   * Call the DB proxy
   * @protected
   * @param {string} query
   * @param {?Object} variables
   * @returns {Promise<*>}
   */
  static async query(query, variables) {
    const url = configuration.db.url
    const options = {
      json: true,
      throwHttpErrors: false,
      body: { query, variables }
    }

    Logger.debug({
      msg: 'service/graphql-request',
      query: query.replace(/\s+/g, ' '),
      variables
    })

    const { body } = await got.post(url, options).catch(error => {
      throw new ApiGraphQLServerError(error.message)
    })

    if (body.errors) {
      throw new ApiGraphQLError(body.errors[0])
    }

    return body.data
  }

  /**
   * Normalize a Model or a Model collection
   * @param {T|T[]} data
   * @returns {Object|Object[]}
   */
  normalize(data) {
    return _.isArray(data)
      ? data.map(entry => this.model.normalize(entry))
      : this.model.normalize(data)
  }

  /**
   * Create an instance of the Service's Model
   * @protected
   * @param {?Object} data
   * @returns {(T|null)}
   */
  denormalize(data) {
    if (!data) {
      return null
    }

    return _.isArray(data) ? data.map(document => this.model.make(document)) : this.model.make(data)
  }

  /**
   * Query for multiple document
   * @param {string} query
   * @param {?Object} variables
   * @returns {Promise<(T[]|T|null)>}
   */
  async query(query, variables) {
    const response = await this.constructor.query(query, variables)
    const key = Object.keys(response)[0]
    const result = response[key]

    return this.denormalize(result)
  }
}
