import SpotifyAuthService from './SpotifyAuthService'
import SpotifyService from './SpotifyService'

/**
 *
 */
export default class SpotifyMusicService {
  /**
   * @param {Account} account
   * @returns {{
   *   accessToken: string,
   *   expiresAt: number
   * }}
   */
  static async getAccessTokenByAccount(account) {
    return SpotifyAuthService.getAccessTokenByAccount(account)
  }

  /**
   * @param {Object} options
   * @param {string} options.accessToken
   * @returns {Object[]} the user's top tracks
   */
  static async getUserTopTracks({ accessToken }) {
    return SpotifyService.getUserTopTracks({ accessToken })
  }
}
