import _ from 'lodash'
import kue from 'kue'
import * as configuration from '../../configuration'

/**
 * Create Queue and process Jobs
 */
export default class PubSubService {
  /**
   * Jobs' queue
   * @private
   * @readonly
   * @const
   * @type {kue.Queue}
   */
  static queue = kue.createQueue({
    redis: configuration.redis.uri
  })

  /**
   * Publish a message
   * @param {string} topic
   * @param {Object} data
   * @param {{
   *   priority: ?('low'|'normal'|'medium'|'high'|'critical'),
   *   delay: ?number
   * }} [options]
   * @returns {void}
   */
  static async publish(topic, data, options) {
    const job = PubSubService.queue.create(topic, data)
    const iteratee = (acc, value, key) => acc[key](value)

    _.reduce(options, iteratee, job).save()
  }

  /**
   * Subscribe to a Topic
   * @param {string} topic
   * @param {{ concurrency: ?number }} options
   * @param {Function(job: kue.Job, context: Object): Promise<void>} callback
   * @returns {void}
   */
  static subscribe(topic, options, callback) {
    const { concurrency = 1 } = options
    const handler = async (job, context, done) => {
      Promise.resolve()
        .then(() => callback(job, context))
        .then(done, done)
    }

    return PubSubService.queue.process(topic, concurrency, handler)
  }
}
