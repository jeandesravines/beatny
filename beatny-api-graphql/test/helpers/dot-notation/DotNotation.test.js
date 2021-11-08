import DotNotation from '../../../lib/helpers/dot-notation/DotNotation'

describe('toPaths', () => {
  test('should transform an object to its dot notation form', () => {
    const input = {
      title: 'Title',
      artist: 'Artist',
      array: ['alternative-dance', 'electronic'],
      object: {
        popularity: 0.7,
        valence: 0.014
      },
      deep: {
        object: {
          popularity: 0.7,
          valence: 0.014
        }
      }
    }

    const result = DotNotation.toPaths(input)

    expect(result).toEqual({
      title: 'Title',
      artist: 'Artist',
      array: ['alternative-dance', 'electronic'],
      'object.popularity': 0.7,
      'object.valence': 0.014,
      'deep.object.popularity': 0.7,
      'deep.object.valence': 0.014
    })
  })
})

describe('toObject', () => {
  test('should denormalize dot notation form object', () => {
    const input = {
      title: 'Title',
      artist: 'Artist',
      array: ['alternative-dance', 'electronic'],
      'object.popularity': 0.7,
      'object.valence': 0.014,
      'deep.object.popularity': 0.7,
      'deep.object.valence': 0.014
    }

    const result = DotNotation.toObject(input)

    expect(result).toEqual({
      title: 'Title',
      artist: 'Artist',
      array: ['alternative-dance', 'electronic'],
      object: {
        popularity: 0.7,
        valence: 0.014
      },
      deep: {
        object: {
          popularity: 0.7,
          valence: 0.014
        }
      }
    })
  })
})
