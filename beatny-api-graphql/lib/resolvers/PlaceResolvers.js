import Beacon from '../models/Beacon'
import PlaceUser from '../models/PlaceUser'
import Playlist from '../models/Playlist'

export default {
  Place: {
    beacons: root => root(Beacon).findManyBy({ place: { id: root.id } }),
    playlist: root => root.playlist && root(Playlist).findOneBy({ id: root.playlist }),
    playlists: root => root(Playlist).findManyBy({ place: { id: root.id } }),
    users: root => root(PlaceUser).findManyBy({ place: { id: root.id } })
  }
}
