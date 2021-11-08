export default {
  uri: process.env.BN_MONGODB_URI,
  debug: process.env.BN_MONGODB_DEBUG === '1',
  options: {
    autoIndex: false,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
  }
}
