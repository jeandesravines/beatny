import Model from './Model'
import UserTrackService from '../services/entities/UserTrackService'
import Track from './Track'
import User from './User'

/**
 * A UserTrack
 */
export default class UserTrack extends Model {
  /**
   * @const
   * @type {UserTrackService}
   */
  static service = new UserTrackService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      user @User
      track @Track
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      user: User,
      track: Track,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
