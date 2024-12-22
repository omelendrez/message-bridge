import { MessageMethod } from '../../shared/models'

export interface CreateMessageRequest {
  method: MessageMethod
  recipients: string[]
  content: string
  subject?: string
  metadata?: Record<string, any>
}

export interface CreateMessageResponse {
  messageId: string
  status: 'accepted'
}

export interface ErrorResponse {
  error: string
}

export interface HealthCheckResponse {
  kafka: boolean
  timestamp: Date
}
