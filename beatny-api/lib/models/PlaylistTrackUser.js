import Model from './Model'
import PlaylistTrackUserService from '../services/entities/PlaylistTrackUserService'
import PlaylistTrack from './PlaylistTrack'
import User from './User'

/**
 * A PlaylistTrackUser
 */
export default class PlaylistTrackUser extends Model {
  /**
   * @const
   * @type {PlaylistTrackUserService}
   */
  static service = new PlaylistTrackUserService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      track @PlaylistTrack
      user @User
      removedAt
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
      track: PlaylistTrack,
      removedAt: Number,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
