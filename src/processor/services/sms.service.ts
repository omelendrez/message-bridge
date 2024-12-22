import twilio from 'twilio'
import { Message } from '../../gateway/models/message.model'

export class SmsService {
  private client: twilio.Twilio

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }

  async send(message: Message): Promise<void> {
    // Send to all recipients in parallel
    await Promise.all(
      message.recipients.map((recipient) =>
        this.client.messages.create({
          body: message.content,
          to: recipient,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      )
    )
  }
}
