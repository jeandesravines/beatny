import { gql } from 'apollo-server'

export default gql`
  ## Types

  type Client implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    key: String!
    secret: String!
  }
`
