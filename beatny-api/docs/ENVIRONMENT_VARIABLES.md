# Environment Variables

## NODE_ENV

Node.JS's runtime environment

- Default: `"development"`

## BN_API_GRAPHQL_URI

The URI of the DB Proxy

- Type: `String`
- Required: true

## BN_AUTH_SECRET

The secret passphrase use for JWT`

- Type: `String`
- Required: true

## BN_BEACON_MAX_DISTANCE

Distance (in meters) between the user and the beacon

- Default: `10`

## BN_DEEZER_CLIENT_ID

Deezer's Client ID

- Required: true

## BN_DEEZER_CLIENT_SECRET

Deezer's Client Secret

- Required: true

## BN_GENRE_LEVENSHTEIN_DISTANCE

Maximum Lvenshtein distance between two genre occurrence.

- Required: true
- Type: `Number`
- Default: `5`

## BN_INSTANCE_ID

App's instance ID. Used to identify a process through all others in a cluster

- Default: `uniqid()`

## BN_LOGGER_LEVEL

Standard Log level.

- Default: `"info"`

## BN_ML_ITERATIONS

Number of k-means iterations

- Required: true
- Default: `10000`

## BN_PLAYLIST_SYNC_MARGIN

Number of tracks between the currently playing track and the first track to add during the sync process

- Default: `3`

## BN_PLAYLIST_THRESHOLD_REMAINING

Minimum number of tracks which must be remains to be played before launch the fill-up process

- Default: `10`

## BN_SERVER_URL

Public base URL. Ex: `"http://127.0.0.1:3000/api"`

- Required: true

## BN_SPOTIFY_CLIENT_ID

Spotify's Client ID

- Required: true

## BN_SPOTIFY_CLIENT_SECRET

Spotify's Client Secret

- Required: true

## BN_SPOTIFY_SEARCH_LIMIT

Default search limit param

- Default: `25`
- Type: `Number`

## BN_SPOTIFY_TOP_TRACK_COUNT

User's top track count to retrieve from Spotify

- Default: `50`
- Type: `Number`

## BN_TRACK_REPLAY_INTERVAL

Count of tracks before a track could be re-add in the playlist

- Default: `10`

## BN_TRACK_TOP_TRACK_COUNT

User's top track count to keep from all services.
Tracks will be sorted by popularity before be sliced

- Default: `50`
