import Service from './Service'
import Track from '../../models/Track'

/**
 * UserTrackService
 * @extends {Service<UserTrack>}
 */
export default class UserTrackService extends Service {
  /**
   * Post-Remove hook
   * @param {UserTrack} document
   * @returns {Promise<void>}
   */
  static async onPostRemove(document) {
    await Track.deleteManyBy({ id: document.track })
  }
}
