import * as configuration from '../../configuration'

/**
 * Service which shows the server's status
 */
export default class StatusService {
  /**
   * Returns the server status
   * @returns {Promise<{
   *   date: string,
   *   env: string,
   *   ok: boolean
   * }>}
   */
  static async getStatus() {
    return {
      date: new Date().toISOString(),
      env: configuration.app.env,
      ok: true
    }
  }
}
