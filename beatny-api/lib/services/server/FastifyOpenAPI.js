import fp from 'fastify-plugin'
import router from './FastifyRouter'

/**
 * @const {function(FastifyInstance, object): Promise<void>}
 */
export default fp(async (fastify, options) => {
  const { url } = options
  const routes = router.getRoutes(options)

  fastify.decorateRequest('api', options.api)
  fastify.decorateRequest('getUrl', path => `${url}/${path}`)
  fastify.decorateRequest('locals', {})

  routes.forEach(route => fastify.route(route))
})
