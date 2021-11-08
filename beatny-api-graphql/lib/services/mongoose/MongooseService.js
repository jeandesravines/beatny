import _ from 'lodash'
import mongoose from 'mongoose'
import * as configuration from '../../configuration'

mongoose.set('debug', configuration.mongoose.debug)

/**
 * Synx schemas indexes
 * @private
 * @returns {Promise<void>}
 */
const syncIndexes = async () => {
  await Promise.all(
    _.map(mongoose.models, async model => {
      await model.createCollection()
      await model.syncIndexes()
    })
  )
}

/**
 * Returns a connected Mongoose instance
 * @returns {Promise<Mongoose>}
 */
export const connect = async () => {
  await mongoose.connect(configuration.mongoose.uri, configuration.mongoose.options)
  syncIndexes()

  return mongoose
}

/**
 * Close all connections
 * @returns {Promise<void>}
 */
export const disconnect = async () => {
  await mongoose.disconnect()
}
