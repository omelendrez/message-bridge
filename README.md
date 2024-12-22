# Message Bridge

A TypeScript-based message routing system that handles email and SMS communications through a microservices architecture. The system uses Apache Kafka for reliable message queuing and implements a gateway-processor pattern for scalable message handling.

## Features

- Asynchronous message processing
- Multiple delivery channels (Email, SMS)
- Retry mechanism with exponential backoff
- Health checks and monitoring
- Type-safe API with request validation
- Structured error handling
- Metrics collection

## Project Structure

```plaintext
message-bridge/
├── src/
│   ├── gateway/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/       # Kafka service
│   │   └── types/         # API type definitions
│   ├── processor/
│   │   ├── services/      # Email and SMS services
│   │   └── utils/         # Retry mechanism
│   └── shared/
│       ├── config/        # Configuration
│       ├── models/        # Shared types and errors
│       └── services/      # Logging and metrics
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

Required environment variables:

```env
# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=messages
KAFKA_GROUP_ID=message-processor

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@example.com

# SMS Configuration
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number

# Server Configuration
PORT=3000
NODE_ENV=development
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
    "priority": "high",
    "html": "<p>HTML content</p>"
  }
}
```

Response (202 Accepted):

```json
{
  "messageId": "uuid-v4",
  "status": "accepted"
}
```

### Health Check

`GET /health`

Response:

```json
{
  "kafka": true,
  "timestamp": "2024-02-28T12:00:00.000Z"
}
```

## Running the Services

Start Gateway:

```bash
npm run start:gateway
```

Start Processor:

```bash
npm run start:processor
```

## Docker Support

Build image:

```bash
docker build -t message-bridge .
```

Run container:

```bash
docker run -p 3000:3000 --env-file .env message-bridge
```

## Development

Build:

```bash
npm run build
```

Format code:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm run test
```

## License

MIT License
