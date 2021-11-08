import mongoose from 'mongoose'
import BeaconService from '../services/entities/BeaconService'
import ModelFactory from './ModelFactory'

const BeaconDefinition = {
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  location: {
    type: {
      coordinates: [Number],
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      }
    }
  },
  major: {
    type: Number,
    min: 0
  },
  minor: {
    type: Number,
    min: 0
  },
  uuid: {
    type: String
  }
}

const schema = new mongoose.Schema(BeaconDefinition)

schema.loadClass(BeaconService)
schema.index({ place: 1 })
schema.index({ uuid: 1, major: 1, minor: 1 }, { unique: true })
schema.index({ uuid: 1, major: 1, minor: 1, location: '2dsphere' })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Beacon', schema)
