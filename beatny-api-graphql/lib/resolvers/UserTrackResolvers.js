import User from '../models/User'
import UserTrack from '../models/UserTrack'

export default {
  Mutation: {
    userTrackSaveMany: (root, { where, data }) => root(UserTrack).saveManyBy(where, data)
  },
  UserTrack: {
    user: root => root(User).findOneBy({ id: root.user })
  }
}
