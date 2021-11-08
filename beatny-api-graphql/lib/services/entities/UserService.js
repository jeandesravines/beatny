import Service from './Service'
import Account from '../../models/Account'
import PlaceUser from '../../models/PlaceUser'
import PlaylistTrackUser from '../../models/PlaylistTrackUser'
import Session from '../../models/Session'
import UserTrack from '../../models/UserTrack'

/**
 * UserService
 * @extends {Service<User>}
 */
export default class UserService extends Service {
  /**
   * Post-Remove hook
   * @param {User} document
   * @returns {Promise<void>}
   */
  static async onPostRemove(document) {
    await Promise.all([
      Account.deleteManyBy({ user: document.id }),
      PlaceUser.deleteManyBy({ user: document.id }),
      PlaylistTrackUser.deleteManyBy({ user: document.id }),
      Session.deleteManyBy({ user: document.id }),
      UserTrack.deleteManyBy({ user: document.id })
    ])
  }
}
