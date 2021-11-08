import * as configuration from '../configuration'
import Model from './Model'
import UserService from '../services/entities/UserService'
import UserTrack from './UserTrack'

/**
 * A User
 */
export default class User extends Model {
  /**
   * @const
   * @type {UserService}
   */
  static service = new UserService()

  /**
   * The GraphQL fragment
   * @type {string}
   */
  static graphql = this.setFragment(`
    {
      id
      displayName
      email
      photoUrl
      roles
      tracks @UserTrack
    }
  `)

  /**
   * Schema
   * @type {Object}
   */
  static get schema() {
    return {
      id: String,
      displayName: String,
      email: String,
      photoUrl: String,
      roles: [String],
      tracks: [UserTrack],
      createdAt: Number,
      updatedAt: Number
    }
  }

  /**
   * Returns true if the user has a role which is in the given roles
   * @param {string[]} roles
   * @returns {boolean}
   */
  hasOneOfRoles(roles) {
    return this.roles.some(key => configuration.user.roles[key].some(role => roles.includes(role)))
  }
}
