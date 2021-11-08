import _ from 'lodash'
import Model from './Model'
import * as configuration from '../configuration'

/**
 * A Track
 */
export default class Track extends Model {
  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      uid
      album
      artist
      features { ${configuration.track.features.used.join(' ')} }
      genres
      name
      photoUrl
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      uid: String,
      album: String,
      artist: String,
      features: configuration.track.features.used.reduce((acc, key) => ({ ...acc, [key]: Number })),
      genres: [String],
      name: String,
      photoUrl: String,
      createdAt: Number,
      updatedAt: Number
    }
  }

  /**
   * Returns true if the Track fulfill all the Playlist's required criteria
   * about features and genres
   * @param {Object<{ min: ?number, max: ?number }>} features
   * @param {string[]} genres
   * @returns {boolean}
   */
  hasRequiredCriteria({ features, genres }) {
    return this.hasRequiredFeatures({ features }) && this.hasRequiredGenres({ genres })
  }

  /**
   * Returns true if the Track fulfill the Playlist's required features.
   * @private
   * @param {Object<{ min: ?number, max: ?number }>} features
   * @returns {boolean}
   */
  hasRequiredFeatures({ features }) {
    return _.every(features, ({ min = 0, max = 1 }, name) =>
      _.inRange(Number(this.features[name]), min, max)
    )
  }

  /**
   * Returns true if the Track has one of the Playlist's required genres.
   * If playlist.genres or track.genres is empty, the function will returns true as well.
   * Otherwise, the Track have to own one of the Playlist's genre.
   * @private
   * @param {string[]} genres
   * @returns {boolean}
   */
  hasRequiredGenres({ genres }) {
    return (
      _.isEmpty(this.genres) ||
      _.isEmpty(genres) ||
      _.some(genres, name => this.genres.includes(name))
    )
  }
}
