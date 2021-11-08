import Mutex from '../../../../lib/helpers/mutex/Mutex'

describe('constructor', () => {
  test('should set ttl', () => {
    const mutex = new Mutex(3600)

    expect(mutex.ttl).toBe(3600)
  })
})

describe('lock', () => {
  test('should call handler', async () => {
    const handler = jest.fn().mockResolvedValue('hello 1')

    const mutex = new Mutex(3600)
    const result = await mutex.lock(handler)

    expect(result).toBe('hello 1')
  })

  test('should be locked', async () => {
    const handle1 = jest.fn().mockResolvedValue('hello 1')
    const handle2 = jest.fn().mockResolvedValue('hello 2')

    const mutex = new Mutex(3600)
    const result1 = await mutex.lock(handle1)
    const result2 = await mutex.lock(handle2)

    expect(result1).toBe('hello 1')
    expect(result2).toBe('hello 1')
  })

  test('should be unlocked', async () => {
    const handle1 = jest.fn().mockResolvedValue('hello 1')
    const handle2 = jest.fn().mockResolvedValue('hello 2')

    const mutex = new Mutex(-1)
    const result1 = await mutex.lock(handle1)
    const result2 = await mutex.lock(handle2)

    expect(result1).toBe('hello 1')
    expect(result2).toBe('hello 2')
  })
})
