import mongoose from 'mongoose'
import * as configuration from '../configuration'
import AppAccountService from '../services/entities/AppAccountService'
import ModelFactory from './ModelFactory'

const AppAccountDefinition = {
  uid: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}

const schema = new mongoose.Schema(AppAccountDefinition)

schema.loadClass(AppAccountService)
schema.index({ createdAt: 1 }, { expires: configuration.appAccount.ttl / 1000 })
schema.index({ uid: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('AppAccount', schema)
