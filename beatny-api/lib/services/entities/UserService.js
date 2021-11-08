import Service from './Service'
import User from '../../models/User'

/**
 * @extends {Service<User>}
 */
export default class UserService extends Service {
  /**
   * Create a Service
   * @override
   */
  constructor() {
    super('User', User)
  }

  /**
   * Find a User
   * @private
   * @param {Object} where
   * @returns {Promise<(User|null)>}
   */
  async findOneBy(where) {
    const query = `
      query($where: UserInput!) {
        userFindOne(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find and update (or create if not exists) an User
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateOneBy(where, data) {
    const query = `
      mutation($where: UserInput!, $data: UserInput!) {
        userUpdateOne(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * Save a Model by ID
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async saveOneById(data) {
    return this.updateOneBy({ id: data.id }, data)
  }

  /**
   * Find an User by its ID
   * @param {string} id
   * @returns {Promise<(User|null)>}
   */
  async findOneById({ id }) {
    return this.findOneBy({ id })
  }

  /**
   * Update a User (or create it) by its ID
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateOneById({ id }, data) {
    return this.updateOneBy({ id }, data)
  }

  /**
   * Update a User (or create it) by its email
   * @param {string} email
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async updateOneByEmail({ email }, data) {
    return this.updateOneBy({ email }, data)
  }
}
