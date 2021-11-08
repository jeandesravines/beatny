import * as configuration from '../../configuration'
import Beacon from '../../models/Beacon'
import Service from './Service'

/**
 * @extends {Service<Beacon>}
 */
export default class BeaconService extends Service {
  /**
   * @override
   */
  constructor() {
    super('Beacon', Beacon)
  }

  /**
   * Find a Beacon
   * @private
   * @param {Object} where
   * @param {Object} filter
   * @returns {Promise<(Beacon|null)>}
   */
  async findOneBy(where, filter) {
    const query = `
      query($where: BeaconInput!, $filter: BeaconFilterInput) {
        beaconFindOne(where: $where, filter: $filter) ${this.model.fragment}
      }
    `

    return this.query(query, {
      filter,
      where: this.normalize(where)
    })
  }

  /**
   * @param {Object} params
   * @param {string} params.uuid
   * @param {int} params.major
   * @param {int} params.minor
   * @param {{ lat: number, lng: number }} params.location
   * @returns {Promise<(Beacon|null)>}
   */
  async getByLocationAndData(params) {
    const { location, major, minor, uuid } = params
    const { maxDistance } = configuration.beacon
    const where = { major, minor, uuid }
    const filter = {
      near: {
        path: 'location',
        center: [location.lat, location.lng],
        maxDistance
      }
    }

    return this.findOneBy(where, filter)
  }
}
