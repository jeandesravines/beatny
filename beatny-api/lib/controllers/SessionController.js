import BadRequestError from '../errors/common/BadRequestError'
import ConflictError from '../errors/common/ConflictError'
import NotFoundError from '../errors/common/NotFoundError'
import Beacon from '../models/Beacon'
import Session from '../models/Session'
import UserTracksManager from '../services/track-manager/UserTracksManager'
import Controller from './Controller'
import JobService from '../services/worker/PusbSubService'

/**
 * User's Session controller
 */
export default class SessionController extends Controller {
  /**
   * Delete Users's Sessions
   * @param {Object} locals
   * @param {User} locals.user
   * @returns {Promise<void>}
   */
  static async delete({ locals }) {
    const { user } = locals
    const session = await Session.service.findOneByUser({ user })

    if (!session) {
      throw new NotFoundError('session/not-found')
    }

    const { place } = session
    const { playlist } = place

    await UserTracksManager.deleteUserTracksFromPlaylist({ playlist, user })
    await Session.service.deleteManyByUser({ user })
  }

  /**
   * Create a User Session (if it not already exists) for the current place
   * @param {Object} locals
   * @param {User} locals.user
   * @param {Object} body
   * @param {string} body.uuid
   * @param {int} body.major
   * @param {int} body.minor
   * @param {{ lat: number, lng: number }} body.location
   * @returns {Promise<void>}
   */
  static async post({ body, locals }) {
    const { user } = locals
    const beacon = await Beacon.service.getByLocationAndData(body)
    let session = await Session.service.findOneByUser({ user })

    if (!beacon) {
      throw new BadRequestError('session/not-in-the-area')
    }

    if (session) {
      throw new ConflictError('session/already-exists')
    }

    const { place } = beacon

    await UserTracksManager.saveTracksToUser({ user })
    session = await Session.service.updateOneByUser({ place, user })

    await JobService.publish('session/post', {
      session: { id: session.id }
    })
  }
}
