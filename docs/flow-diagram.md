# Message Bridge Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Kafka
    participant Processor
    participant EmailService
    participant SMSService
    participant StatusRepo

    Client->>Gateway: POST /api/messages
    Note over Gateway: Validate message
    Gateway->>Gateway: Generate UUID
    Gateway->>Kafka: Publish message
    Gateway-->>Client: 202 Accepted

    Kafka->>Processor: Consume message
    Processor->>StatusRepo: Update status (pending)

    alt Email Message
        Processor->>EmailService: Send email
        EmailService-->>Processor: Success/Failure
    else SMS Message
        Processor->>SMSService: Send SMS
        SMSService-->>Processor: Success/Failure
    end

    alt Success
        Processor->>StatusRepo: Update status (delivered)
    else Failure
        Note over EmailService,SMSService: Retry with exponential backoff
        Processor->>StatusRepo: Update status (failed)
    end
```

## Component Responsibilities

### Gateway Service

- Validates incoming messages
- Generates unique message IDs
- Publishes to Kafka queue
- Returns immediate acknowledgment

### Message Processor

- Consumes messages from Kafka
- Routes to appropriate delivery service
- Manages message status
- Handles retries and failures

### Delivery Services

- Email Service: Handles email delivery via SMTP
- SMS Service: Handles SMS delivery via Twilio
- Both implement retry mechanism

### Status Repository

- Tracks message delivery status
- Maintains attempt counts
- Records error information
