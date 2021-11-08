import _ from 'lodash'
import Account from '../../models/Account'
import UserTrack from '../../models/UserTrack'
import MusicServiceFactory from '../streaming/factory/MusicServiceFactory'
import TrackPopulator from './TrackPopulator'
import { PlaylistTrackSource } from '../../constants/Track'
import PlaylistTrack from '../../models/PlaylistTrack'
import PlaylistTrackUser from '../../models/PlaylistTrackUser'
import TrackFilter from './TrackFilter'
import * as configuration from '../../configuration'

/**
 * Manages user's tracks to get its top tracks from a music service
 * and save them into the database
 */
export default class UserTracksManager {
  /**
   * Gets the user's top tracks
   * @private
   * @param {Account} account
   * @returns {Promise<Track[]>}
   */
  static async getTracksByAccount({ account }) {
    const service = MusicServiceFactory.getServiceByAccount(account)
    const accessToken = await service.getAccessTokenByAccount(account)
    const tracks = await service.getUserTopTracks({ accessToken })

    return TrackPopulator.populateTracks({
      tracks
    })
  }

  /**
   * Saves all the User Account's Tracks to the User.
   * Aggregates the User streaming services' Tracks distinct by UID
   * @param {User} user
   * @returns {Promise<void>}
   */
  static async saveTracksToUser({ user }) {
    const { topTrackCount } = configuration.track
    const accounts = await Account.service.findManyByUser({ user })
    const deferred = accounts.map(account => this.getTracksByAccount({ account }))
    const tracksByAccount = await Promise.all(deferred)

    const tracks = _.chain(tracksByAccount)
      .flatten()
      .uniqBy('uid')
      .orderBy(['features.popularity'], ['desc'])
      .slice(0, topTrackCount)
      .map(track => ({ user, track }))
      .value()

    await UserTrack.service.saveManyByUID(tracks)
  }

  /**
   * Save accepted User's Tracks to the Playlist
   * @param {Playlist} playlist
   * @param {User} user
   * @returns {Promise<void>}
   */
  static async saveUserTracksToPlaylist({ playlist, user }) {
    const playlistTracks = playlist.tracks
    const userTracks = user.tracks.map(({ track }) => track)
    const offset = playlistTracks.length

    const acceptedTracks = await TrackFilter.filter({ playlist, tracks: userTracks })
    const acceptedPlaylistTracks = acceptedTracks.map((track, i) => ({
      playlist,
      track,
      order: i + offset,
      source: PlaylistTrackSource.user
    }))

    const newPlaylistTracks = await PlaylistTrack.service.saveManyByUID({
      tracks: acceptedPlaylistTracks
    })

    const newPlaylistTracksMap = _.chain(playlistTracks)
      .concat(newPlaylistTracks)
      .keyBy('track.uid')
      .value()

    const playlistTrackUsersToAdd = userTracks
      .map(({ uid }) => newPlaylistTracksMap[uid])
      .filter(track => track)
      .sort((a, b) => a.order - b.order)
      .map(track => ({
        track,
        user
      }))

    await PlaylistTrackUser.service.saveManyByUser({ tracks: playlistTrackUsersToAdd })
  }

  /**
   * Mark User's as deleted from the PlaylistTrack
   * @param {Playlist} playlist
   * @param {User} user
   * @returns {Promise<void>}
   */
  static async deleteUserTracksFromPlaylist({ playlist, user }) {
    await PlaylistTrackUser.service.deleteManyByPlaylistAndUser({ playlist, user })
  }
}
