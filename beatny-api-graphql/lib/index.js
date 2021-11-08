import Logger from './services/logger/Logger'
import * as MongooseService from './services/mongoose/MongooseService'
import * as Server from './services/server/Server'

process.on('uncaughtException', async error => {
  Logger.error(error)
})

process.on('unhandledRejection', error => {
  process.emit('uncaughtException', error)
})

/**
 * Initialize the server and the database instances
 * @returns {Promise<void>}
 */
const initialize = async () => {
  await MongooseService.connect()
  await Server.connect()
}

initialize().catch(error => {
  throw error
})
