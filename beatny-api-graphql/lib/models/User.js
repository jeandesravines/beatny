import mongoose from 'mongoose'
import { UserRoles } from '../constants/User'
import UserService from '../services/entities/UserService'
import ModelFactory from './ModelFactory'

const UserDefinition = {
  displayName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String
  },
  roles: {
    type: [{ type: String, enum: Object.values(UserRoles) }],
    default: [UserRoles.user],
    required: true
  }
}

const schema = new mongoose.Schema(UserDefinition)

schema.loadClass(UserService)
schema.index({ email: 1 }, { unique: true })

/**
 * @const {Mongoose.Model}
 */
export default ModelFactory.create('User', schema)
