import userConfiguration from '../../../lib/configuration/user'

describe('configuration', () => {
  test('should the role hierarchy', () => {
    expect(userConfiguration.roles).toEqual({
      user: ['user'],
      client: ['client', 'user'],
      admin: ['admin', 'client', 'user']
    })
  })
})
