import _ from 'lodash'
import AccountResolvers from './AccountResolvers'
import AccountTokenResolvers from './AccountTokenResolvers'
import AppAccountResolvers from './AppAccountResolvers'
import BeaconResolvers from './BeaconResolvers'
import CoordinatesResolvers from './CoordinatesResolvers'
import DocumentResolvers from './DocumentResolvers'
import PlaceResolvers from './PlaceResolvers'
import PlaceUserResolvers from './PlaceUserResolvers'
import PlaylistResolvers from './PlaylistResolvers'
import PlaylistTrackResolvers from './PlaylistTrackResolvers'
import PlaylistTrackUserResolvers from './PlaylistTrackUserResolvers'
import SessionResolvers from './SessionResolvers'
import StatusResolvers from './StatusResolvers'
import UserResolvers from './UserResolvers'
import UserTrackResolvers from './UserTrackResolvers'

export default _.merge(
  AccountResolvers,
  AccountTokenResolvers,
  AppAccountResolvers,
  BeaconResolvers,
  CoordinatesResolvers,
  DocumentResolvers,
  PlaceResolvers,
  PlaceUserResolvers,
  PlaylistResolvers,
  PlaylistTrackResolvers,
  PlaylistTrackUserResolvers,
  SessionResolvers,
  StatusResolvers,
  UserResolvers,
  UserTrackResolvers
)
