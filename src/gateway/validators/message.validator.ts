import { z } from 'zod'

export const messageSchema = z.object({
  method: z.enum(['EMAIL', 'SMS']),
  recipients: z.array(z.string().email()),
  content: z.string().min(1),
  subject: z.string().optional()
})
