import Model from './Model'
import Beacon from './Beacon'
import Playlist from './Playlist'
import PlaceService from '../services/entities/PlaceService'

/**
 * A Place information
 */
export default class Place extends Model {
  /**
   * @const
   * @type {PlaceService}
   */
  static service = new PlaceService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      name
      address
      location { lat lng }
      users { access user @User }
      beacons @Beacon
      playlist @Playlist
      playlists { id }
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      name: String,
      address: String,
      location: { lat: Number, lng: Number },
      beacons: [Beacon],
      playlist: Playlist,
      playlists: [Playlist],
      createdAt: Number,
      updatedAt: Number
    }
  }
}
