import mongoose from 'mongoose'
import Service from '../../../lib/services/entities/Service'

describe('denormalize', () => {
  test('set ObjectId as string deeply', () => {
    const hexString = '000000000000000000000001'
    const objectId = new mongoose.Types.ObjectId(hexString)

    const data = {
      _id: objectId,
      ref: objectId,
      string: 'hello',
      number: 42,
      object: { _id: objectId, string: 'hello', number: 42 },
      array: [objectId, objectId]
    }

    const expected = {
      id: hexString,
      ref: hexString,
      string: 'hello',
      number: 42,
      object: { id: hexString, string: 'hello', number: 42 },
      array: [hexString, hexString]
    }

    const result = Service.denormalize(data)

    expect(result).toEqual(expected)
  })
})
