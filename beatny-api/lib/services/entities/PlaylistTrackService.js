import Service from './Service'
import PlaylistTrack from '../../models/PlaylistTrack'

/**
 * @extends {Service<PlaylistTrack>}
 */
export default class PlaylistService extends Service {
  /**
   * Create a Service
   * @override
   */
  constructor() {
    super('PlaylistTrack', PlaylistTrack)
  }

  /**
   * Update (or create) PlaylistTracks
   * @private
   * @param {Array<string>} paths
   * @param {Object} data
   * @returns {Promise<PlaylistTrack[]>}
   */
  async saveMany(paths, data) {
    const query = `
      mutation($where: [String!]!, $data: [PlaylistTrackInput]!) {
        userTrackSaveMany(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: paths,
      data: this.normalize(data)
    })
  }

  /**
   * Update (or create) PlaylistTracks
   * @param {PlaylistTrack[]} tracks
   * @returns {Promise<PlaylistTrack[]>}
   */
  async saveManyByUID(tracks) {
    const paths = ['playlist.id', 'track.uid']

    return this.saveMany(paths, tracks)
  }
}
