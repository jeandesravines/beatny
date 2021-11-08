import PlaylistSynchronizer from '../services/track-manager/PlaylistSynchronizer'
import PlaylistTracksManager from '../services/track-manager/PlaylistTracksManager'
import TrackFilter from '../services/track-manager/TrackFilter'
import Controller from './Controller'

/**
 *
 */
export default class PlaylistController extends Controller {
  /**
   * Fill-up a Playlist with recommended Tracks
   * @param {Object} locals
   * @param {Playlist} locals.playlist
   * @returns {Promise<void>}
   */
  static async fillUp({ locals }) {
    await PlaylistTracksManager.fillUp(locals.playlist)
  }

  /**
   * Predict the status of all pending Tracks
   * @param {Object} locals
   * @param {Playlist} locals.playlist
   * @returns {Promise<Track[]>}
   */
  static async predict({ locals }) {
    return TrackFilter.predict(locals.playlist)
  }

  /**
   * Reset the Playlist. Delete Track and Sessions
   * @param {Object} locals
   * @param {Playlist} locals.playlist
   * @returns {Promise<void>}
   */
  static async reset({ locals }) {
    return PlaylistSynchronizer.reset(locals.playlist)
  }

  /**
   * Synchronize the Playlist between Spotify and the DB
   * @param {Object} locals
   * @param {Playlist} locals.playlist
   * @returns {Promise<Object>}
   */
  static async synchronize({ locals }) {
    return PlaylistSynchronizer.synchronize(locals.playlist)
  }
}
