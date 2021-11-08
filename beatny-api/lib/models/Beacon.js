import Model from './Model'
import Place from './Place'
import BeaconService from '../services/entities/BeaconService'

/**
 * A Beacon device information
 */
export default class Beacon extends Model {
  /**
   * @const
   * @type {BeaconService}
   */
  static service = new BeaconService()

  /**
   * GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      uuid
      major
      minor
      location { lat lng }
      place @Place
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      uuid: String,
      major: Number,
      minor: Number,
      location: { lat: Number, lng: Number },
      place: Place,
      createdAt: Number,
      updatedAt: Number
    }
  }
}
