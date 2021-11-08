import Account from '../../models/Account'
import Service from './Service'

/**
 * @extends {Service<Account>}
 */
export default class AccountService extends Service {
  /**
   * @override
   */
  constructor() {
    super('Account', Account)
  }

  /**
   * Find an Account
   * @private
   * @param {Object} where
   * @returns {Promise<(Account|null)>}
   */
  async findOneBy(where) {
    const query = `
      query($where: AccountInput!) {
        accountFindOne(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find Accounts
   * @private
   * @param {Object} where
   * @returns {Promise<Account[]>}
   */
  async findManyBy(where) {
    const query = `
      query($where: AccountInput!) {
        accountFindMany(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find and update (or create if not exists) an Account
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<Account>}
   */
  async updateOneBy(where, data) {
    const query = `
      mutation($where: AccountInput!, $data: AccountInput!) {
        accountUpdateOne(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * Create an Account
   * @param {Object} data
   * @returns {Promise<Account>}
   */
  async createOne(data) {
    const query = `
      mutation($data: AccountInput!) {
        accountCreateOne(data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      data: this.normalize(data)
    })
  }

  /**
   * Find an Account by its ID
   * @param {string} id
   * @returns {Promise<(Account|null)>}
   */
  async findOneById({ id }) {
    return this.findOneBy({ id })
  }

  /**
   * Find an Account by its UID (Streaming User's ID) and Service (eg: "spotify")
   * @param {string} service
   * @param {string} uid
   * @returns {Promise<(Account|null)>}
   */
  async findOneByServiceAndUid({ service, uid }) {
    return this.findOneBy({
      service,
      uid
    })
  }

  /**
   * Find Accounts owned by the given User
   * @param {User} user
   * @returns {Promise<Account[]>}
   */
  async findManyByUser({ user }) {
    return this.findManyBy({
      user
    })
  }

  /**
   * Update the Account corresponding to the service and User
   * @param {Account} account
   * @returns {Promise<Account>}
   */
  async updateByUserAndService(account) {
    const query = {
      service: account.service,
      user: account.user
    }

    return this.updateOneBy(query, account)
  }
}
