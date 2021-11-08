import { gql } from 'apollo-server'
import { SessionStatuses } from '../constants/Session'

export default gql`
  ## Roots

  extend type Query {
    sessionFindOne(where: SessionInput!): Session
    sessionFindMany(where: SessionInput!): Session
  }

  extend type Mutation {
    sessionDeleteMany(where: SessionInput!): [Session]!
    sessionUpdateOne(where: SessionInput!, data: SessionInput!): Session!
  }

  ## Enums

  enum SessionStatus {
    ${Object.values(SessionStatuses).join(' ')}
  }

  ## Inputs

  input SessionInput {
    id: ID
    user: DocumentInput
    place: DocumentInput
    status: SessionStatus
  }

  ## Types

  type Session implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    user: User!
    place: Place!
    status: SessionStatus!
  }
`
