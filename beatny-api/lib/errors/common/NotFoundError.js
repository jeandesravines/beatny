import HttpError from './HttpError'

/**
 * 404 Not Found
 */
export default class NotFoundError extends HttpError {
  /**
   * Create an Error
   * @param {string} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 404
    })
  }
}
