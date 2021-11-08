import * as configuration from '../configuration'
import UnauthorizedError from '../errors/common/UnauthorizedError'
import { AccountType } from '../constants/Account'
import AccountToken from '../models/AccountToken'
import DeezerAuthService from '../services/streaming/deezer/DeezerAuthService'
import Controller from './Controller'

/**
 * OAuth 2.0 flow for Deezer
 */
export default class DeezerAuthController extends Controller {
  /**
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @returns {Promise<void>}
   */
  static async auth({ request, reply }) {
    const redirectUri = this.getRedirectUri(request)
    const accountToken = await AccountToken.service.createOne({
      service: AccountType.deezer
    })

    const state = accountToken.id
    const location = DeezerAuthService.getLoginUri({
      redirectUri,
      state
    })

    reply.redirect(location)
  }

  /**
   * @param {Object} query
   * @param {string} query.code
   * @param {string} query.state
   * @param {FastifyRequest} request
   * @returns {Promise<Object>}
   */
  static async callback({ query, request }) {
    const { code, state } = query

    if (!code || !state) {
      throw new UnauthorizedError('deezer-auth/no-code-or-state')
    }

    await AccountToken.service.consumeAccountToken({
      id: state,
      service: AccountType.deezer
    })

    return DeezerAuthService.login({
      code,
      redirectUri: this.getRedirectUri(request)
    })
  }

  /**
   * @param {FastifyRequest} request
   * @param {function(string): string} request.getUrl
   * @returns {string}
   */
  static getRedirectUri(request) {
    return request.getUrl(configuration.deezer.uris.redirect)
  }
}
