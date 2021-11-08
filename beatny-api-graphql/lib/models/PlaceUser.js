import mongoose from 'mongoose'
import { PlaceUserAccesses } from '../constants/Place'
import PlaceUserService from '../services/entities/PlaceUserService'
import ModelFactory from './ModelFactory'

const PlaceUserDefinition = {
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  access: {
    type: String,
    enum: Object.values(PlaceUserAccesses),
    default: PlaceUserAccesses.ro,
    required: true
  }
}

const schema = new mongoose.Schema(PlaceUserDefinition)

schema.loadClass(PlaceUserService)
schema.index({ place: 1, user: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('PlaceUser', schema)
