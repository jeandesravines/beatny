import Model from './Model'
import ClientService from '../services/entities/ClientService'

/**
 * A Client credentials for the App
 */
export default class Client extends Model {
  /**
   * @const
   * @type {ClientService}
   */
  static service = new ClientService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      key
      secret
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      key: String,
      secret: String,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
