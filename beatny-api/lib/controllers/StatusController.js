import * as configuration from '../configuration'
import Controller from './Controller'

/**
 *
 */
export default class StatusController extends Controller {
  /**
   * @returns {Promise<Object>}
   */
  static async status() {
    return {
      date: new Date().toISOString(),
      env: configuration.app.env,
      instanceId: configuration.app.instanceId,
      ok: true
    }
  }
}
