import jwt, { TokenExpiredError } from 'jsonwebtoken'
import * as configuration from '../../configuration'
import UnauthorizedError from '../../errors/common/UnauthorizedError'
import Account from '../../models/Account'
import User from '../../models/User'

/**
 *
 */
export default class AuthService {
  /**
   * @param {Object} profile
   * @param {string} profile.email
   * @param {string} profile.uid
   * @param {string} [profile.displayName]
   * @param {string} [profile.photoUrl]
   * @param {string} service
   * @param {Object} token
   * @param {string} token.accessToken
   * @param {string} token.refreshToken
   * @param {number} token.expiresAt
   * @returns {Promise<User>}
   */
  static async updateUserAndAccount({ profile, service, token }) {
    const { displayName, email, photoUrl, uid } = profile
    const { accessToken, expiresAt, refreshToken } = token
    const account = await Account.service.findOneByServiceAndUid({ service, uid })

    const userData = { displayName, email, photoUrl }
    const user = account
      ? await User.service.updateOneById({ id: account.user.id }, userData)
      : await User.service.updateOneByEmail({ email }, userData)

    if (!account) {
      await Account.service.createOne({
        service,
        uid,
        user,
        accessToken,
        expiresAt,
        refreshToken
      })
    }

    return user
  }

  /**
   * Get the User corresponding to the given token
   * @param {string} accessToken
   * @returns {Promise<(User|null)>}
   */
  static async getUserByAccessToken({ accessToken }) {
    const { uid } = this.getDecodedToken({ token: accessToken })

    return User.service.findOneById({ id: uid })
  }

  /**
   * Decode a JWT
   * @param {string} token
   * @returns {Object}
   * @throws {UnauthorizedError}
   */
  static getDecodedToken({ token }) {
    const { secret } = configuration.auth.jwt

    try {
      return jwt.verify(token, secret)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedError('auth/jwt-expired')
      } else {
        throw e
      }
    }
  }

  /**
   *
   * @param {string} refreshToken
   * @returns {Promise<{
   *   accessToken: string,
   *   refreshToken: string,
   *   expiresIn: number
   * }>}
   */
  static async refreshToken({ refreshToken }) {
    const user = await this.getUserByAccessToken({ accessToken: refreshToken })
    const token = await this.getToken({ user, withRefreshToken: false })

    return { ...token, refreshToken }
  }

  /**
   * Generates a new JWT for the given User
   * @param {User} user
   * @param {boolean} [withRefreshToken = false] - if true, generates a new refresh token
   * @returns {{
   *   accessToken: string,
   *   refreshToken: ?string,
   *   expiresIn: number
   * }}
   */
  static getToken({ user, withRefreshToken = false }) {
    const payload = { uid: user.id }
    const { secret, accessOptions, refreshOptions } = configuration.auth.jwt
    const accessToken = jwt.sign(payload, secret, accessOptions)
    const refreshToken = withRefreshToken ? jwt.sign(payload, secret, refreshOptions) : undefined

    return {
      expiresIn: accessOptions.expiresIn,
      accessToken,
      refreshToken
    }
  }
}
