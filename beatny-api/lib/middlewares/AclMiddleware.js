import UnauthorizedError from '../errors/common/UnauthorizedError'

/**
 *
 */
export default class AclMiddleware {
  /**
   * @param {Object} options
   * @param {string[]} options.is
   * @returns {Function}
   */
  static middleware(options) {
    return request => this.handle(request, options)
  }

  /**
   * @param {FastifyRequest} request
   * @param {Object} request.locals
   * @param {User} request.locals.user
   * @param {Object} options
   * @param {string[]} options.is
   * @returns {Promise<void>}
   */
  static async handle({ locals }, options) {
    const { is } = options

    if (!locals.user.hasOneOfRoles(is)) {
      throw new UnauthorizedError('acl/unauthorized-role')
    }
  }
}
