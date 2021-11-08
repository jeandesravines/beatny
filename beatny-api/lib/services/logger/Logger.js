import pino from 'pino'
import * as configuration from '../../configuration'

/**
 * A logger instance
 * @const
 * @type {pino}
 */
export default pino(configuration.logger)
