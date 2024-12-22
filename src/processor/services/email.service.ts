import nodemailer from 'nodemailer'
import { Message } from '../models/message.model'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async send(message: Message): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: message.recipient,
      subject: message.subject,
      text: message.content
    })
  }
}
