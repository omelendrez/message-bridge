export class MessageError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message)
    this.name = 'MessageError'
  }
}

export class ValidationError extends MessageError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', false)
    this.name = 'ValidationError'
  }
}

export class DeliveryError extends MessageError {
  constructor(message: string) {
    super(message, 'DELIVERY_ERROR', true)
    this.name = 'DeliveryError'
  }
}
