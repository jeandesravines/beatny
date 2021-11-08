import Service from './Service'
import Playlist from '../../models/Playlist'

/**
 * @extends {Service<Playlist>}
 */
export default class PlaylistService extends Service {
  /**
   * @override
   */
  constructor() {
    super('Playlist', Playlist)
  }

  /**
   * Find and update (or create if not exists) a Playlist
   * @private
   * @param {Object} where
   * @param {Object} data
   * @returns {Promise<Playlist>}
   */
  async updateOneBy(where, data) {
    const query = `
      mutation($where: PlaylistInput!, $data: PlaylistInput!) {
        playlistUpdateOne(where: $where, data: $data) ${this.model.fragment}
      }
    `

    return this.query(query, {
      where: this.normalize(where),
      data: this.normalize(data)
    })
  }

  /**
   * Save a Playlist by ID
   * @param {Object} data
   * @returns {Promise<Playlist>}
   */
  async saveOneById(data) {
    return this.updateOneBy({ id: data.id }, data)
  }
}
