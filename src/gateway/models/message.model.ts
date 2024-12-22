export enum MessageMethod {
  EMAIL = 'email',
  SMS = 'sms'
}

export interface Message {
  id: string
  method: MessageMethod
  recipient: string
  content: string
  subject?: string // For emails
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
