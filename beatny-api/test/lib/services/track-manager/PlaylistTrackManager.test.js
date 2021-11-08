import Track from '../../../../lib/models/Track'
import PlaylistTracksManager from '../../../../lib/services/track-manager/PlaylistTracksManager'
import Playlist from '../../../../lib/models/Playlist'
import * as configuration from '../../../../lib/configuration'

describe('getNextTracks', () => {
  test('should returns all tracks - index = -1, withMargin = false', async () => {
    const playlist = Playlist.make({
      tracks: Array.from({ length: 3 }, (v, i) => ({
        track: Track.make({ uid: 3 - i }),
        order: 2 - i
      }))
    })

    jest.spyOn(PlaylistTracksManager, 'getCurrentlyPlayingTrackIndex').mockResolvedValue(-1)

    const result = await PlaylistTracksManager.getNextPlaylistTracks({ playlist })

    expect(result).toEqual([
      {
        track: Track.make({ uid: 1 }),
        order: 0
      },
      {
        track: Track.make({ uid: 2 }),
        order: 1
      },
      {
        track: Track.make({ uid: 3 }),
        order: 2
      }
    ])
  })

  test('should returns next tracks - index = 1, withMargin = false', async () => {
    const playlist = Playlist.make({
      tracks: Array.from({ length: 3 }, (v, i) => ({
        track: Track.make({ uid: 3 - i }),
        order: 2 - i
      }))
    })

    jest.spyOn(PlaylistTracksManager, 'getCurrentlyPlayingTrackIndex').mockResolvedValue(1)

    const result = await PlaylistTracksManager.getNextPlaylistTracks({ playlist })

    expect(result).toEqual([
      {
        track: Track.make({ uid: 3 }),
        order: 2
      }
    ])
  })

  test('should returns next tracks with margin', async () => {
    const playlist = Playlist.make({
      tracks: Array.from({ length: 5 }, (v, i) => ({
        track: Track.make({ uid: 5 - i }),
        order: 4 - i
      }))
    })

    jest.spyOn(PlaylistTracksManager, 'getCurrentlyPlayingTrackIndex').mockResolvedValue(1)

    configuration.playlist.syncMargin = 2

    const result = await PlaylistTracksManager.getNextPlaylistTracks({ playlist, withMargin: true })

    expect(result).toEqual([
      {
        track: Track.make({ uid: 5 }),
        order: 4
      }
    ])
  })
})
