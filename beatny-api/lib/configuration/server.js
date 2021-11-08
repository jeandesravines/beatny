export default {
  address: '0.0.0.0',
  url: process.env.BN_SERVER_URL,
  port: 8080,
  errorStack: process.env.NODE_ENV !== 'production'
}
