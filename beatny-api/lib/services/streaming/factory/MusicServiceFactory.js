import InternalServerError from '../../../errors/common/InternalServerError'
import { AccountType } from '../../../constants/Account'
import DeezerMusicService from '../deezer/DeezerMusicService'
import SpotifyMusicService from '../spotify/SpotifyMusicService'

/**
 * Allows to get a MusicService instance according to a user account's type
 */
export default class MusicServiceFactory {
  /**
   * @param {Account} account
   * @returns {Class}
   * @throws {InternalServerError}
   */
  static getServiceByAccount(account) {
    switch (account.service) {
      case AccountType.spotify:
        return SpotifyMusicService

      case AccountType.deezer:
        return DeezerMusicService

      default:
        throw new InternalServerError('music-service/unknown-service', {
          service: account.service
        })
    }
  }
}
