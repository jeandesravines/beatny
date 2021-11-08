import AccountToken from '../models/AccountToken'

export default {
  Mutation: {
    accountTokenCreateOne: (root, { data }) => AccountToken.createOne(data),
    accountTokenDeleteOne: (root, { where }) => AccountToken.deleteOneBy(where)
  }
}
