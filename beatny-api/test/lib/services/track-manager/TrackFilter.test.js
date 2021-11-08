import Playlist from '../../../../lib/models/Playlist'
import Track from '../../../../lib/models/Track'
import ClusterPredictionService from '../../../../lib/services/prediction/ClusterPredictionService'
import PlaylistTracksManager from '../../../../lib/services/track-manager/PlaylistTracksManager'
import TrackFilter from '../../../../lib/services/track-manager/TrackFilter'

describe('getTracksFromPredictions', () => {
  test('should return the accepted tracks', () => {
    const playlist = Playlist.make({
      settings: { minScore: 0.8 }
    })

    const predictions = [
      {
        track: Track.make({ uid: 1 }),
        prediction: { score: 0.1 }
      },
      {
        track: Track.make({ uid: 2 }),
        prediction: { score: 0.8 }
      },
      {
        track: Track.make({ uid: 3 }),
        prediction: { score: 0.92 }
      }
    ]

    const result = TrackFilter.getTracksFromPredictions({ predictions, playlist })

    expect(result).toEqual([
      Track.make({ uid: 2, prediction: { score: 0.8 } }),
      Track.make({ uid: 3, prediction: { score: 0.92 } })
    ])
  })
})

describe('filter', () => {
  test('thrown an error - no playlist tracks', async () => {
    const playlist = Playlist.make({
      settings: { minScore: 0.8 },
      tracks: []
    })

    const tracks = [Track.make({ uid: 1 }), Track.make({ uid: 2 }), Track.make({ uid: 3 })]

    const deferred = TrackFilter.filter({
      playlist,
      tracks
    })

    expect(deferred).rejects.toEqual(new Error('playlist/no-treated-tracks'))
  })

  test('returns the filtered tracks', async () => {
    const playlist = Playlist.make({
      settings: { minScore: 0.8 },
      features: { popularity: { min: 0.7 } },
      genres: ['electro', 'rock'],
      tracks: [
        { track: Track.make({ uid: 4 }), order: 0 },
        { track: Track.make({ uid: 2 }), order: 1 },
        { track: Track.make({ uid: 3 }), order: 2 }
      ]
    })

    const userTracks = [
      Track.make({ uid: 2, genres: ['electro'], features: { popularity: 0.7 } }),
      Track.make({ uid: 4, genres: ['rock'], features: { popularity: 0.7 } }),
      Track.make({ uid: 5, genres: ['metal'], features: { popularity: 0.7 } }),
      Track.make({ uid: 6, genres: ['electro', 'rock'], features: { popularity: 0.7 } }),
      Track.make({ uid: 7, genres: ['electro'], features: { popularity: 0.2 } }),
      Track.make({ uid: 8, genres: ['electro', 'rock'], features: { popularity: 0.7 } })
    ]

    jest
      .spyOn(PlaylistTracksManager, 'getNextPlaylistTracks')
      .mockResolvedValue([
        { track: Track.make({ uid: 2 }), order: 1 },
        { track: Track.make({ uid: 3 }), order: 2 }
      ])

    jest
      .spyOn(ClusterPredictionService, 'predictStatus')
      .mockResolvedValue([
        { track: Track.make({ uid: 4 }), prediction: { score: 0.85 } },
        { track: Track.make({ uid: 6 }), prediction: { score: 0.8 } }
      ])

    const result = await TrackFilter.filter({
      playlist,
      tracks: userTracks
    })

    const done = [Track.make({ uid: 2 }), Track.make({ uid: 3 })]
    const pending = [
      Track.make({ uid: 4, genres: ['rock'], features: { popularity: 0.7 } }),
      Track.make({ uid: 6, genres: ['electro', 'rock'], features: { popularity: 0.7 } }),
      Track.make({ uid: 8, genres: ['electro', 'rock'], features: { popularity: 0.7 } })
    ]

    expect(result).toEqual([
      Track.make({ uid: 4, prediction: { score: 0.85 } }),
      Track.make({ uid: 6, prediction: { score: 0.8 } })
    ])

    expect(PlaylistTracksManager.getNextPlaylistTracks).toHaveBeenCalledWith({
      playlist,
      withMargin: true
    })
    expect(ClusterPredictionService.predictStatus).toHaveBeenCalledWith({ done, pending })
  })
})
