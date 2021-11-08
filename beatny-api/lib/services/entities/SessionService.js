import Service from './Service'
import Session from '../../models/Session'

/**
 * SessionService
 * @extends {Service<Session>}
 */
export default class SessionService extends Service {
  /**
   * Createa a Service
   * @override
   */
  constructor() {
    super('Session', Session)
  }

  /**
   * Find a Session
   * @private
   * @param {Object} where
   * @returns {Promise<(Session|null)>}
   */
  async findOneBy(where) {
    const query = `
      query($where: SessionInput!) {
        sessionFindOne(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find a Session
   * @param {Object} where
   * @returns {Promise<void>}
   */
  async deleteManyBy(where) {
    const query = `
      mutation($where: SessionInput!) {
        sessionDeleteMany(where: $where) {
          id
        }
      }
    `

    await this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find Sessions
   * @private
   * @param {Object} where
   * @returns {Promise<Session>}
   */
  async findManyBy(where) {
    const query = `
      mutation($where: SessionInput!) {
        sessionFindMany(where: $where) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where)
    })
  }

  /**
   * Find a Session
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<Session>}
   */
  async updateOneBy(where, data) {
    const query = `
      mutation($where: SessionInput!, $data: SessionInput!) {
        sessionUpdateOne(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * Delete the User's Sessions
   * @param {User} user
   * @returns {Promise<void>}
   */
  async deleteManyByUser({ user }) {
    return this.deleteManyBy({
      user
    })
  }

  /**
   * Find a Sessions by its ID
   * @param {string} id
   * @returns {Promise<Session|null>}
   */
  async findOneById({ id }) {
    return this.findOneBy({
      id
    })
  }

  /**
   * Find the User's Sessions
   * @param {User} user
   * @returns {Promise<Session|null>}
   */
  async findOneByUser({ user }) {
    return this.findOneBy({
      user
    })
  }

  /**
   * Update a Session targeted by its User
   * @param {Object} data
   * @param {Place} data.place
   * @param {User} data.user
   * @returns {Promise<Session>}
   */
  async updateOneByUser(data) {
    const query = {
      user: data.user
    }

    return this.updateOneBy(query, data)
  }

  /**
   * Get all pending Session for a Place
   * @param {Place} place
   * @returns {Promise<Sessions[]>}
   */
  async findManyPendingByPlace({ place }) {
    return this.findManyBy({
      place
    })
  }
}
