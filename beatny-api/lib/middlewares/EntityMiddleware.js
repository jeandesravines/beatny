import NotFoundError from '../errors/common/NotFoundError'
import * as models from '../models'

/**
 * Middleware used to load entity and store it to the request
 */
export default class EntityMiddleware {
  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.key
   * @param {string} options.target
   * @returns {Function}
   */
  static middleware({ name, key, target }) {
    const model = models[name]
    const options = { model, key, target, name }

    return request => this.handle(request, options)
  }

  /**
   * @param {FastifyRequest} request
   * @param {Object} request.locals
   * @param {Object} request.params
   * @param {Object} options
   * @param {Class<Model>} options.model
   * @param {string} options.key
   * @param {string} options.name
   * @param {string} options.target
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  static async handle({ locals, params }, options) {
    const { model, key, name, target } = options
    const id = params[key]
    const entity = await model.service.findOneBy({ id })

    if (!entity) {
      throw new NotFoundError(`entity/not-found`, { name, id })
    }

    Object.assign(locals, {
      [target]: entity
    })
  }
}
