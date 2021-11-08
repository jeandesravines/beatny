import mongoose from 'mongoose'
import * as configuration from '../configuration'
import AccountTokenService from '../services/entities/AccountTokenService'
import ModelFactory from './ModelFactory'

const AccountTokenDefinition = {
  service: {
    type: String,
    required: true
  }
}

const schema = new mongoose.Schema(AccountTokenDefinition)

schema.loadClass(AccountTokenService)
schema.index({ createdAt: 1 }, { expires: configuration.accountToken.ttl / 1000 })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('AccountToken', schema)
