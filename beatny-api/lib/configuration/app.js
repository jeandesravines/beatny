import uniqid from 'uniqid'

export default {
  instanceId: process.env.BN_INSTANCE_ID || uniqid(),
  env: process.env.NODE_ENV || 'development'
}
