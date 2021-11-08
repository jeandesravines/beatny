import User from '../models/User'

export default {
  PlaceUser: {
    user: root => root(User).findOneBy({ id: root.user })
  }
}
