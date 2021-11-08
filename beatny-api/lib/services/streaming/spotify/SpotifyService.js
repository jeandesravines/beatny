import axios from 'axios'
import _ from 'lodash'
import * as configuration from '../../../configuration'
import SpotifyError from '../../../errors/spotify/SpotifyError'
import SpotifyAuthService from './SpotifyAuthService'
import Logger from '../../logger/Logger'

/**
 *
 */
export default class SpotifyService {
  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.playlistId
   * @param {string[]} params.ids
   * @param {number} params.position
   * @returns {Promise<void>}
   */
  static async addTracksToPlaylist({ accessToken, playlistId, ids, position }) {
    const { addTrackChunkLength: length } = configuration.spotify.request
    const chunked = _.chunk(ids, length).map(chunk => ({
      accessToken,
      method: 'post',
      path: `playlists/${playlistId}/tracks`,
      data: {
        position,
        uris: chunk.map(id => `spotify:track:${id}`)
      }
    }))

    await this.requests(chunked)
  }

  /**
   * @param {Object} params
   * @param {string[]} params.ids
   * @returns {Object[]}
   */
  static async getAlbums({ ids }) {
    const accessToken = await SpotifyAuthService.getAppAccessToken()

    return this.getSeveralItems({
      accessToken,
      ids,
      path: 'albums',
      key: 'albums'
    })
  }

  /**
   * @param {Object} params
   * @param {string[]} params.ids
   * @returns {Object[]}
   */
  static async getArtists({ ids }) {
    const accessToken = await SpotifyAuthService.getAppAccessToken()

    return this.getSeveralItems({
      accessToken,
      ids,
      path: 'artists',
      key: 'artists'
    })
  }

  /**
   * @param {Object} params
   * @param {string[]} params.ids
   * @returns {Promise<Object[]>}
   */
  static async getAudioFeatures({ ids }) {
    const accessToken = await SpotifyAuthService.getAppAccessToken()

    return this.getSeveralItems({
      accessToken,
      ids,
      path: 'audio-features',
      key: 'audio_features'
    })
  }

