import levenshtein from 'fast-levenshtein'
import _ from 'lodash'
import * as configuration from '../../configuration'
import Track from '../../models/Track'

import SpotifyService from '../streaming/spotify/SpotifyService'

/**
 *
 */
export default class TrackPopulator {
  /**
   * Get used Track's features.
   * Convert all numbers to float
   * @private
   * @param {Object} params
   * @param {Object<*>} params.features
   * @param {Object} params.track
   * @returns {Object}
   */
  static getTrackFeatures(params) {
    const track = params.track
    const features = params.features
    const featureKeys = configuration.track.features.used
    const trackFeatures = _.pick(features, featureKeys)

    Object.assign(trackFeatures, {
      popularity: _.round(track.popularity / 100, 3),
      key: _.round(trackFeatures.key / 11, 3),
      loudness: _.round(trackFeatures.loudness / -60, 3),
      tempo: _.round(trackFeatures.tempo / 218, 3),
      time_signature: _.round(trackFeatures.time_signature / 4, 3)
    })

    return _.pickBy(trackFeatures, value => value)
  }

  /**
   * Get Track's genres and try to find the nearest genre in spotify
   * @private
   * @param {{ genres: string[] }} album
   * @param {{ genres: ?(string[]) }} artist
   * @param {{ genres: ?(string[]) }} track
   * @param {string[]} genres - Spotify genres
   * @returns {string[]}
   */
  static getTrackGenres({ album, artist, track, genres }) {
    const maxDistance = configuration.track.genreLevenshteinDistance

    return album.genres
      .concat(artist.genres || [], track.genres || [])
      .map(genre => {
        const toCompare = _.deburr(genre).toLowerCase()
        const nearest = _.chain(genres)
          .map(current => ({ value: current, distance: levenshtein.get(toCompare, current) }))
          .concat({ distance: maxDistance, value: genre })
          .minBy('distance')
          .value()

        return nearest.value
      })
      .filter((genre, i, array) => array.indexOf(genre) === i)
  }

  /**
   * Create a Track with the given Spotify's data
   * @private
   * @param {Object} params
   * @param {Object} params.album
   * @param {Object} params.artist
   * @param {Object} params.features
   * @param {string[]} params.genres
   * @param {{
   *   uid: string,
   *   name: string,
   *   album: { id: string, name: string, images: { url }[] },
   *   artists: { id: string, name: string }[]
   * }} params.track
   * @returns {Track}
   */
  static populateTrack(params) {
    const { album, track } = params

    const trackFeatures = this.getTrackFeatures(params)
    const trackGenres = this.getTrackGenres(params)
    const trackArtist = track.artists.map(({ name }) => name).join(', ')

    return Track.make({
      album: track.album.name,
      artist: trackArtist,
      features: trackFeatures,
      genres: trackGenres,
      name: track.name,
      photoUrl: album.images[0].url,
      uid: track.uid
    })
  }

  /**
   * Create Tracks based on the given data and the retrieved Spotify's data
   * @param {Object} params
   * @param {{
   *   uid: string,
   *   album: { id: string },
   *   artists: { id: string }[]
   * }[]} params.tracks
   * @returns {Promise<Track[]>}
   */
  static async populateTracks(params) {
    const tracks = params.tracks
    const trackIds = []
    const albumIds = []
    const artistIds = []
    const genres = await SpotifyService.getGenres()

    tracks.forEach(track => {
      trackIds.push(track.uid)
      albumIds.push(track.album.id)
      artistIds.push(track.artists[0].id)
    })

    const [albums, artists, features] = await Promise.all([
      SpotifyService.getAlbums({ ids: albumIds }),
      SpotifyService.getArtists({ ids: artistIds }),
      SpotifyService.getAudioFeatures({ ids: trackIds })
    ])

    return tracks.map((track, i) =>
      this.populateTrack({
        genres,
        track,
        artist: artists[i],
        album: albums[i],
        features: features[i]
      })
    )
  }
}
