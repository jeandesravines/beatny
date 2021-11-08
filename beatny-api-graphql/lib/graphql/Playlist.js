import { gql } from 'apollo-server'
import { PlaylistTrackSources } from '../constants/PlaylistTrack'

export default gql`
  ## Roots

  extend type Query {
    playlistFindOne(where: PlaylistInput!): Playlist
  }

  extend type Mutation {
    playlistUpdateOne(where: PlaylistInput!, data: PlaylistInput!): Playlist
  }

  ## Enum

  enum PlaylistTrackSource {
    ${Object.values(PlaylistTrackSources).join(' ')}
  }

  ## Inputs

  input PlaylistInput {
    id: ID
    account: DocumentInput
    place: DocumentInput
    genres: [String]
    uid: String
  }

  ## Types

  type Playlist implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    account: Account!
    place: Place!
    tracks: [PlaylistTrack]!
    uid: String!
    genres: [String]!
    settings: PlaylistSettings!
    features: TrackFeatures!
    filledUpAt: Float!
    predictedAt: Float!
    synchronizedAt: Float!
  }

  type PlaylistSettings {
    minScore: Float!
  }
`
