import twilio from 'twilio'
import { Message } from '../../shared/models'
import { withRetry } from '../utils/retry'
import { DeliveryError } from '../../shared/models/error.model'

export class SmsService {
  private client: twilio.Twilio

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }

  async send(message: Message): Promise<void> {
    try {
      await withRetry(
        async () => {
          await Promise.all(
            message.recipients.map((recipient) =>
              this.client.messages.create({
                body: message.content,
                to: recipient,
                from: process.env.TWILIO_PHONE_NUMBER
              })
            )
          )
        },
        3, // max attempts
        2000 // base delay in ms
      )
    } catch (error) {
      console.error('Failed to send SMS after retries:', error)
      throw new DeliveryError('SMS sending failed permanently')
    }
  }
}
