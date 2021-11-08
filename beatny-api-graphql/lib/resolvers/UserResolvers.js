import User from '../models/User'
import UserTrack from '../models/UserTrack'

export default {
  Query: {
    userFindMany: (root, { where }) => root(User).findManyBy(where),
    userFindOne: (root, { where }) => root(User).findOneBy(where)
  },
  Mutation: {
    userUpdateOne: (root, { where, data }) => User.updateOneBy(where, data)
  },
  User: {
    tracks: root => root(UserTrack).findManyBy({ user: { id: root.id } })
  }
}
