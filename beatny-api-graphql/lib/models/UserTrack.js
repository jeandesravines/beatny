import mongoose from 'mongoose'
import UserTrackService from '../services/entities/UserTrackService'
import ModelFactory from './ModelFactory'
import { schema as TrackSchema } from './Track'

const UserTrackDefinition = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: TrackSchema,
    required: true
  }
}

const schema = new mongoose.Schema(UserTrackDefinition)

schema.loadClass(UserTrackService)
schema.index({ user: 1 })
schema.index({ user: 1, 'track.uid': 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('UserTrack', schema)
