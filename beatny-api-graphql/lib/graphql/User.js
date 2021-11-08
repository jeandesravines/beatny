import { gql } from 'apollo-server'
import { UserRoles } from '../constants/User'

export default gql`
  ## Roots

  extend type Query {
    userFindOne(where: UserInput!): User
    userFindMany(where: UserInput!): [User]!
  }

  extend type Mutation {
    userUpdateOne(where: UserInput!, data: UserInput!): User!
  }

  ## Enums

  enum UserRole {
    ${Object.values(UserRoles).join(' ')}
  }

  ## Inputs

  input UserInput {
    id: ID
    email: String
    displayName: String
    photoUrl: String
    roles: [UserRole!]
  }

  ## Types

  type User implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    email: String!
    displayName: String
    photoUrl: String
    roles: [UserRole!]!
    tracks: [UserTrack]!
  }
`
