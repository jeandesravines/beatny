export default {
  replayInterval: Number(process.env.BN_TRACK_REPLAY_INTERVAL) || 10,
  genreLevenshteinDistance: Number(process.env.BN_GENRE_LEVENSHTEIN_DISTANCE) || 10,
  topTrackCount: Number(process.env.BN_TRACK_TOP_TRACK_COUNT) || 50,
  features: {
    used: [
      'acousticness',
      'danceability',
      'energy',
      'instrumentalness',
      'liveness',
      'loudness',
      'popularity',
      'speechiness',
      'valence'
    ]
  }
}
