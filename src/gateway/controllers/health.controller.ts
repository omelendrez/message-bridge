import { Request, Response } from 'express'
import { KafkaService } from '../services/kafka.service'
import { HealthCheckResponse } from '../types/api.types'

export class HealthController {
  constructor(private kafkaService: KafkaService) {}

  async check(req: Request, res: Response<HealthCheckResponse>): Promise<void> {
    const status = {
      kafka: await this.kafkaService.isHealthy(),
      timestamp: new Date()
    }
    res.json(status)
  }
}
