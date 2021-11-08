import UnauthorizedError from '../errors/common/UnauthorizedError'
import AuthService from '../services/security/AuthService'

/**
 *
 */
export default class AuthMiddleware {
  /**
   * @returns {Function}
   */
  static middleware() {
    return this.handle
  }

  /**
   * @param {Object} locals
   * @param {Object} headers
   * @param {string} headers.authorization
   * @param {{info: Function}} log
   * @returns {Promise<void>}
   */
  static async handle({ locals, headers, log }) {
    const accessToken = headers.authorization.replace(/^Bearer /, '')
    const user = await AuthService.getUserByAccessToken({ accessToken })

    if (!user) {
      throw new UnauthorizedError('auth/invalid-authorization')
    }

    log.info({
      msg: 'auth/user-authenticated',
      user: { id: user.id }
    })

    Object.assign(locals, {
      user
    })
  }
}
