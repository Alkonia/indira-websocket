# WhatsApp Automation with WebSockets

This project focuses on creating automations by connecting to a WhatsApp websocket and sending different events. It uses the Baileys library to establish connections with WhatsApp, WebSockets for real-time communication, and MongoDB for storing messages and sessions.

## Features

- WhatsApp connection through the Baileys library
- WebSocket server for real-time communication and automation
- REST API for WhatsApp interaction
- Event-based automation system
- Message and session storage in MongoDB
- Web interface for message visualization and sending

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- Internet connection for WhatsApp

## Installation

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following configuration:

```
PORT=3000
WS_PORT=8080
MONGODB_URI=mongodb://localhost:27017/whatsapp_db
```

## Build

To compile the TypeScript project:

```bash
npm run build
```

## Execution

To start the server in development mode:

```bash
npm run dev
```

To start the server in production mode:

```bash
npm run build
npm start
```

## Usage

### Web Interface

1. Open your browser and visit `http://localhost:3000`
2. Click on "Connect WebSocket"
3. Once connected, click on "Connect WhatsApp"
4. Scan the QR code that will appear in the terminal
5. Once connected, you can send messages and create automations from the web interface

### REST API

The server exposes the following endpoints:

- `GET /api/whatsapp/status` - Get connection status
- `POST /api/whatsapp/connect` - Start WhatsApp connection
- `POST /api/whatsapp/send/text` - Send text message
- `POST /api/whatsapp/send/media` - Send multimedia message
- `POST /api/whatsapp/logout` - Log out from WhatsApp
- `POST /api/automation/create` - Create a new automation

### WebSocket and Automation Events

The WebSocket server listens on port 8080 and accepts the following messages for automation and direct interaction:

```javascript
// Connect to WhatsApp
{
  "type": "whatsapp",
  "action": "connect",
  "payload": {}
}

// Send text message
{
  "type": "whatsapp",
  "action": "send_message",
  "payload": {
    "to": "5219991234567@s.whatsapp.net",
    "text": "Hello, world!"
  }
}

// Send multimedia message
{
  "type": "whatsapp",
  "action": "send_message",
  "payload": {
    "to": "5219991234567@s.whatsapp.net",
    "media": {
      "url": "https://example.com/image.jpg",
      "caption": "My image",
      "type": "image" // "image", "video" or "document"
    }
  }
}

// Create automation
{
  "type": "automation",
  "action": "create",
  "payload": {
    "trigger": "message_received",
    "conditions": {
      "contains": "hello"
    },
    "actions": [
      {
        "type": "send_message",
        "to": "{{sender}}",
        "text": "Thanks for your message!"
      }
    ]
  }
}

// Log out
{
  "type": "whatsapp",
  "action": "logout",
  "payload": {}
}
```

## Project Structure

```
├── public/                 # Static files
│   └── index.html          # Web interface
├── src/
│   ├── config/             # Configuration
│   │   └── env.ts          # Environment variables
│   ├── controllers/        # Controllers
│   │   ├── whatsapp.controller.ts
│   │   └── automation.controller.ts
│   ├── models/             # Data models
│   │   ├── message.model.ts
│   │   └── automation.model.ts
│   ├── routes/             # API routes
│   │   ├── whatsapp.routes.ts
│   │   └── automation.routes.ts
│   ├── services/           # Services
│   │   ├── database.ts     # MongoDB connection
│   │   ├── whatsapp.ts     # WhatsApp service
│   │   ├── websocket.ts    # WebSocket service
│   │   └── automation.ts   # Automation service
│   └── index.ts            # Entry point
├── .env                    # Environment variables (create manually)
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## License

ISC
