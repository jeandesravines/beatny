import InternalServerError from '../common/InternalServerError'

/**
 * An error about Mongoose
 */
export default class MongooseError extends InternalServerError {
  /**
   * Create a Mongoose Error
   * @param {Error} error
   */
  constructor(error) {
    super('database/error', {
      ...error,
      name: error.name,
      message: error.message.slice(0, 512)
    })

    this.stack = error.stack
  }
}
