import Service from './Service'
import Beacon from '../../models/Beacon'
import Playlist from '../../models/Playlist'
import PlaceUser from '../../models/PlaceUser'
import Session from '../../models/Session'

/**
 * PlaceService
 * @extends {Service<Place>}
 */
export default class PlaceService extends Service {
  /**
   * Post-Remove hook
   * @param {Place} document
   * @returns {Promise<void>}
   */
  static async onPostRemove(document) {
    await Promise.all([
      Beacon.deleteManyBy({ place: document.id }),
      Playlist.deleteManyBy({ place: document.id }),
      PlaceUser.deleteManyBy({ place: document.id }),
      Session.deleteManyBy({ place: document.id })
    ])
  }
}
