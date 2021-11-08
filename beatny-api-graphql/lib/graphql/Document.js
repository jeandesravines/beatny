import { gql } from 'apollo-server'

export default gql`
  ## Inputs

  input DocumentInput {
    id: ID!
  }

  ## Types

  interface Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
  }
`
