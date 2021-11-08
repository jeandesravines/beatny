export default {
  auth: {
    clientId: process.env.BN_DEEZER_CLIENT_ID,
    clientSecret: process.env.BN_DEEZER_CLIENT_SECRET,
    scope: 'offline_access,basic_access,email,listening_history'
  },
  uris: {
    api: 'https://api.deezer.com',
    auth: 'https://connect.deezer.com/oauth/auth.php',
    token: 'https://connect.deezer.com/oauth/access_token.php',
    redirect: 'auth/deezer/callback'
  }
}