  /**
   * @returns {Promise<string[]>}
   */
  static async getGenres() {
    const accessToken = await SpotifyAuthService.getAppAccessToken()
    const data = await this.request({
      accessToken,
      path: 'recommendations/available-genre-seeds'
    })

    return data.genres
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.playlistId
   * @returns {Object[]}
   */
  static async getPlaylistTracks({ accessToken, playlistId }) {
    const items = await this.paginatedRequest({
      accessToken,
      key: 'items',
      path: `playlists/${playlistId}/tracks`,
      query: {
        fields: 'items(track)'
      }
    })

    return items.map(({ track }) => this.toMusicServiceTrack(track))
  }

  /**
   * @param {Object} params
   * @param {string[]} params.ids
   * @param {Object<number>} params.query
   * @param {number} [params.limit]
   * @returns {Promise<Object[]>}
   */
  static async getRecommendations({ ids, query, limit }) {
    const { recommendationCount } = configuration.spotify.service
    const accessToken = await SpotifyAuthService.getAppAccessToken()
    const data = await this.request({
      accessToken,
      ids,
      path: 'recommendations',
      query: {
        ...query,
        limit: limit || recommendationCount,
        seed_tracks: ids.join(',')
      }
    })

    return data.tracks.map(track => this.toMusicServiceTrack(track))
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string[]} params.ids
   * @param {string} params.path
   * @param {string} params.key
   * @returns {Promise<Object[]>}
   */
  static async getSeveralItems({ accessToken, path, ids, key }) {
    const { defaultChunkLength: length } = configuration.spotify.request
    const chunked = _.chunk(ids, length).map(chunk => ({
      accessToken,
      path,
      query: {
        ids: chunk.join(',')
      }
    }))

    return this.requests(chunked, key)
  }

  /**
   * @param {string} path
   * @returns {string}
   */
  static getUrl(path) {
    return `${configuration.spotify.uris.api}/${path}`
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @returns {Promise<Object>}
   */
  static async getUserCurrentlyPlayingTrack({ accessToken, playlistId }) {
    const response = await this.request({
      accessToken,
      path: 'me/player/currently-playing'
    })

    const item = response?.item
    const context = response?.context
    const playlistUriSuffix = `spotify:playlist:${playlistId}`

    if (!item || !context?.uri.includes(playlistUriSuffix)) {
      return null
    }

    return this.toMusicServiceTrack(item)
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @returns {Object}
   */
  static async getUserProfile({ accessToken }) {
    const response = await this.request({
      accessToken,
      path: 'me'
    })

    return {
      email: response.email,
      displayName: response.display_name,
      photoUrl: response.images?.[0]?.url,
      uid: response.id
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @returns {Object[]}
   */
  static async getUserTopTracks({ accessToken }) {
    const { topTrackCount } = configuration.spotify.service
    const response = await this.request({
      accessToken,
      path: 'me/top/tracks',
      query: {
        limit: topTrackCount
      }
    })

    return response.items.map(track => this.toMusicServiceTrack(track))
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {Object} [params.query]
   * @param {string} params.path
   * @param {string} params.key
   * @returns {Promise<Object[]>}
   */
  static async paginatedRequest({ accessToken, path, query = {}, key }) {
    const response = await this.request({
      accessToken,
      query,
      path
    })

    const { limit, total } = response
    const count = Math.ceil(total / limit - 1)
    const paramsList = _.times(count, i => ({
      accessToken,
      path,
      query: { ...query, limit, offset: (i + 1) * limit }
    }))

    const items = await this.requests(paramsList, key)

    return response[key].concat(items)
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.path
   * @param {Object} [params.data]
   * @param {Object} [params.query]
   * @param {string} [params.method = 'get']
   * @returns {Promise<*>}
   */
  static async request(params) {
    const { accessToken, data, path, query, method = 'get' } = params
    const options = {
      data,
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      params: query,
      url: this.getUrl(path)
    }

    Logger.info({
      msg: 'spotify/request',
      query,
      method,
      path
    })

    const response = await axios.request(options).catch(error => {
      throw new SpotifyError(error.message, {
        path,
        method
      })
    })

    return response.data
  }

  /**
   * @param {Object[]} paramsList
   * @param {string} [key]
   * @returns {Promise<*[]>}
   */
  static async requests(paramsList, key) {
    const responses = await Promise.all(paramsList.map(params => this.request(params)))
    const filtered = key ? responses.map(response => response[key]) : responses

    return [].concat(...filtered)
  }

  /**
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.query
   * @param {number} [params.limit]
   * @returns {Promise<(Object|null)>}
   */
  static async searchTrack({ accessToken, query, limit }) {
    const { searchLimit } = configuration.spotify.service
    const response = await this.request({
      accessToken,
      path: 'search',
      query: {
        limit: limit || searchLimit,
        q: query,
        type: 'track'
      }
    })

    const track = response.tracks.items[0]

    return track ? this.toMusicServiceTrack(track) : null
  }

  /**
   *
   * @param {Object} params
   * @param {Array<{
   *   album: string,
   *   artist: string,
   *   track: string
   * }>} params.tracks
   * @returns {Promise<(object|null)[]>}
   */
  static async searchTracks({ tracks }) {
    const accessToken = await SpotifyAuthService.getAppAccessToken()
    const deferred = _.map(tracks, async ({ track, album, artist }) =>
      this.searchTrack({
        accessToken,
        limit: 1,
        query: [`track:"${track}"`, `album:"${album}"`, `artist:"${artist}"`].join('+')
      })
    )

    return Promise.all(deferred)
  }

  /**
   *
   * @param {Object} track
   * @returns {Object}
   */
  static toMusicServiceTrack(track) {
    return { ...track, uid: track.id }
  }
}
