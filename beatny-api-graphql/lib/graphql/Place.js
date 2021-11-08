import { gql } from 'apollo-server'
import { PlaceUserAccesses } from '../constants/Place'

export default gql`
  ## Enums

  enum PlaceUserAccess {
    ${Object.values(PlaceUserAccesses).join(' ')}
  }

  ## Types

  type Place {
    id: ID!
    name: String!
    address: String!
    location: Coordinates!
    users: [PlaceUser!]!
    beacons: [Beacon]!
    playlist: Playlist
    playlists: [Playlist]!
  }

  type PlaceUser implements Document {
    id: ID!
    createdAt: Float!
    updatedAt: Float!
    user: User!
    access: PlaceUserAccess!
  }
`
