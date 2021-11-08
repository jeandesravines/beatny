import _ from 'lodash'
import skmeans from 'skmeans'
import * as configuration from '../../configuration'
import Cluster from './Cluster'

/**
 * Clustering service.
 * Used for predict the status of tracks into playlist
 */
export default class ClusterPredictionService {
  /**
   * Create K Clusters for the given Tracks
   * @param {Object[]} tracks
   * @param {Object} options
   * @param {number} options.k
   * @param {number[]|string} [options.centroids = 'kmpp']
   * @param {number} [options.iterations = configuration.ml.iterations]
   * @returns {Cluster[]}
   */
  static getClusters(tracks, options) {
    const featuresMatrix = tracks.map(track => _.values(track))

    const { k, centroids = 'kmpp', iterations = configuration.ml.iterations } = options
    const result = skmeans(featuresMatrix, k, centroids, iterations)
    const clusters = result.centroids.map(centroid => new Cluster(centroid))

    result.idxs.forEach((index, i) => {
      const cluster = clusters[index]
      const features = featuresMatrix[i]
      const { centroid } = cluster

      cluster.indexes.push(i)
      cluster.data.push(features)
      cluster.distances.push(this.getDistance(centroid, features))
    })

    return clusters
  }

  /**
   * Distance between two tracks by their numerical features
   * @param {number[]} from
   * @param {number[]} to
   * @returns {number}
   */
  static getDistance(from, to) {
    const sum = from.reduce((distance, v, i) => distance + (to[i] - v) ** 2, 0)

    return Math.sqrt(sum)
  }

  /**
   * Get a clustering prediction for the given Tracks
   * according to the current clustering
   * @param {Cluster[]} clusters
   * @param {number[]} ratios
   * @param {Track[]} tracks
   * @returns {Promise<{
   *   track: Track,
   *   prediction: {
   *     distance: number,
   *     limit: number,
   *     ratio: number,
   *     cluster: number,
   *     clusters: number,
   *     score: number
   *   }
   * }[]>}
   */
  static async getPredictionFromClustering({ clusters, ratios, tracks }) {
    const predictions = []
    const k = clusters.length
    const distanceMax = Math.sqrt(clusters[0].centroid.length)

    clusters.forEach((cluster, i) => {
      const { distances, indexes } = cluster
      const ratio = ratios[i]
      const limit = Math.max(...distances)

      indexes.forEach((trackIndex, j) => {
        const track = tracks[trackIndex]
        const distance = distances[j]
        const score = (1 - distance / distanceMax) * ratio
        const finalScore = (distance > limit ? -1 : 1) * score

        const prediction = {
          distance,
          limit,
          ratio,
          cluster: i,
          clusters: k,
          score: finalScore
        }

        predictions.push({
          prediction,
          track
        })
      })
    })

    return predictions
  }

  /**
   * @param {Track} track
   * @returns {Object<number>}
   */
  static getTrackFeatures(track) {
    const features = _.pick(track.features, configuration.track.features.used)
    const featureGenreValue = 1 / track.genres.length
    const featuresGenres = _.transform(
      track.genres,
      (acc, value) => {
        acc[value] = featureGenreValue
      },
      {}
    )

    return { ...features, ...featuresGenres }
  }

  /**
   * @param {Track[]} tracks
   * @returns {Object<number>}
   */
  static getTracksFeaturesMask(tracks) {
    const features = {}
    const usedKeys = configuration.track.features.used

    usedKeys.forEach(key => {
      features[key] = 0
    })

    tracks.forEach(({ genres }) => {
      _.forEach(genres, genre => {
        features[genre] = 0
      })
    })

    return features
  }

  /**
   * Find the "k" parameter to determine the number of necessary clusters
   * and return the clusters for the optimum k
   * @param {Object<number>[]} tracks
   * @returns {Cluster[]}
   */
  static getTrainingClusters(tracks) {
    const wssData = this.getWSSData(tracks)
    const indexes = wssData.map(({ wss }) =>
      wss.findIndex((value, i, values) => i > 0 && values[i - 1] - value > value - values[i + 1])
    )

    const k = Math.max(...indexes)

    return wssData[k].clusters
  }

  /**
   * @param {Object<number>[]} tracks
   * @param {number} [kMax]
   * @returns {{
   *   clusters: Cluster[],
   *   wss: number[]
   * }[]}
   */
  static getWSSData(tracks, kMax = 10) {
    const keys = _.keys(tracks[0])
    const result = []

    for (let i = 0; i < kMax; i += 1) {
      const clusters = this.getClusters(tracks, { k: i + 1 })
      const wss = []

      for (let j = 0; j < keys.length; j += 1) {
        clusters.forEach(({ data }) => {
          const features = data.map(rows => rows[j])
          const mean = _.mean(features)

          wss[j] = features.reduce((sum, feature) => sum + (feature - mean) ** 2, 0)
        })
      }

      result.push({ clusters, wss })
    }

    return result
  }

  /**
   * Predicts the pending Tracks score.
   * @param {Track[]} done
   * @param {Track[]} pending
   * @returns {Promise<{
   *   track: Track,
   *   prediction: {
   *     distance: number,
   *     limit: number,
   *     ratio: number,
   *     cluster: number,
   *     clusters: number,
   *     score: number
   *   }
   * }[]>}
   */
  static async predictStatus({ done, pending }) {
    if (pending.length === 0) {
      return []
    }

    const allTracks = done.concat(pending)
    const defaultValues = this.getTracksFeaturesMask(allTracks)
    const preparedTreated = this.prepareTracks(done, defaultValues)
    const preparedPending = this.prepareTracks(pending, defaultValues)

    const trainingClusters = this.getTrainingClusters(preparedTreated)
    const centroids = _.map(trainingClusters, 'centroid')
    const k = centroids.length
    const testClusters = this.getClusters(preparedPending, { k, centroids })

    const largestCluster = _.maxBy(trainingClusters, 'indexes.length')
    const largestClusterLength = Math.max(largestCluster.indexes.length, 1)
    const ratios = trainingClusters.map(({ indexes }) => indexes.length / largestClusterLength)

    return this.getPredictionFromClustering({
      ratios,
      clusters: testClusters,
      tracks: pending
    })
  }

  /**
   * @param {Track[]} tracks
   * @param {Object} defaultValues
   * @returns {Object<number>[]}
   */
  static prepareTracks(tracks, defaultValues) {
    return tracks.map(track => ({
      ...defaultValues,
      ...this.getTrackFeatures(track)
    }))
  }
}
