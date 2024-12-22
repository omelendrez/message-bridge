# Message Bridge

A TypeScript-based message routing system that handles email and SMS communications through a microservices architecture. The system uses Apache Kafka for reliable message queuing and implements a gateway-processor pattern for scalable message handling.

## System Overview

### Gateway Service

- Receives message requests via REST API
- Validates and processes incoming messages
- Generates unique message IDs using UUID
- Publishes messages to Kafka queue

### Message Processor

- Consumes messages from Kafka queue
- Routes messages to appropriate delivery service
- Handles email delivery via Email Service
- Manages SMS delivery via SMS Service

## Project Structure

```plaintext
message-bridge/
├── src/
│ ├── gateway/
│ │ ├── controllers/
│ │ │ └── message.controller.ts # Handles incoming message requests
│ │ ├── models/
│ │ │ └── message.model.ts # Message type definitions
│ │ └── services/
│ │ └── kafka.service.ts # Kafka integration
│ └── processor/
│ └── services/
│ ├── email.service.ts # Email delivery service
│ ├── sms.service.ts # SMS delivery service
│ └── message-processor.service.ts # Main processing logic
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd message-bridge
```

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables:

```bash
cp .env.example .env
```

## Configuration

Create a `.env` file with the following variables:

```env
# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=messages

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password

# SMS Configuration
SMS_API_KEY=your-api-key
SMS_API_SECRET=your-secret
```

## API Reference

### Send Message

`POST /api/messages`

Request Body:

```json
{
  "method": "EMAIL",
  "recipients": ["user@example.com"],
  "subject": "Hello",
  "content": "Message content",
  "metadata": {
    "priority": "high"
  }
}
```

Response:

```json
{
  "messageId": "uuid-v4",
  "status": "accepted"
}
```

### Message Methods

- `EMAIL`: Send via email service
- `SMS`: Send via SMS service

## Running the Services

Start Gateway:

```bash
npm run start:gateway
```

Start Processor:

```bash
npm run start:processor
```

## Dependencies

Key dependencies from package.json:

- TypeScript
- Kafka.js for Kafka integration
- UUID for message ID generation
- Express (assumed for API)
- Nodemailer (assumed for email service)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
