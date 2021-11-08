import mongoose from 'mongoose'
import * as configuration from '../configuration'
import { SessionStatuses } from '../constants/Session'
import SessionService from '../services/entities/SessionService'
import ModelFactory from './ModelFactory'

const SessionDefinition = {
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
  status: {
    type: String,
    enum: Object.values(SessionStatuses),
    default: SessionStatuses.created,
    required: true
  }
}

const schema = new mongoose.Schema(SessionDefinition)

schema.loadClass(SessionService)
schema.index({ place: 1 })
schema.index({ user: 1 })
schema.index({ createdAt: 1 }, { expires: configuration.session.ttl / 1000 })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Session', schema)
