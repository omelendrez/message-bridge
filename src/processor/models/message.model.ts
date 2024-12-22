export enum MessageMethod {
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

export interface Message {
  id: string
  method: MessageMethod
  recipients: string[]
  content: string
  subject?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface MessageStatus {
  messageId: string
  status: 'pending' | 'delivered' | 'failed'
  attempts: number
  error?: string
  updatedAt: Date
}
