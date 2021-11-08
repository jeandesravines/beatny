import * as configuration from '../../configuration'
import AppAccount from '../../models/AppAccount'
import Service from './Service'
import Mutex from '../../helpers/mutex/Mutex'

/**
 * @extends {Service<AppAccount>}
 */
export default class AppAccountService extends Service {
  /**
   * @const
   * @type {Object<string, Mutex>}
   */
  mutex = {
    find: new Mutex(configuration.appAccount.ttl / 2),
    update: new Mutex(configuration.appAccount.ttl / 2)
  }

  /**
   * @override
   */
  constructor() {
    super('AppAccount', AppAccount)
  }

  /**
   * Find an AppAccount
   * @private
   * @param {Object} where
   * @returns {Promise<(AppAccount|null)>}
   */
  async findOneBy(where) {
    const query = `
      query($where: AppAccountInput!) {
        appAccountFindOne(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find and update (or create if not exists) an AppAccount
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<AppAccount>}
   */
  async updateOneBy(where, data) {
    const query = `
      mutation($where: AppAccountInput!, $data: AppAccountInput!) {
        appAccountUpdateOne(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * @returns {Promise<(AppAccount|null)>}
   */
  async getCurrent() {
    return this.mutex.find.lock(() => this.findOneBy({ uid: configuration.app.instanceId }))
  }

  /**
   * @param {Object} data
   * @returns {Promise<AppAccount>}
   */
  async updateCurrent(data) {
    const query = { uid: configuration.app.instanceId }
    const accountData = { ...data, ...query }

    return this.mutex.update.lock(() => this.updateOneBy(query, accountData))
  }
}
