import UnauthorizedError from '../../errors/common/UnauthorizedError'
import Service from './Service'
import AccountToken from '../../models/AccountToken'

/**
 * @extends {Service<AccountToken>}
 */
export default class AccountTokenService extends Service {
  /**
   * @override
   */
  constructor() {
    super('AccountToken', AccountToken)
  }

  /**
   * Create an AccountToken
   * @param {Object} data
   * @returns {Promise<AccountToken>}
   */
  async createOne(data) {
    const query = `
      mutation($data: AccountTokenInput!) {
        accountTokenCreateOne(data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      data: this.normalize(data)
    })
  }

  /**
   * Delete an AccountToken
   * @private
   * @param {Object} where
   * @returns {Promise<(AccountToken|null)>}
   */
  async deleteOneBy(where) {
    const query = `
      mutation($where: AccountTokenInput!) {
        accountTokenDeleteOne(where: $where) {
          id
        }
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Delete the AccountToken if it exists or fails.
   * @param {string} id
   * @param {string} service
   * @returns {Promise<void>}
   * @throws {UnauthorizedError}
   */
  async consumeAccountToken({ id, service }) {
    const accountToken = await this.deleteOneBy({ id, service })

    if (!accountToken) {
      throw new UnauthorizedError('auth/unknown-account-token')
    }
  }
}
