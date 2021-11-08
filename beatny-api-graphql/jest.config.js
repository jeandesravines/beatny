module.exports = {
  collectCoverageFrom: ['**/lib/**/*.js'],
  restoreMocks: true,
  testEnvironment: 'node',
  timers: 'fake',
  transform: { '^.+\\.js$': 'babel-jest' }
}
