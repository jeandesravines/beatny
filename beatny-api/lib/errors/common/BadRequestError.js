import HttpError from './HttpError'

/**
 * 404 Bad Request
 */
export default class BadRequestError extends HttpError {
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
