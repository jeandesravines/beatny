import User from '../models/User'
import Session from '../models/Session'
import Place from '../models/Place'

export default {
  Query: {
    sessionFindOne: (root, { where }) => root(Session).findOneBy(where),
    sessionFindMany: (root, { where }) => root(Session).findManyBy(where)
  },
  Mutation: {
    sessionDeleteMany: (root, { where }) => Session.deleteManyBy(where),
    sessionUpdateOne: (root, { where, data }) => Session.updateOneBy(where, data)
  },
  Session: {
    place: root => root(Place).findOneBy({ id: root.place }),
    user: root => root(User).findOneBy({ id: root.user })
  }
}
