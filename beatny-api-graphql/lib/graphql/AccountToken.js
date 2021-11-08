import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Mutation {
    accountTokenCreateOne(data: AccountTokenInput!): AccountToken!
    accountTokenDeleteOne(where: AccountTokenInput!): AccountToken
  }

  ## Inputs

  input AccountTokenInput {
    id: ID
    service: AccountService
  }

  ## Types

  type AccountToken implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    service: AccountService!
  }
`
