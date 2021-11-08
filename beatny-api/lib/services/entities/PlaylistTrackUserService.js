import Service from './Service'
import PlaylistTrackUser from '../../models/PlaylistTrackUser'

/**
 * @extends {Service<PlaylistTrackUser>}
 */
export default class PlaylistTrackUserService extends Service {
  /**
   * Create a Service
   * @override
   */
  constructor() {
    super('PlaylistTrackUser', PlaylistTrackUser)
  }

  /**
   * Update (or create) PlaylistTrackUsers
   * @private
   * @param {Array<string>} paths
   * @param {Object} data
   * @returns {Promise<PlaylistTrackUser[]>}
   */
  async saveManyBy(paths, data) {
    const query = `
      mutation($paths: [String!]!, $data: [PlaylistTrackUserInput]!) {
        playlistTrackUserSaveMany(paths: $paths, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      paths,
      data: this.normalize(data)
    })
  }

  /**
   * Update many PlaylistTrackUser
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<PlaylistUserTrack[]>}
   */
  async updateManyBy(where, data) {
    const query = `
      mutation($where: PlaylistTrackUserInput!, $data: PlaylistTrackUserInput!) {
        playlistTrackUserUpdateMany(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * Delete many PlaylistTrackUser
   * @param {Playlist} playlist
   * @param {User} user
   * @returns {Promise<PlaylistTrackUser[]>}
   */
  async deleteManyByPlaylistAndUser({ playlist, user }) {
    const query = { playlist, user }
    const data = { removedAt: Date.now() }

    return this.updateManyBy(query, data)
  }

  /**
   * Update (or create) PlaylistTrackUsers
   * @param {PlaylistTrack[]} tracks
   * @param {User} user
   * @returns {Promise<PlaylistTrackUser[]>}
   */
  async saveManyByUser({ user, tracks }) {
    const paths = ['track.id', 'user.id']
    const data = tracks.map(track => ({ track, user }))

    return this.saveManyBy(paths, data)
  }
}
