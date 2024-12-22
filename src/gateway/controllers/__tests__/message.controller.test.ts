import { MessageController } from '../message.controller'
import { KafkaService } from '../../services/kafka.service'
import { Request, Response } from 'express'
import { CreateMessageRequest } from '../../types/api.types'
import { MessageMethod } from '../../../shared/models'

describe('MessageController', () => {
  let controller: MessageController
  let mockKafkaService: jest.Mocked<KafkaService>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let jsonMock: jest.Mock
  let statusMock: jest.Mock

  beforeEach(() => {
    mockKafkaService = {
      publishMessage: jest.fn()
    } as any

    jsonMock = jest.fn()
    statusMock = jest.fn().mockReturnValue({ json: jsonMock })
    mockResponse = {
      status: statusMock,
      json: jsonMock
    }

    controller = new MessageController(mockKafkaService)
  })

  it('should create message and return 202 status', async () => {
    const messageRequest: CreateMessageRequest = {
      method: MessageMethod.EMAIL,
      recipients: ['test@example.com'],
      content: 'Test content',
      subject: 'Test subject'
    }

    mockRequest = {
      body: messageRequest
    }

    await controller.createMessage(
      mockRequest as Request,
      mockResponse as Response
    )

    expect(mockKafkaService.publishMessage).toHaveBeenCalled()
    expect(statusMock).toHaveBeenCalledWith(202)
    expect(jsonMock).toHaveBeenCalledWith({
      messageId: expect.any(String),
      status: 'accepted'
    })
  })

  it('should return 500 when message creation fails', async () => {
    mockKafkaService.publishMessage.mockRejectedValue(new Error('Kafka error'))

    mockRequest = {
      body: {} as CreateMessageRequest
    }

    await controller.createMessage(
      mockRequest as Request,
      mockResponse as Response
    )

    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Failed to process message'
    })
  })
})
