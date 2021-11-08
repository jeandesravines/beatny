export default {
  jwt: {
    secret: process.env.BN_AUTH_SECRET,
    accessOptions: {
      algorithm: 'HS512',
      expiresIn: 60 * 60
    },
    refreshOptions: {
      algorithm: 'HS512',
      expiresIn: 30 * 24 * 60 * 60
    }
  }
}
