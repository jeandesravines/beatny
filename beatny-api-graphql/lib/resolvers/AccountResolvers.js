import User from '../models/User'
import Account from '../models/Account'

export default {
  Query: {
    accountFindMany: (root, { where }) => root(Account).findManyBy(where),
    accountFindOne: (root, { where }) => root(Account).findOneBy(where)
  },
  Mutation: {
    accountCreateOne: (root, { data }) => Account.createOne(data),
    accountUpdateOne: (root, { where, data }) => Account.updateOneBy(where, data)
  },
  Account: {
    user: root => root(User).findOneBy({ id: root.user })
  }
}
