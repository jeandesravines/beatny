import PlaylistTrack from '../models/PlaylistTrack'
import PlaylistTrackUser from '../models/PlaylistTrackUser'

export default {
  Mutation: {
    playlistTrackSaveMany: (root, { where, data }) => PlaylistTrack.saveManyBy(where, data)
  },
  PlaylistTrack: {
    users: root =>
      root(PlaylistTrackUser).findManyUsersByPlaylistTrack({ playlistTrack: { id: root.id } })
  }
}
