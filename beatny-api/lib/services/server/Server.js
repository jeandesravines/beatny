import cors from 'cors'
import fastify from 'fastify/fastify'
import fastifyFormBody from 'fastify-formbody/formbody'
import RefParser from 'json-schema-ref-parser/lib/index'
import path from 'path'

import * as configuration from '../../configuration'
import fastifyOpenApi from './FastifyOpenAPI'
import * as controllers from '../../controllers'
import * as middlewares from '../../middlewares'
import ErrorMiddleware from '../../middlewares/ErrorMiddleware'

const apiPath = path.resolve(process.cwd(), 'lib/openapi/openapi.yml')

/**
 * Create a Server instance
 * @returns {Promise<FastifyInstance>}
 */
export const connect = async () => {
  const api = await RefParser.dereference(apiPath)
  const server = fastify(configuration.fastify)

  server.use(cors())
  server.register(fastifyFormBody)
  server.register(fastifyOpenApi, {
    api,
    controllers,
    middlewares,
    url: configuration.server.url
  })

  if (configuration.server.errorStack) {
    server.setErrorHandler(ErrorMiddleware.middleware())
  }

  await server.listen(configuration.server.port, configuration.server.address)

  return server
}
