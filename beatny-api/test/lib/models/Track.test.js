import Track from '../../../lib/models/Track'

describe('hasRequiredFeatures', () => {
  test('returns false - < min ', () => {
    const features = {
      energy: { min: 0.7 }
    }

    const track = Track.make({
      features: {
        danceability: 0.2,
        energy: 0.5,
        valence: 0.5
      }
    })

    expect(track.hasRequiredFeatures({ features })).toBe(false)
  })

  test('returns false - > max ', () => {
    const features = {
      energy: { max: 0.7 }
    }

    const track = Track.make({
      features: {
        danceability: 0.2,
        energy: 0.9,
        valence: 0.5
      }
    })

    expect(track.hasRequiredFeatures({ features })).toBe(false)
  })

  test('returns true - > min', () => {
    const features = {
      energy: { mmin: 0.2, max: 0.7 }
    }

    const track = Track.make({
      features: {
        danceability: 0.2,
        energy: 0.5,
        valence: 0.5
      }
    })

    expect(track.hasRequiredFeatures({ features })).toBe(true)
  })
})

describe('hasRequiredGenres', () => {
  test('returns false - no matched genre', () => {
    const genres = ['electro', 'rock']
    const track = Track.make({
      genres: ['country', 'folk']
    })

    expect(track.hasRequiredGenres({ genres })).toBe(false)
  })

  test('returns true - no genre', () => {
    const genres = ['electro', 'rock']
    const track = Track.make({
      genres: []
    })

    expect(track.hasRequiredGenres({ genres })).toBe(true)
  })

  test('returns true', () => {
    const genres = ['electro', 'rock']
    const track = Track.make({
      genres: ['electro']
    })

    expect(track.hasRequiredGenres({ genres })).toBe(true)
  })
})

describe('hasRequiredCriteria', () => {
  test('returns true', () => {
    const track = Track.make({
      genres: ['electro', 'rock'],
      features: {
        energy: 0.5,
        popularity: 0.6
      }
    })

    const spyHasFeatures = jest.spyOn(track, 'hasRequiredFeatures')
    const spyHasGenres = jest.spyOn(track, 'hasRequiredGenres')

    const genres = ['electro', 'metal']
    const features = {
      energy: { min: 0.2, max: 0.7 },
      popularity: { min: 0.2, max: 0.7 }
    }

    const hasRequiredCriteria = track.hasRequiredCriteria({ features, genres })

    expect(hasRequiredCriteria).toBe(true)
    expect(spyHasFeatures).toHaveBeenCalledWith({ features })
    expect(spyHasGenres).toHaveBeenCalledWith({ genres })
  })

  test("returns true - don't has required genres", () => {
    const track = Track.make({
      genres: ['electro', 'rock'],
      features: {
        energy: 0.5,
        popularity: 0.5
      }
    })

    const spyHasFeatures = jest.spyOn(track, 'hasRequiredFeatures')
    const spyHasGenres = jest.spyOn(track, 'hasRequiredGenres')

    const genres = ['metal']
    const features = {
      energy: { min: 0.2, max: 0.7 },
      popularity: { min: 0.2, max: 0.7 }
    }

    const hasRequiredCriteria = track.hasRequiredCriteria({ features, genres })

    expect(hasRequiredCriteria).toBe(false)
    expect(spyHasFeatures).toHaveBeenCalledWith({ features })
    expect(spyHasGenres).toHaveBeenCalledWith({ genres })
  })
})
