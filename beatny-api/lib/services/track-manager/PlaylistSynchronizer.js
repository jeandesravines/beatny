import _ from 'lodash'
import Playlist from '../../models/Playlist'
import Session from '../../models/Session'
import { PlaylistTrackSource } from '../../constants/Track'

import PlaylistTracksManager from './PlaylistTracksManager'
import TrackPopulator from './TrackPopulator'
import * as configuration from '../../configuration'

/**
 *
 */
export default class PlaylistSynchronizer {
  /**
   * Returns tracks to add locally
   * @param {Track[]} locals - the ACCEPTED DB's tracks
   * @param {Object[]} remote - the Spotify's tracks
   * @returns {Promise<Track[]>} - the tracks to add locally
   */
  static async getTracksToAddLocally(locals, remote) {
    const tracks = _.differenceBy(remote, locals, 'uid')
    const populated = await TrackPopulator.populateTracks({ tracks })

    return populated
  }

  /**
   * Returns tracks to add remotely
   * @param {Track[]} locals - the ACCEPTED DB's tracks
   * @param {Object[]} remote - the Spotify's tracks
   * @returns {Track[]} - the tracks to add locally
   */
  static getTracksToAddRemotely(locals, remote) {
    return _.differenceBy(locals, remote, 'uid')
  }

  /**
   * Reset the Playlist
   * @param {Playlist} playlist
   * @returns {Promise<void>}
   */
  static async reset(playlist) {
    const { place } = playlist

    await Session.service.deleteManyByPlace({ place })
  }

  /**
   * Synchronizes Playlist locally and remotely
   * @param {Playlist} playlist
   * @returns {Promise<void>}
   */
  static async synchronize(playlist) {
    const remoteTracks = await PlaylistTracksManager.getTracks(playlist)
    const acceptedTracks = playlist.tracks.map(({ track }) => track)
    const toAddRemotely = this.getTracksToAddRemotely(acceptedTracks, remoteTracks)
    const toAddLocally = await this.getTracksToAddLocally(acceptedTracks, remoteTracks)
    const allTracks = [...acceptedTracks, ...toAddLocally]

    const currentIndex = await PlaylistTracksManager.getCurrentlyPlayingTrackIndex({
      playlist,
      tracks: allTracks
    })

    const nextIndex = currentIndex >= 0 ? currentIndex + configuration.playlist.syncMargin + 1 : 0
    const orderPath = ['users.length', 'prediction.score']
    const orderDirection = ['desc', 'desc']

    const head = allTracks.slice(0, nextIndex)
    const tail = allTracks.slice(nextIndex)
    const tailOrdered = _.orderBy(tail, orderPath, orderDirection)
    const mergedTracks = head.concat(tailOrdered)

    const playlistTracks = mergedTracks.map((track, i) => {
      const isToAddLocally = toAddLocally.some(({ uid }) => track.uid === uid)
      const playlistTrack = isToAddLocally
        ? { source: PlaylistTrackSource.owner }
        : playlist.tracks.find(({ uid }) => track.uid === uid)

      return {
        track,
        source: playlistTrack.source,
        order: i
      }
    })

    await PlaylistTracksManager.addTracks({ playlist, tracks: toAddRemotely })
    await Playlist.service.saveOneById(
      playlist.merge({
        tracks: playlistTracks
      })
    )
  }
}
