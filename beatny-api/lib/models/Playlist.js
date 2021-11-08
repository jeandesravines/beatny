import Model from './Model'
import PlaylistService from '../services/entities/PlaylistService'
import * as configuration from '../configuration'
import Account from './Account'
import Place from './Place'
import PlaylistTrack from './PlaylistTrack'

/**
 * A Playlist information
 */
export default class Playlist extends Model {
  /**
   * @const
   * @type {PlaylistService}
   */
  static service = new PlaylistService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      account @Account
      place @Place
      uid
      features { ${configuration.track.features.used.join(' ')} }
      genres
      filledUpAt
      predictedAt
      synchronizedAt
      settings { minScore }
      tracks @PlaylistTrack
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      account: Account,
      place: Place,
      features: {},
      genres: [String],
      filledUpAt: Number,
      predictedAt: Number,
      synchronizedAt: Number,
      settings: { minScore: Number },
      uid: String,
      tracks: [PlaylistTrack],
      createdAt: Number,
      updatedAt: Number
    }
  }
}
