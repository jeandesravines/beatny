export default {
  Coordinates: {
    lat: root => root.coordinates[0],
    lng: root => root.coordinates[1]
  }
}
