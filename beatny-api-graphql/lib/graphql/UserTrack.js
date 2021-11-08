import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Mutation {
    userTrackSaveMany(where: [String!]!, data: [UserTrackInput]!): [UserTrack]!
  }

  ## Inputs

  input UserTrackInput {
    id: ID
    user: DocumentInput
    track: TrackInput
  }

  ## Types

  type UserTrack implements Document {
    id: ID!
    user: User!
    track: Track!
    createdAt: Float!
    updatedAt: Float!
  }
`
