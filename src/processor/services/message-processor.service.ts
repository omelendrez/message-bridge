import { Kafka, Consumer } from 'kafkajs'
import { EmailService } from './email.service'
import { SmsService } from './sms.service'
import { Message, MessageMethod, MessageStatus } from '../models/message.model'
import { MessageStatusRepository } from '../repositories/message-status.repository'

export class MessageProcessorService {
  private consumer: Consumer

  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private statusRepository: MessageStatusRepository
  ) {
    const kafka = new Kafka({
      clientId: 'message-processor',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    })
    this.consumer = kafka.consumer({ groupId: 'message-processor-group' })
  }

  async start(): Promise<void> {
    await this.consumer.connect()
    await this.consumer.subscribe({ topic: 'messages' })

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const messageData: Message = JSON.parse(message.value?.toString() || '')
        await this.processMessage(messageData)
      }
    })
  }

  private async processMessage(message: Message): Promise<void> {
    try {
      await this.updateMessageStatus(message.id, 'pending')

      switch (message.method) {
        case MessageMethod.EMAIL:
          await this.emailService.send(message)
          break
        case MessageMethod.SMS:
          await this.smsService.send(message)
          break
        default:
          throw new Error(`Unsupported message method: ${message.method}`)
      }

      await this.updateMessageStatus(message.id, 'delivered')
    } catch (error) {
      console.error(`Failed to process message ${message.id}:`, error)
      await this.updateMessageStatus(message.id, 'failed', error.message)
    }
  }

  private async updateMessageStatus(
    messageId: string,
    status: 'pending' | 'delivered' | 'failed',
    error?: string
  ): Promise<void> {
    const messageStatus: MessageStatus = {
      messageId,
      status,
      attempts: (await this.statusRepository.getAttempts(messageId)) + 1,
      error,
      updatedAt: new Date()
    }
    await this.statusRepository.save(messageStatus)
  }
}
