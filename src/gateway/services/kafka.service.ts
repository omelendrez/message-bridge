import { Kafka, Producer } from 'kafkajs'
import { Message } from '../models/message.model'

export class KafkaService {
  private producer: Producer

  constructor() {
    const kafka = new Kafka({
      clientId: 'message-gateway',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    })
    this.producer = kafka.producer()
  }

  async connect(): Promise<void> {
    await this.producer.connect()
  }

  async publishMessage(message: Message): Promise<void> {
    try {
      await this.producer.send({
        topic: 'messages',
        messages: [
          {
            key: message.id,
            value: JSON.stringify(message)
          }
        ]
      })
    } catch (error) {
      console.error('Error publishing message:', error)
      throw error
    }
  }
}
