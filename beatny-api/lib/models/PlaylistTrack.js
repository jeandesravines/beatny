import PlaylistTrackService from '../services/entities/PlaylistTrackService'
import Model from './Model'
import Playlist from './Playlist'
import Track from './Track'
import PlaylistTrackUser from './PlaylistTrackUser'

/**
 * A PlaylistTrack
 */
export default class PlaylistTrack extends Model {
  /**
   * @const
   * @type {PlaylistTrackService}
   */
  static service = new PlaylistTrackService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      playlist @Playlist
      track @Track
      prediction { score }
      source
      users @PlaylistTrackUser
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      playlist: Playlist,
      track: Track,
      prediction: { score: Number },
      source: String,
      users: [PlaylistTrackUser],
      createdAt: Number,
      updatedAt: Number
    }
  }
}
