import Model from './Model'
import AppAccountService from '../services/entities/AppAccountService'

/**
 * A App client access token for Spotify
 */
export default class AppAccount extends Model {
  /**
   * @const
   * @type {AppAccountService}
   */
  static service = new AppAccountService()

  /**
   * GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      uid
      accessToken
      expiresAt
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      uid: String,
      accessToken: String,
      expiresAt: Number,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
