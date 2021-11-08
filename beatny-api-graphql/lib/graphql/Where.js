import { gql } from 'apollo-server'

export default gql`
  ## Inputs

  input WhereIDInput {
    _eq: ID
    _in: [ID!]
  }

  input WhereBooleanInput {
    _eq: Boolean
  }

  input WhereNumberInput {
    _eq: Float
    _gt: Float
    _gte: Float
    _in: [Float!]
    _lt: Float
    _lte: Float
  }

  input WhereStringInput {
    _eq: String
    _in: [String!]
  }
`
