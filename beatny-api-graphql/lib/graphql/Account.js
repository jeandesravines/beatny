import { gql } from 'apollo-server'
import { AccountServices } from '../constants/Account'

export default gql`
  ## Roots

  extend type Query {
    accountFindOne(where: AccountInput!): Account
    accountFindMany(where: AccountInput!): [Account]!
  }

  extend type Mutation {
    accountCreateOne(data: AccountInput!): Account!
    accountUpdateOne(where: AccountInput!, data: AccountInput!): Account!
  }

  ## Enums

  enum AccountService {
    ${Object.values(AccountServices).join(' ')}
  }

  ## Inputs

  input AccountInput {
    id: ID
    service: AccountService
    uid: String
    user: DocumentInput
    accessToken: String
    refreshToken: String
    expiresAt: Float
  }

  ## Types

  type Account implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    service: AccountService!
    uid: String!
    user: User!
    accessToken: String!
    refreshToken: String
    expiresAt: Float
  }
`
