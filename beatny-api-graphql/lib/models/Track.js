import mongoose from 'mongoose'
import _ from 'lodash'
import * as configuration from '../configuration'
import ModelFactory from './ModelFactory'

const TrackFeaturesDefinition = _.chain(configuration.track.features)
  .mapKeys()
  .mapValues(() => ({ type: Number, min: 0, max: 1 }))
  .value()

const TrackDefinition = {
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  features: {
    type: TrackFeaturesDefinition,
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  photoUrl: {
    type: String
  }
}

export const schema = new mongoose.Schema(TrackDefinition)

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create(null, schema)
