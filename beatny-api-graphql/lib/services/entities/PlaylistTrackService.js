import Service from './Service'
import Track from '../../models/Track'

/**
 * PlaylistTrackService
 * @extends {Service<PlaylistTrack>}
 */
export default class PlaylistTrackService extends Service {
  /**
   * Post-Remove hook
   * @param {PlaylistTrack} document
   * @returns {Promise<void>}
   */
  static async onPostRemove(document) {
    await Track.deleteManyBy({ id: document.track })
  }
}
