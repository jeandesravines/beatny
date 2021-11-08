export default {
  tracing: process.env.BN_GRAPHQL_DEBUG === '1',
  playground: process.env.BN_GRAPHQL_DEBUG === '1',
  cors: false
}
