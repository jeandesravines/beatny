import _ from 'lodash'
import * as configuration from '../../configuration'
import Playlist from '../../models/Playlist'
import Track from '../../models/Track'
import { PlaylistTrackSource } from '../../constants/Track'
import SpotifyAuthService from '../streaming/spotify/SpotifyAuthService'
import SpotifyService from '../streaming/spotify/SpotifyService'
import TrackPopulator from './TrackPopulator'
import PlaylistTrack from '../../models/PlaylistTrack'

/**
 * Manage Spotify's playlist's tracks for places
 */
export default class PlaylistTracksManager {
  /**
   * Add Tracks to the Spotify's Playlist
   * @param {Object} params
   * @param {Playlist} params.playlist
   * @param {Track[]} params.tracks
   * @returns {Promise<void>}
   */
  static async addTracks({ playlist, tracks }) {
    const accessToken = await this.getAccessTokenByPlaylist(playlist)
    const chunks = []

    tracks
      .sort((a, b) => a.order - b.order)
      .forEach((track, i) => {
        if (i === 0 || tracks[i - 1].order < track.order - 1) {
          chunks[chunks.length] = [track]
        } else {
          chunks[chunks.length - 1].push(track)
        }
      })

    await Promise.all(
      chunks.map(async chunk => {
        await SpotifyService.addTracksToPlaylist({
          accessToken,
          playlistId: playlist.uid,
          ids: chunk.map(({ uid }) => uid),
          position: chunk[0].order
        })
      })
    )
  }

  /**
   * Create the map used as a query for a Spotify's search
   * @param {Object<{ min: ?number, max: ?number }>} features
   * @returns {Object<number>}
   */
  static getSpotifySearchQuery(features) {
    return _.transform(
      features,
      (acc, criterion, key) => {
        const ratio = key === 'popularity' ? 100 : 1

        acc[`min_${key}`] = (criterion.min || 0) * ratio
        acc[`max_${key}`] = (criterion.max || 1) * ratio
      },
      {}
    )
  }

  /**
   * Add recommended tracks to the playlist
   * @param {Playlist} playlist
   * @returns {Promise<void>}
   */
  static async fillUp(playlist) {
    const { playingThresholdRemaining } = configuration.playlist
    const tracks = playlist.getAllAcceptedTracks()
    const index = await PlaylistTracksManager.getCurrentlyPlayingTrackIndex({
      playlist,
      tracks
    })

    if (index < 0 || tracks.length - index > playingThresholdRemaining) {
      return
    }

    const ids = _.sortBy(tracks, 'users.length')
      .slice(-5)
      .map(track => track.uid)

    const query = this.getSpotifySearchQuery(playlist.features)
    const newTracks = await SpotifyService.getRecommendations({ ids, query })
    const populatedTracks = await TrackPopulator.populateTracks({ tracks: newTracks })
    const savedTracks = await Track.service.saveManyByUID(populatedTracks)

    const playlistTracks = _.mapKeys(playlist.tracks, 'id')
    const populatedPlaylistTracks = savedTracks
      .filter(track => !playlistTracks[track.id])
      .map((track, i) => ({
        track,
        order: i + tracks.length,
        source: PlaylistTrackSource.recommendation
      }))

    await this.addTracks({
      playlist,
      tracks: populatedTracks
    })

    await PlaylistTrack.service.saveManyByUID(populatedPlaylistTracks)
    await Playlist.service.saveOneById(
      playlist.merge({
        filledUpAt: Date.now()
      })
    )
  }

  /**
   * Returns the Playlist Account's access token
   * @private
   * @param {Playlist} playlist
   * @returns {Promise<string>}
   */
  static async getAccessTokenByPlaylist(playlist) {
    return SpotifyAuthService.getAccessTokenByAccount(playlist.account)
  }

  /**
   * Returns the currently playing Track index in the given Playlist.service.
   * Returns -1 if no tracks is playing or if the playing Track is not in the Playlist
   * @param {Playlist} playlist
   * @param {{ uid: string }[]} tracks
   * @returns {Promise<number>}
   */
  static async getCurrentlyPlayingTrackIndex({ playlist, tracks }) {
    const accessToken = await this.getAccessTokenByPlaylist(playlist)
    const track = await SpotifyService.getUserCurrentlyPlayingTrack({
      accessToken,
      playlistId: playlist.uid
    })

    return track ? tracks.findIndex(({ uid }) => track.uid === uid) : -1
  }

  /**
   * Returns the next Tracks according to the current playling track index.
   * Thme param `withMargin` allows to shift the x next tracks depending on the
   * configuration parameter `playlist.syncMargin`
   * @param {Playlist} playlist
   * @param {boolean} [withMargin = false]
   * @returns {PlaylistTrack[]}
   */
  static async getNextPlaylistTracks({ playlist, withMargin = false }) {
    const playlistTracks = playlist.tracks.sort((a, b) => a.order - b.order)
    const tracks = playlistTracks.map(({ track }) => track)
    const margin = withMargin ? configuration.playlist.syncMargin : 0
    const index = await PlaylistTracksManager.getCurrentlyPlayingTrackIndex({ playlist, tracks })
    const nextIndex = index + 1 + margin
    const nextTracks = playlistTracks.slice(nextIndex)

    return nextTracks
  }

  /**
   * Get Spotify playlist's tracks
   * @param {Playlist} playlist
   * @returns {Promise<Object[]>}
   */
  static async getTracks(playlist) {
    const accessToken = await this.getAccessTokenByPlaylist(playlist)

    return SpotifyService.getPlaylistTracks({
      accessToken,
      playlistId: playlist.uid
    })
  }
}
