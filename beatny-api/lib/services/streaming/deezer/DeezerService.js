import axios from 'axios'
import * as configuration from '../../../configuration'
import DeezerError from '../../../errors/deezer/DeezerError'

/**
 *
 */
export default class DeezerService {
  /**
   * @param {string} path
   * @returns {string}
   */
  static getUrl(path) {
    return `${configuration.deezer.uris.api}/${path}`
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @returns {{
   *   displayName: ?string,
   *   email: string,
   *   photoUrl: ?string,
   *   uid: string
   * }}
   */
  static async getUserProfile(params) {
    const { accessToken } = params
    const profile = await this.request({
      accessToken,
      path: 'user/me'
    })

    return {
      displayName: profile.name,
      email: profile.email,
      photoUrl: profile.picture,
      uid: profile.id.toString()
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @returns {Object[]}
   */
  static async getUserTopTracks(params) {
    const { accessToken } = params
    const response = await this.request({
      accessToken,
      path: 'user/me/charts/tracks'
    })

    return response.data
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.path
   * @param {Object} [params.data]
   * @param {Object} [params.query]
   * @param {string} [params.method = 'get']
   * @returns {Promise<*>}
   */
  static async request(params) {
    const { accessToken, data, path, query = {}, method = 'get' } = params
    const options = {
      data,
      method,
      params: { ...query, access_token: accessToken },
      url: this.getUrl(path)
    }

    const response = await axios.request(options).catch(error => {
      throw new DeezerError(error.message)
    })

    return response?.data
  }
}
