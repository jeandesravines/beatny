export default {
  base: {},
  level: process.env.BN_LOGGER_LEVEL || 'info',
  name: process.env.npm_package_name,
  useLevelLabels: true
}
