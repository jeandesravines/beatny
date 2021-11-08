import Model from './Model'
import AccountService from '../services/entities/AccountService'
import User from './User'

/**
 * An Account of a streaming music service
 */
export default class Account extends Model {
  /**
   * @const
   * @type {AccountService}
   */
  static service = new AccountService()

  /**
   * GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      service
      accessToken
      refreshToken
      expiresAt
      uid
      user @User
    }
  `)

  /**
   * Schema
   * @const
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      service: String,
      accessToken: String,
      refreshToken: String,
      expiresAt: Number,
      uid: String,
      user: User,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
