import HttpError from './HttpError'

/**
 * 409 Conflict
 */
export default class ConflictError extends HttpError {
  /**
   * Create an Error
   * @param {string} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 409
    })
  }
}
