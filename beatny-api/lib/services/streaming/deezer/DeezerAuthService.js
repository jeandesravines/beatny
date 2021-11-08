import axios from 'axios'
import querystring from 'querystring'
import * as configuration from '../../../configuration'
import DeezerError from '../../../errors/deezer/DeezerError'
import { AccountType } from '../../../constants/Account'
import AuthService from '../../security/AuthService'
import DeezerService from './DeezerService'

/**
 *
 */
export default class DeezerAuthService {
  /**
   * @param {Account} account
   * @returns {Promise<string>}
   */
  static async getAccessTokenByAccount(account) {
    return account.accessToken
  }

  /**
   * @param {Object} params
   * @param {string} params.redirectUri
   * @param {string} params.state
   * @param {boolean} [params.showDialog]
   * @param {boolean} [params.isPlace]
   * @returns {string}
   */
  static getLoginUri(params) {
    const { auth, uris } = configuration.deezer
    const { clientId, scope } = auth
    const { redirectUri, state } = params

    const perms = scope.replace(/\s+/g, ',')
    const query = querystring.stringify({
      perms,
      state,
      app_id: clientId,
      redirect_uri: redirectUri
    })

    return `${uris.auth}?${query}`
  }

  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.redirectUri
   * @returns {Promise<Object>}
   */
  static async login(params) {
    const { code, redirectUri } = params
    const user = await this.requestToken({ code, redirectUri })

    return AuthService.getToken({ user, withRefreshToken: true })
  }

  /**
   * @param {Object} params
   * @param {string} params.url
   * @param {Object} params.query
   * @returns {Promise<*>}
   */
  static async request(params) {
    const { auth } = configuration.deezer
    const { clientId, clientSecret } = auth
    const { url, query } = params
    let response

    try {
      response = await axios.get(url, {
        params: { ...query, app_id: clientId, secret: clientSecret }
      })
    } catch (error) {
      throw new DeezerError('deezer/request-error', error.message)
    }

    return response.data
  }

  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.redirectUri
   * @returns {Promise<User>}
   */
  static async requestToken(params) {
    const { code } = params
    const { uris } = configuration.deezer
    const response = await this.request({
      url: uris.token,
      query: {
        code,
        output: 'json'
      }
    })

    return this.updateUserAndAccount({
      token: { accessToken: response.access_token }
    })
  }

  /**
   * @param {Object} token
   * @param {string} token.accessToken
   * @param {string} token.refreshToken
   * @param {number} token.expiresAt
   * @returns {Promise<User>}
   */
  static async updateUserAndAccount({ token }) {
    const { accessToken } = token
    const profile = await DeezerService.getUserProfile({ accessToken })

    return AuthService.updateUserAndAccount({
      token,
      profile,
      service: AccountType.deezer
    })
  }
}
