module.exports = {
  collectCoverageFrom: ['**/lib/**/*.js'],
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
  testEnvironment: 'node',
  timers: 'fake',
  transform: { '^.+\\.js$': 'babel-jest' }
}
