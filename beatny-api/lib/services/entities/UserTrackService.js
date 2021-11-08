import Service from './Service'
import UserTrack from '../../models/UserTrack'

/**
 * @extends {Service<UserTrack>}
 */
export default class UserTrackService extends Service {
  /**
   * Create a Service
   * @override
   */
  constructor() {
    super('UserTrack', UserTrack)
  }

  /**
   * Update (or create) UserTracks
   * @private
   * @param {Array<string>} paths
   * @param {Object} data
   * @returns {Promise<User>}
   */
  async saveManyBy(paths, data) {
    const query = `
      mutation($where: [String!]!, $data: [UserTrackInput]!) {
        userTrackSaveMany(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: paths,
      data: this.normalize(data)
    })
  }

  /**
   * Update (or create) UserTracks
   * @param {UserTrack[]} tracks
   * @returns {Promise<UserTrack[]>}
   */
  async saveManyByUID(tracks) {
    const paths = ['user.id', 'track.uid']

    return this.saveManyBy(paths, tracks)
  }
}
