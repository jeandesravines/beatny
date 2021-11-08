import _ from 'lodash'
import SpotifyService from '../spotify/SpotifyService'
import DeezerAuthService from './DeezerAuthService'
import DeezerService from './DeezerService'

/**
 *
 */
export default class DeezerMusicService {
  /**
   * @param {Account} account
   * @returns {{
   *   accessToken: string,
   *   expiresAt: number
   * }}
   */
  static async getAccessTokenByAccount(account) {
    return DeezerAuthService.getAccessTokenByAccount(account)
  }

  /**
   * @param {Object} options
   * @param {string} options.accessToken
   * @returns {Object[]} the user's top tracks
   */
  static async getUserTopTracks({ accessToken }) {
    const response = await DeezerService.getUserTopTracks({ accessToken })
    const tracks = await SpotifyService.searchTracks({
      tracks: response.map(data => ({
        album: data.album.title,
        artist: data.artist.name,
        track: data.title
      }))
    })

    return _.compact(tracks)
  }
}
