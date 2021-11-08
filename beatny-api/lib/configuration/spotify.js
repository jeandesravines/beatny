const scopes = {
  user: 'user-top-read user-read-email',
  place: 'playlist-modify-private playlist-modify-public user-read-currently-playing'
}

export default {
  auth: {
    clientId: process.env.BN_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.BN_SPOTIFY_CLIENT_SECRET,
    userScope: scopes.user,
    placeScope: `${scopes.user} ${scopes.place}`
  },
  service: {
    topTrackCount: Number(process.env.BN_SPOTIFY_TOP_TRACK_COUNT) || 50,
    searchLimit: Number(process.env.BN_SPOTIFY_SEARCH_LIMIT) || 25
  },
  uris: {
    api: 'https://api.spotify.com/v1',
    auth: 'https://accounts.spotify.com/authorize',
    token: 'https://accounts.spotify.com/api/token',
    redirect: 'auth/spotify/callback'
  },
  request: {
    addTrackChunkLength: Number(process.env.BN_SPOTIFY_REQUEST_ADD_TRACK_CHUNK_LENGTH) || 100,
    defaultChunkLength: Number(process.env.BN_SPOTIFY_REQUEST_DEFAULT_CHUNK_LENGTH) || 20
  }
}
