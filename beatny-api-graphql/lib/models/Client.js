import mongoose from 'mongoose'
import ClientService from '../services/entities/ClientService'
import ModelFactory from './ModelFactory'

const ClientDefinition = {
  key: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  }
}

const schema = new mongoose.Schema(ClientDefinition)

schema.loadClass(ClientService)
schema.index({ key: 1, secret: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Client', schema)
