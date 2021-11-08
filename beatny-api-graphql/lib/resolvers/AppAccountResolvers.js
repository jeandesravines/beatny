import AppAccount from '../models/AppAccount'

export default {
  Query: {
    appAccountFindOne: (root, { where }) => root(AppAccount).findOneBy(where)
  },
  Mutation: {
    appAccountUpdateOne: (root, { where, data }) => AppAccount.updateOneBy(where, data)
  }
}
