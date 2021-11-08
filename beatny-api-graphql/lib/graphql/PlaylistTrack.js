import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Mutation {
    playlistTrackSaveMany(where: [String!]!, data: [PlaylistTrackInput]!): [PlaylistTrack]!
  }

  ## Inputs

  input PlaylistTrackInput {
    id: ID
    playlist: DocumentInput
    track: TrackInput
  }

  ## Types

  type PlaylistTrack implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    playlist: Playlist!
    track: Track!
    source: PlaylistTrackSource!
    order: Int!
    users: [PlaylistTrackUser]!
    prediction: PlaylistTrackPrediction
  }

  type PlaylistTrackPrediction {
    cluster: Int!
    clusters: Int!
    distance: Float!
    score: Float!
  }
`
