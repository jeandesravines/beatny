import * as configuration from '../configuration'
import InternalServerError from '../errors/common/InternalServerError'
import UnauthorizedError from '../errors/common/UnauthorizedError'
import { AccountType } from '../constants/Account'
import AccountToken from '../models/AccountToken'
import SpotifyAuthService from '../services/streaming/spotify/SpotifyAuthService'
import Controller from './Controller'

/**
 * OAuth 2.0 flow for Spotify
 */
export default class SpotifyAuthController extends Controller {
  /**
   * @param {Object} query
   * @param {boolean} [query.isPlace]
   * @param {boolean} [query.showDialog]
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @returns {Promise<void>}
   */
  static async auth({ query, request, reply }) {
    const { isPlace, showDialog } = query
    const redirectUri = this.getRedirectUri(request)
    const accountToken = await AccountToken.service.createOne({
      service: AccountType.spotify
    })

    const state = accountToken.id
    const location = SpotifyAuthService.getLoginUri({
      isPlace,
      showDialog,
      redirectUri,
      state
    })

    reply.redirect(location)
  }

  /**
   * @param {Object} query
   * @param {string} [query.code]
   * @param {string} [query.state]
   * @param {string} [query.error]
   * @param {FastifyRequest} request
   * @returns {Promise<Object>}
   */
  static async callback({ query, request }) {
    const { code, error, state } = query

    if (error) {
      throw new InternalServerError('spotify-auth/internal-error', {
        message: error.message
      })
    }

    if (!code || !state) {
      throw new UnauthorizedError('spotify-auth/no-code-or-state', {
        code: Boolean(code),
        state: Boolean(state)
      })
    }

    await AccountToken.service.consumeAccountToken({
      id: state,
      service: AccountType.spotify
    })

    return SpotifyAuthService.login({
      code,
      redirectUri: this.getRedirectUri(request)
    })
  }

  /**
   * @param {FastifyRequest} request
   * @returns {string}
   */
  static getRedirectUri(request) {
    return request.getUrl(configuration.spotify.uris.redirect)
  }
}
