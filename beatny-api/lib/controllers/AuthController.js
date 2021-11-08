import AuthService from '../services/security/AuthService'
import Controller from './Controller'

/**
 * AuthController
 */
export default class AuthController extends Controller {
  /**
   * Get a new access token using the refresh token
   * @param {Object} body
   * @param {string }body.refreshToken
   * @returns {Promise<{
   *   accessToken: string,
   *   refreshToken: string,
   *   expiresIn: number
   * }>}
   */
  static async refreshToken({ body }) {
    const { refreshToken } = body

    return AuthService.refreshToken({ refreshToken })
  }
}
