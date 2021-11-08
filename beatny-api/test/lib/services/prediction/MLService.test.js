import ClusterPredictionService from '../../../../lib/services/prediction/ClusterPredictionService'
import Track from '../../../../lib/models/Model'

describe('getDistance', () => {
  test('returns the distance between 2 1D points', () => {
    const distance = ClusterPredictionService.getDistance([0], [2])

    expect(distance).toBe(2)
  })

  test('returns the distance between 2 2D points', () => {
    const distance = ClusterPredictionService.getDistance([0, 2], [2, 0])

    expect(distance).toBe(Math.sqrt(8))
  })

  test('returns the distance between 2 3D points', () => {
    const distance = ClusterPredictionService.getDistance([0, 2, 0], [2, 0, 2])

    expect(distance).toBe(Math.sqrt(12))
  })
})

describe('prepareTracks', () => {
  test('merge with the mask', () => {
    const mask = {
      a: 0,
      b: 0,
      c: 0,
      d: 0
    }

    const track = Track.make({
      features: {
        d: 0.3,
        a: 0.1
      }
    })

    const spyGetTrackFeatures = jest
      .spyOn(ClusterPredictionService, 'getTrackFeatures')
      .mockImplementation($track => $track.features)

    const prepared = ClusterPredictionService.prepareTracks([track], mask)

    expect(spyGetTrackFeatures).toHaveBeenCalledWith(track)
    expect(prepared).toEqual([
      {
        a: 0.1,
        b: 0,
        c: 0,
        d: 0.3
      }
    ])
  })
})
