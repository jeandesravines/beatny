import Service from './Service'
import Account from '../../models/Account'
import PlaylistTrack from '../../models/PlaylistTrack'

/**
 * PlaylistService
 * @extends {Service<Playlist>}
 */
export default class PlaylistService extends Service {
  /**
   * Post-Remove hook
   * @param {Playlist} document
   * @returns {Promise<void>}
   */
  static async onPostRemove(document) {
    await Promise.all([
      Account.deleteManyBy({ id: document.account }),
      PlaylistTrack.deleteManyBy({ playlist: document.id })
    ])
  }
}
