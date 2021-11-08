import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Query {
    statusGet: Status!
  }

  ## Types

  type Status {
    date: String!
    env: String!
    ok: Boolean!
  }
`
