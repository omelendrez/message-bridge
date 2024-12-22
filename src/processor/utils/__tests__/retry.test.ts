import { withRetry, RetryError } from '../retry'

describe('withRetry', () => {
  it('should execute operation successfully on first try', async () => {
    const operation = jest.fn().mockResolvedValue('success')

    const result = await withRetry(operation)

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should retry failed operation and eventually succeed', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce('success')

    const result = await withRetry(operation, 3, 100)

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('should throw RetryError after max attempts', async () => {
    const operation = jest
      .fn()
      .mockRejectedValue(new Error('Persistent failure'))

    await expect(withRetry(operation, 3, 100)).rejects.toThrow(RetryError)
    expect(operation).toHaveBeenCalledTimes(3)
  })
})
