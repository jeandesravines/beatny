import mongoose from 'mongoose'
import PlaceService from '../services/entities/PlaceService'
import ModelFactory from './ModelFactory'

const PlaceDefinition = {
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
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}

const schema = new mongoose.Schema(PlaceDefinition)

schema.loadClass(PlaceService)
schema.index({ location: '2dsphere' })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Place', schema)
