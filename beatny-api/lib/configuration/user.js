import _ from 'lodash'

// Ordered roles
const roles = {
  user: [],
  client: ['user'],
  admin: ['client']
}

// Give each roles the privileges of the previous
_.forEach(roles, (dependencies, key) => {
  roles[key] = dependencies.reduce((acc, role) => [...acc, ...roles[role]], [key])
})

export default {
  roles
}
