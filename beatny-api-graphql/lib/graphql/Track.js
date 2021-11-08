import { gql } from 'apollo-server'

export default gql`
  ## Inputs

  input TrackInput {
    uid: String
    name: String
    album: String
    artist: String
    features: TrackFeaturesInput
    genres: [String]
    photoUrl: String
  }

  input TrackFeaturesInput {
    acousticness: Float
    danceability: Float
    energy: Float
    instrumentalness: Float
    liveness: Float
    loudness: Float
    popularity: Float
    speechiness: Float
    valence: Float
  }

  ## Types

  type Track {
    uid: String!
    name: String!
    album: String!
    artist: String!
    features: TrackFeatures!
    genres: [String]!
    photoUrl: String
  }

  type TrackFeatures {
    acousticness: Float
    danceability: Float
    energy: Float
    instrumentalness: Float
    liveness: Float
    loudness: Float
    popularity: Float
    speechiness: Float
    valence: Float
  }
`
