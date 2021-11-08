import mongoose from 'mongoose'
import PlaylistTrackUserService from '../services/entities/PlaylistTrackUserService'
import ModelFactory from './ModelFactory'

const PlaylistTrackUserDefinition = {
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistTrack',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  removedAt: {
    type: Date
  }
}

const schema = new mongoose.Schema(PlaylistTrackUserDefinition)

schema.loadClass(PlaylistTrackUserService)
schema.index({ track: 1, user: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('PlaylistTrackUser', schema)
