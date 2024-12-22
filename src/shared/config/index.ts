export const config = {
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    topic: process.env.KAFKA_TOPIC || 'messages',
    groupId: process.env.KAFKA_GROUP_ID || 'message-processor'
  },
  email: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587
    // ...
  }
}
