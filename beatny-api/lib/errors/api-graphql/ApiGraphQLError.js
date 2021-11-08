import InternalServerError from '../common/InternalServerError'

/**
 * An error about API GraphQL
 */
export default class ApiGraphQLError extends InternalServerError {
  /**
   * Create an Error
   * @param {Object} error
   * @param {string} error.message
   * @param {Object} error.extensions
   */
  constructor(error) {
    super(error.message, {
      path: error.path,
      code: error.extensions.code,
      exception: error.extensions.exception
    })
  }
}
