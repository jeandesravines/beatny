import pino from 'pino'
import * as configuration from '../../configuration'

/**
 * A logger instance
 */
export default pino(configuration.logger)
