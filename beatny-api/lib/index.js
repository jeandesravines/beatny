import * as Server from './services/server/Server'
import Logger from './services/logger/Logger'
import PusbSubService from './services/worker/PusbSubService'
import UserTracksManager from './services/track-manager/UserTracksManager'
import Session from './models/Session'

process.on('uncaughtException', error => {
  Logger.error(error)
})

process.on('unhandledRejection', error => {
  throw error
})

/**
 * Initialize the server and the database instances
 * @returns {Promise<void>}
 */
const initialize = async () => {
  await Server.connect()
}

initialize().catch(error => {
  throw error
})

PusbSubService.subscribe('session/post', {}, async ({ data }) => {
  const session = await Session.service.findOneById(data.session)
  const { place, user } = session
  const { playlist } = place

  await UserTracksManager.saveUserTracksToPlaylist({ playlist, user })
})
