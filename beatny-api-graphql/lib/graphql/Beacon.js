import { gql } from 'apollo-server'

export default gql`
  ## Roots

  extend type Query {
    beaconFindOne(where: BeaconInput!, filter: BeaconFilterInput): Beacon
  }

  ## Inputs

  input BeaconInput {
    uuid: String!
    minor: Int!
    major: Int!
    location: CoordinatesInput
    place: DocumentInput
  }

  input BeaconFilterInput {
    near: BeaconFilterNearInput
  }

  input BeaconFilterNearInput {
    path: String!
    center: [Float]!
    maxDistance: Float!
  }

  ## Types

  type Beacon implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    location: Coordinates!
    major: Int!
    minor: Int!
    uuid: String!
    place: Place!
  }
`
