import Service from './Service'

/**
 * PlaylistTrackUserService
 * @extends {Service<PlaylistTrackUser>}
 */
export default class PlaylistTrackUserService extends Service {
  /**
   * Get all the Users linked to the PlaylistTrack
   * @param {PlaylistTrack} playlistTrack
   * @returns {Promise<User[]>}
   */
  findManyUsersByPlaylistTrack({ playlistTrack }) {
    const where = { playlistTrack }
    const filter = {
      select: ['user'],
      populate: ['user']
    }

    return this.findManyBy(where, filter)
  }
}
