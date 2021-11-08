import _ from 'lodash'
import mongoose from 'mongoose'
import * as configuration from '../configuration'
import PlaylistService from '../services/entities/PlaylistService'
import ModelFactory from './ModelFactory'

const PlaylistFeaturesDefinition = _.chain(configuration.track.features)
  .mapKeys(value => value)
  .mapValues(() => ({
    type: {
      min: { type: Number, min: 0, max: 1 },
      max: { type: Number, min: 0, max: 1 }
    }
  }))
  .value()

const PlaylistSettingsDefinition = {
  minScore: { type: Number, default: 0.8, required: true }
}

const PlaylistDefinition = {
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  settings: {
    type: PlaylistSettingsDefinition,
    default: {},
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  features: {
    type: PlaylistFeaturesDefinition,
    default: {},
    required: true
  },
  filledUpAt: {
    type: Date,
    default: 0,
    required: true
  },
  predictedAt: {
    type: Date,
    default: 0,
    required: true
  },
  synchronizedAt: {
    type: Date,
    default: 0,
    required: true
  }
}

const schema = new mongoose.Schema(PlaylistDefinition)

schema.loadClass(PlaylistService)
schema.index({ account: 1 }, { unique: true })
schema.index({ place: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Playlist', schema)
