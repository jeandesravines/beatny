import Service from './Service'
import Client from '../../models/Client'

/**
 * @extends {Service<Client>}
 */
export default class ClientService extends Service {
  /**
   * @override
   */
  constructor() {
    super('Client', Client)
  }

  /**
   * Find a Client
   * @private
   * @param {Object} where
   * @returns {Promise<(Client|null)>}
   */
  async findOneBy(where) {
    const query = `
      query($where: ClientInput!) {
        clientFindOne(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }
}
