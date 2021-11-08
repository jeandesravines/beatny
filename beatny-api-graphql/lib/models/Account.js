import mongoose from 'mongoose'
import { AccountServices } from '../constants/Account'
import AccountService from '../services/entities/AccountService'
import ModelFactory from './ModelFactory'

const AccountDefinition = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    enum: Object.values(AccountServices),
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  expiresAt: {
    type: Date
  }
}

const schema = new mongoose.Schema(AccountDefinition)

schema.loadClass(AccountService)
schema.index({ user: 1 })
schema.index({ user: 1, service: 1 })
schema.index({ service: 1, uid: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('Account', schema)
