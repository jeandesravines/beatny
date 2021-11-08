import mongoose from 'mongoose'
import { PlaylistTrackSources } from '../constants/PlaylistTrack'
import PlaylistTrackService from '../services/entities/PlaylistTrackService'
import ModelFactory from './ModelFactory'
import { schema as TrackSchema } from './Track'

const PlaylistTrackDefinition = {
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true
  },
  track: {
    type: TrackSchema,
    required: true
  },
  order: {
    type: Number,
    default: 0,
    required: true
  },
  source: {
    type: String,
    enum: Object.values(PlaylistTrackSources),
    default: PlaylistTrackSources.user,
    required: true
  },
  prediction: {
    type: {
      cluster: { type: Number },
      clusters: { type: Number },
      distance: { type: Number },
      score: { type: Number }
    }
  }
}

const schema = new mongoose.Schema(PlaylistTrackDefinition)

schema.loadClass(PlaylistTrackService)
schema.index({ playlist: 1 })
schema.index({ playlist: 1, 'track.uid': 1 })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('PlaylistTrack', schema)
