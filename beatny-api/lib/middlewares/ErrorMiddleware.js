/**
 * Middleware use to parse a thrown Error
 */
export default class ErrorMiddleware {
  /**
   * Get the middleware function
   * @returns {Function}
   */
  static middleware() {
    return ErrorMiddleware.handle
  }

  /**
   * Returns the enhanced Error
   * @private
   * @param {Error} error
   * @returns {Promise<{ name: string, message: string, stack: string[] }>}
   */
  static async handle(error) {
    return {
      ...error,
      message: error.message,
      stack: error.stack?.split('\n')
    }
  }
}
