import Model from './Model'
import AccountTokenService from '../services/entities/AccountTokenService'

/**
 * An AccountToken used to create an access token for an Account
 */
export default class AccountToken extends Model {
  /**
   * @const
   * @type {AccountTokenService}
   */
  static service = new AccountTokenService()

  /**
   * GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      service
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      service: String,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
