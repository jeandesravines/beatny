import SessionService from '../services/entities/SessionService'
import Model from './Model'
import Place from './Place'
import User from './User'

/**
 * A User's Session information
 */
export default class Session extends Model {
  /**
   * @const
   * @type {SessionService}
   */
  static service = new SessionService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      status
      place @Place
      user @User
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      status: String,
      place: Place,
      user: User,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
