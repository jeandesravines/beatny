import Playlist from '../models/Playlist'
import PlaylistTrack from '../models/PlaylistTrack'
import Account from '../models/Account'
import Place from '../models/Place'

export default {
  Query: {
    playlistFindOne: (root, { where }) => root(Playlist).findOneBy(where)
  },
  Mutation: {
    playlistUpdateOne: (root, { where, data }) => Playlist.updateOneBy(where, data)
  },
  Playlist: {
    account: root => root(Account).findOneBy({ id: root.account }),
    place: root => root(Place).findOneBy({ id: root.place }),
    tracks: root => root(PlaylistTrack).findManyBy({ playlist: { id: root.id } })
  }
}
