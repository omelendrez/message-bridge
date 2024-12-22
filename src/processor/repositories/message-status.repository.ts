import { MessageStatus } from '../../gateway/models/message.model'

export class MessageStatusRepository {
  private messageStatuses: Map<string, MessageStatus> = new Map()

  async save(status: MessageStatus): Promise<void> {
    this.messageStatuses.set(status.messageId, status)
  }

  async getAttempts(messageId: string): Promise<number> {
    return this.messageStatuses.get(messageId)?.attempts || 0
  }
}
