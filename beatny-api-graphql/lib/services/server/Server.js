import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import * as configuration from '../../configuration'
import typeDefs from '../../graphql'
import resolvers from '../../resolvers'
import Logger from '../logger/Logger'
import ResolverCacheMiddleware from '../../middlewares/ResolverCacheMiddleware'

/**
 * Create and initialize the GraphQL server
 * @returns {Promise<ApolloServer>}
 */
export const connect = async () => {
  const executableSchema = makeExecutableSchema({ typeDefs, resolvers })
  const schema = applyMiddleware(executableSchema, ResolverCacheMiddleware.middleware())
  const server = new ApolloServer({
    schema,
    cors: configuration.apollo.cors,
    playground: configuration.apollo.playground,
    tracing: configuration.apollo.tracing,
    context: ({ req }) => {
      Logger.info({
        msg: 'incoming request',
        query: req.body.query
      })
    }
  })

  await server
    .listen(configuration.server.port, configuration.server.address)
    .then(({ url }) => Logger.info(`Server listening at ${url}`))

  return server
}
