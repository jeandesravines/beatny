import Account from '../../../../lib/models/Account'
import UserTracksManager from '../../../../lib/services/track-manager/UserTracksManager'
import Track from '../../../../lib/models/Track'
import UserTrack from '../../../../lib/models/UserTrack'
import User from '../../../../lib/models/User'
import SpotifyMusicService from '../../../../lib/services/streaming/spotify/SpotifyMusicService'
import TrackPopulator from '../../../../lib/services/track-manager/TrackPopulator'
import Playlist from '../../../../lib/models/Playlist'
import PlaylistTrack from '../../../../lib/models/PlaylistTrack'
import TrackFilter from '../../../../lib/services/track-manager/TrackFilter'
import PlaylistTrackUser from '../../../../lib/models/PlaylistTrackUser'

describe('getTracksByAccount', () => {
  test("should returns account's tracks", async () => {
    const account = Account.make({ id: 1, service: 'spotify' })
    const rawTracks = [{ uid: 1 }, { uid: 2 }, { uid: 3 }]
    const populatedTracks = [Track.make({ uid: 1 }), Track.make({ uid: 2 }), Track.make({ uid: 3 })]

    jest.spyOn(SpotifyMusicService, 'getAccessTokenByAccount').mockResolvedValue('access_token')
    jest.spyOn(SpotifyMusicService, 'getUserTopTracks').mockResolvedValue(rawTracks)
    jest.spyOn(TrackPopulator, 'populateTracks').mockResolvedValue(populatedTracks)

    const result = await UserTracksManager.getTracksByAccount({ account })

    expect(result).toEqual(populatedTracks)
    expect(SpotifyMusicService.getAccessTokenByAccount).toHaveBeenCalledWith(account)
    expect(SpotifyMusicService.getUserTopTracks).toHaveBeenCalledWith({
      accessToken: 'access_token'
    })

    expect(TrackPopulator.populateTracks).toHaveBeenCalledWith({ tracks: rawTracks })
  })
})

describe('saveTracksToUser', () => {
  test("save user's tracks", async () => {
    const user = User.make({ id: 1 })
    const tracksByAccount = {
      1: [
        Track.make({ uid: 1, features: { popularity: 0.6 } }),
        Track.make({ uid: 2, features: { popularity: 0.9 } })
      ],
      2: [
        Track.make({ uid: 2, features: { popularity: 0.9 } }),
        Track.make({ uid: 3, features: { popularity: 0.7 } })
      ],
      3: [
        Track.make({ uid: 3, features: { popularity: 0.7 } }),
        Track.make({ uid: 4, features: { popularity: 0.8 } })
      ]
    }

    jest
      .spyOn(Account.service, 'findManyByUser')
      .mockResolvedValue([
        Account.make({ id: 1 }),
        Account.make({ id: 2 }),
        Account.make({ id: 3 })
      ])

    jest
      .spyOn(UserTracksManager, 'getTracksByAccount')
      .mockImplementation(async ({ account }) => tracksByAccount[account.id])

    jest.spyOn(UserTrack.service, 'saveManyByUID').mockResolvedValue([])

    const result = await UserTracksManager.saveTracksToUser({ user })

    expect(result).toBe(undefined)
    expect(Account.service.findManyByUser).toHaveBeenCalledWith({ user })
    expect(UserTrack.service.saveManyByUID).toHaveBeenCalledWith([
      { user, track: Track.make({ uid: 2, features: { popularity: 0.9 } }) },
      { user, track: Track.make({ uid: 4, features: { popularity: 0.8 } }) },
      { user, track: Track.make({ uid: 3, features: { popularity: 0.7 } }) },
      { user, track: Track.make({ uid: 1, features: { popularity: 0.6 } }) }
    ])
  })
})

describe('saveUserTracksToPlaylist', () => {
  test("should save User's tracks to Playlist", async () => {
    const playlist = Playlist.make({
      tracks: [0, 1, 2, 3].map(v =>
        PlaylistTrack.make({
          id: v,
          track: Track.make({ uid: v }),
          order: v
        })
      )
    })

    const user = User.make({
      tracks: [0, 3, 4, 5].map(v =>
        UserTrack.make({
          track: Track.make({ uid: v })
        })
      )
    })

    jest.spyOn(TrackFilter, 'filter').mockResolvedValue([0, 3, 5].map(v => Track.make({ uid: v })))

    jest.spyOn(PlaylistTrackUser.service, 'saveManyByUser').mockResolvedValue(undefined)

    jest.spyOn(PlaylistTrack.service, 'saveManyByUID').mockResolvedValue(
      [0, 3, 5].map((v, i) =>
        PlaylistTrack.make({
          id: 4 + i,
          playlist,
          track: Track.make({ uid: v }),
          order: 4 + i,
          source: 'user'
        })
      )
    )

    const result = await UserTracksManager.saveUserTracksToPlaylist({ playlist, user })

    expect(result).toBe(undefined)

    expect(TrackFilter.filter).toHaveBeenCalledWith({
      playlist,
      tracks: user.tracks.map(({ track }) => track)
    })

    expect(PlaylistTrack.service.saveManyByUID).toHaveBeenCalledWith({
      tracks: [0, 3, 5].map((v, i) =>
        PlaylistTrack.make({
          playlist,
          track: Track.make({ uid: v }),
          order: 4 + i,
          source: 'user'
        })
      )
    })

    expect(PlaylistTrackUser.service.saveManyByUser).toHaveBeenCalledWith({
      tracks: [0, 3, 5].map((v, i) =>
        PlaylistTrackUser.make({
          user,
          track: PlaylistTrack.make({
            id: 4 + i,
            playlist,
            track: Track.make({ uid: v }),
            order: 4 + i,
            source: 'user'
          })
        })
      )
    })
  })
})
