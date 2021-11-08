const _ = require('lodash')
const configuration = require('./lib/configuration')

const backup = _.cloneDeep(configuration)

beforeEach(() => {
  Object.assign(configuration, _.cloneDeep(backup))
})
