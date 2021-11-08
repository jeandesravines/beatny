import StatusService from '../services/entities/StatusService'

export default {
  Query: {
    statusGet: () => StatusService.getStatus()
  }
}
