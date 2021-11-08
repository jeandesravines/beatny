/**
 * An HTTP error with a status code
 * @abstract
 */
export default class HttpError extends Error {
  /**
   * @const
   * @type {*} - error details
   */
  details

  /**
   * @const
   * @type {string} - a identifier for the error type
   */
  error

  /**
   * @const
   * @type {number} - the HTTP status code
   */
  statusCode

  /**
   * Create an Error
   * @param {Object} data - the error's data
   * @param {string} data.message - the user message
   * @param {number} data.statusCode - the HTTP status code
   * @param {*} [data.details] - some details
   */
  constructor(data) {
    super(data.message)

    this.error = this.constructor.name
    this.details = data.details
    this.statusCode = data.statusCode
  }
}
