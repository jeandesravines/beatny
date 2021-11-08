import HttpError from './HttpError'

/**
 * 401 Unauthorized
 */
export default class UnauthorizedError extends HttpError {
  /**
   * Create an Error
   * @param {string} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 401
    })
  }
}
