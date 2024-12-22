import { v4 as uuidv4 } from 'uuid'
import { Message, MessageMethod } from '../models/message.model'
import { KafkaService } from '../services/kafka.service'

export class MessageController {
  constructor(private kafkaService: KafkaService) {}

  async createMessage(req: any, res: any): Promise<void> {
    try {
      const message: Message = {
        id: uuidv4(),
        method: req.body.method,
        recipients: req.body.recipients,
        content: req.body.content,
        subject: req.body.subject,
        metadata: req.body.metadata,
        createdAt: new Date()
      }

      await this.kafkaService.publishMessage(message)

      res.status(202).json({
        messageId: message.id,
        status: 'accepted'
      })
    } catch (error) {
      res.status(500).json({
        error: 'Failed to process message'
      })
    }
  }
}
