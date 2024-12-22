import { Counter } from 'prom-client'
import { MessageMethod } from '../models'

export class MetricsService {
  private messageCount = new Counter({
    name: 'processed_messages_total',
    help: 'Total messages processed'
  })

  trackMessage(method: MessageMethod, status: 'success' | 'failure') {
    this.messageCount.inc({ method, status })
  }
}
