import { gql } from 'apollo-server'

export default gql`
  ## Inputs

  input CoordinatesInput {
    lat: Float!
    lng: Float!
  }

  ## Types

  type Coordinates {
    lat: Float!
    lng: Float!
  }
`
