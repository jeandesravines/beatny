import PlaylistTrack from '../models/PlaylistTrack'
import PlaylistTrackUser from '../models/PlaylistTrackUser'
import User from '../models/User'

export default {
  Mutation: {
    playlistTrackUserSaveMany: (root, { paths, data }) => PlaylistTrackUser.saveManyBy(paths, data),
    playlistTrackUserUpdateMany: (root, { where, data }) =>
      PlaylistTrackUser.updateManyBy(where, data)
  },
  PlaylistTrackUser: {
    track: root => root(PlaylistTrack).findOneBy({ id: root.track }),
    user: root => root(User).findOneBy({ id: root.user })
  }
}
