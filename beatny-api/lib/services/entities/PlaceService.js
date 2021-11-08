import Service from './Service'
import Place from '../../models/Place'

/**
 * @extends {Service<Place>}
 */
export default class PlaceService extends Service {
  /**
   * @override
   */
  constructor() {
    super('Place', Place)
  }
}
