import { EmailService } from '../email.service'
import { Message, MessageMethod } from '../../../shared/models'
import nodemailer from 'nodemailer'

jest.mock('nodemailer')

describe('EmailService', () => {
  let emailService: EmailService
  let mockTransporter: jest.Mocked<nodemailer.Transporter>

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn()
    } as any
    ;(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter)
    emailService = new EmailService()
  })

  it('should send email successfully', async () => {
    const message: Message = {
      id: '123',
      method: MessageMethod.EMAIL,
      recipients: ['test@example.com'],
      content: 'Test content',
      subject: 'Test subject',
      createdAt: new Date()
    }

    mockTransporter.sendMail.mockResolvedValue({})

    await emailService.send(message)

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: expect.any(String),
      to: 'test@example.com',
      subject: 'Test subject',
      text: 'Test content'
    })
  })

  it('should retry on failure and eventually succeed', async () => {
    const message: Message = {
      id: '123',
      method: MessageMethod.EMAIL,
      recipients: ['test@example.com'],
      content: 'Test content',
      createdAt: new Date()
    }

    mockTransporter.sendMail
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce({})

    await emailService.send(message)

    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2)
  })
})
