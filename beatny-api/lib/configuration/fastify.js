import uniqid from 'uniqid'
import loggerConfiguration from './logger'

export default {
  logger: loggerConfiguration,
  genReqId: () => uniqid()
}
