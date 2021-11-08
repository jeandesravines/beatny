import Beacon from '../models/Beacon'
import Place from '../models/Place'

export default {
  Query: {
    beaconFindOne: (root, { where, filter }) => root(Beacon).findOneBy(where, filter)
  },
  Beacon: {
    place: root => root(Place).findOneBy({ id: root.place })
  }
}
