import _ from 'lodash'
import ClusterPredictionService from '../prediction/ClusterPredictionService'
import PlaylistTracksManager from './PlaylistTracksManager'

/**
 * Service used to predict the Track's status using the machine learning prediction's data
 */
export default class TrackFilter {
  /**
   * Retrieves tracks which has obtain a sufficient prediction score
   * @private
   * @param {{
   *   prediction: { score: number },
   *   track: Track
   * }[]} predictions
   * @param {Playlist} playlist
   * @returns {Track[]}
   */
  static getTracksFromPredictions({ predictions, playlist }) {
    const { settings } = playlist
    const { minScore } = settings

    return predictions
      .filter(({ prediction }) => prediction.score >= minScore)
      .map(({ prediction, track }) => track.merge({ prediction }))
  }

  /**
   * Returns the next Tracks of the Playlist.
   * This function get the next Tracks according to the configuration defined margin.
   * @private
   * @param {Playlist} playlist
   * @returns {Track[]}
   */
  static async getNextTracks({ playlist }) {
    const nextTracks = await PlaylistTracksManager.getNextPlaylistTracks({
      playlist,
      withMargin: true
    })

    return nextTracks.map(({ track }) => track)
  }

  /**
   * Returns a subset of given Tracks for which the prediction allows them to
   * be inserted to the Playlist
   * @param {Playlist} playlist
   * @returns {Promise<Track[]>}
   */
  static async filter({ playlist, tracks }) {
    if (playlist.tracks.length === 0) {
      throw new Error('playlist/no-treated-tracks')
    }

    const playlistTracks = await this.getNextTracks({ playlist })
    const playlistTracksMap = _.keyBy(playlistTracks, 'uid')
    const { features, genres } = playlist

    const done = playlistTracks
    const pending = tracks
      .filter(({ uid }) => !playlistTracksMap[uid])
      .filter(track => track.hasRequiredCriteria({ features, genres }))

    const predictions = await ClusterPredictionService.predictStatus({ done, pending })
    const filteredTracks = this.getTracksFromPredictions({ predictions, playlist })

    return filteredTracks
  }
}
