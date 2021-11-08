import axios from 'axios'
import querystring from 'querystring'
import * as configuration from '../../../configuration'
import SpotifyError from '../../../errors/spotify/SpotifyError'
import { AccountType } from '../../../constants/Account'
import Account from '../../../models/Account'
import AppAccount from '../../../models/AppAccount'

import AuthService from '../../security/AuthService'
import SpotifyService from './SpotifyService'

/**
 *
 */
export default class SpotifyAuthService {
  /**
   * @param {Account} account
   * @returns {Promise<string>}
   */
  static async getAccessTokenByAccount(account) {
    if (account.expiresAt > Date.now()) {
      return account.accessToken
    }

    return this.getAccessTokenByAccount(await this.refreshAccount(account))
  }

  /**
   * @param {Account} account
   * @returns {Promise<Account>}
   */
  static async refreshAccount(account) {
    const { refreshToken } = account
    const response = await this.request({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })

    return Account.service.updateByUserAndService(
      account.merge({
        accessToken: response.access_token,
        expiresAt: Date.now() + response.expires_in * 1000
      })
    )
  }

  /**
   * @returns {Promise<string>}
   */
  static async getAppAccessToken() {
    return this.getAppAccessTokenByAppAccount(await AppAccount.service.getCurrent())
  }

  /**
   * Get the current AppAccount's token
   * @param {?AppAccount} appAccount
   * @returns {Promise<string>}
   */
  static async getAppAccessTokenByAppAccount(appAccount) {
    if (appAccount?.expiresAt > Date.now()) {
      return appAccount.accessToken
    }

    return this.getAppAccessTokenByAppAccount(await this.refreshAppAccount())
  }

  /**
   * Refresh the current AppAccount's token
   * @private
   * @returns {Promise<AppAccount>}
   */
  static async refreshAppAccount() {
    const response = await this.request({
      grant_type: 'client_credentials'
    })

    return AppAccount.service.updateCurrent({
      accessToken: response.access_token,
      expiresAt: Date.now() + response.expires_in * 1000
    })
  }

  /**
   * @param {Object} params
   * @param {string} params.redirectUri
   * @param {string} params.state
   * @param {boolean} [params.isPlace]
   * @param {boolean} [params.showDialog]
   * @returns {string}
   */
  static getLoginUri({ redirectUri, state, isPlace, showDialog }) {
    const { auth, uris } = configuration.spotify
    const { clientId, userScope, placeScope } = auth
    const scope = isPlace ? placeScope : userScope
    const query = querystring.stringify({
      scope,
      state,
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      show_dialog: showDialog
    })

    return `${uris.auth}?${query}`
  }

  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.redirectUri
   * @returns {Promise<{
   *   accessToken: string,
   *   refreshToken: string,
   *   expiresIn: number
   * }>}
   */
  static async login({ code, redirectUri }) {
    const user = await this.requestToken({ code, redirectUri })

    return AuthService.getToken({ user, withRefreshToken: true })
  }

  /**
   * @param {Object} [data]
   * @returns {Promise<*>}
   */
  static async request(data) {
    const { auth, uris } = configuration.spotify
    const { clientId, clientSecret } = auth
    const formData = querystring.stringify({
      ...data,
      client_id: clientId,
      client_secret: clientSecret
    })

    const response = await axios.post(uris.token, formData).catch(error => {
      throw new SpotifyError('spotify-auth/request-error', error)
    })

    return response.data
  }

  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.redirectUri
   * @returns {Promise<User>}
   */
  static async requestToken({ code, redirectUri }) {
    const response = await this.request({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })

    return this.updateUserAndAccount({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: Date.now() + response.expires_in * 1000
    })
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.refreshToken
   * @param {number} params.expiresAt
   * @returns {Promise<User>}
   */
  static async updateUserAndAccount({ accessToken, refreshToken, expiresAt }) {
    const profile = await SpotifyService.getUserProfile({ accessToken })

    return AuthService.updateUserAndAccount({
      profile,
      service: AccountType.spotify,
      token: {
        accessToken,
        refreshToken,
        expiresAt
      }
    })
  }
}
