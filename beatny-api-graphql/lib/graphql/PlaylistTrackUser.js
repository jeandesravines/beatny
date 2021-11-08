import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Mutation {
    playlistTrackUserSaveMany(
      paths: [String!]!
      data: [PlaylistTrackUserInput]!
    ): [PlaylistTrackUser]!

    playlistTrackUserUpdateMany(
      where: PlaylistTrackUserInput!
      data: PlaylistTrackUserInput!
    ): [PlaylistTrackUser]!
  }

  ## Inputs

  input PlaylistTrackUserInput {
    id: ID
    createdAt: Float
    updatedAt: Float
    track: DocumentInput
    user: DocumentInput
    removedAt: Float
  }

  ## Types

  type PlaylistTrackUser implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    track: PlaylistTrack!
    user: User!
    removedAt: Float
  }
`
