import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Query {
    appAccountFindOne(where: AppAccountInput!): AppAccount
  }

  extend type Mutation {
    appAccountUpdateOne(where: AppAccountInput!, data: AppAccountInput!): AppAccount!
  }

  ## Inputs

  input AppAccountInput {
    id: ID
    uid: String
    accessToken: String
    expiresAt: Float
  }

  ## Types

  type AppAccount implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    uid: String!
    accessToken: String!
    expiresAt: Float!
  }
`
