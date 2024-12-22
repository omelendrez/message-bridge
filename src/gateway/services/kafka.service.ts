import { Kafka, Producer } from 'kafkajs'
import { Message } from '../models/message.model'

export class KafkaService {
  private producer: Producer

  constructor() {
    const kafka = new Kafka({
      clientId: 'message-gateway',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
    })
    this.producer = kafka.producer()
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      console.error('Failed to connect to Kafka:', error)
      throw new Error('Kafka connection failed')
    }
  }

  async publishMessage(message: Message): Promise<void> {
    try {
      await this.producer.send({
        topic: process.env.KAFKA_TOPIC || 'messages',
        messages: [
          {
            key: message.id,
            value: JSON.stringify(message)
          }
        ]
      })
    } catch (error) {
      console.error('Failed to publish message:', error)
      throw new Error('Message publishing failed')
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect()
    } catch (error) {
      console.error('Failed to disconnect from Kafka:', error)
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.producer.send({
        topic: process.env.KAFKA_TOPIC || 'messages',
        messages: [{ key: 'health-check', value: 'ping' }]
      })
      return true
    } catch (error) {
      console.error('Kafka health check failed:', error)
      return false
    }
  }
}
