import nodemailer from 'nodemailer'
import { Message } from '../../shared/models'
import { withRetry } from '../utils/retry'
import { DeliveryError } from '../../shared/models/error.model'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async send(message: Message): Promise<void> {
    try {
      await withRetry(
        async () => {
          await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@example.com',
            to: message.recipients.join(','),
            subject: message.subject || 'No Subject',
            text: message.content,
            ...(message.metadata?.html && { html: message.metadata.html })
          })
        },
        3, // max attempts
        2000 // base delay in ms
      )
    } catch (error) {
      console.error('Failed to send email after retries:', error)
      throw new DeliveryError('Email sending failed permanently')
    }
  }
}
