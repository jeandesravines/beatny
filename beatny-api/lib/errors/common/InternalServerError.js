import HttpError from './HttpError'

/**
 * 500 Internal Server Error
 */
export default class InternalServerError extends HttpError {
  /**
   * Create an Error
   * @param {string} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 500
    })
  }
}
