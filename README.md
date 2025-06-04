# Messenger Chatbot

A Facebook Messenger chatbot that helps screen potential tenants for property rentals using AI.

## Project Structure

```
src/
├── appConfig/
│   └── constants.ts      # System prompts and configuration
├── bot/
│   ├── chatService.ts    # Main chat flow orchestrator
│   ├── aiClient.ts       # AI service communication
│   ├── conversationManager.ts  # Conversation context management
│   ├── conversationStore.ts    # Message history storage
│   ├── userModeration.ts       # User moderation system
│   └── aiTools.ts        # AI function definitions
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    └── helpers.ts        # Utility functions
```

## Core Components

### Bot Module (`/src/bot/`)

#### `chatService.ts`
- Orchestrates the AI interaction flow
- Handles the complete AI processing pipeline:
  1. Gets prepared messages from conversationManager
  2. Sends messages to AI for processing
  3. Manages tool calls and their results
  4. Gets final AI response
- Key function: `getChatGPTResponse(senderId, userMessage)`

#### `aiClient.ts`
- Handles direct communication with OpenAI's API
- Manages API calls, authentication, and error handling
- Configures model parameters and tool definitions
- Key function: `chatCompletion(messages, tools)`

#### `conversationManager.ts`
- Prepares the conversation context for each user
- Responsibilities:
  1. Checks if user is blocked
  2. Loads conversation history
  3. Adds system context (property details, criteria)
  4. Adds user messages
- Key function: `prepareConversation(senderId, userMessage)`

#### `conversationStore.ts`
- In-memory storage for conversation history
- Manages message trimming and context limits
- Functions:
  - `getContext(userId)`: Retrieves conversation history
  - `updateContext(userId, messages)`: Updates and trims history
  - `clearContext(userId)`: Clears conversation history

#### `userModeration.ts`
- Manages user strikes and blocking
- Tracks user violations and moderation status
- Functions:
  - `addStrike(userId, reason)`: Adds a strike
  - `getStrikes(userId)`: Gets strike count
  - `hasExceededStrikes(userId)`: Checks if blocked
  - `resetStrikes(userId)`: Resets strikes

#### `aiTools.ts`
- Defines available AI tools and their interfaces
- Manages tool execution and parameter validation
- Tools:
  - `addStrike`: Add user strikes
  - `getStrikes`: Check strike count
  - `hasExceededStrikes`: Check block status
  - `resetStrikes`: Reset user strikes

### Configuration (`/src/appConfig/`)

#### `constants.ts`
- System configuration and prompts
- Contains:
  - System prompt for AI behavior
  - Property listing details
  - Screening criteria
  - Default values and limits

### Types (`/src/types/`)

#### `index.ts`
- TypeScript type definitions
- Defines interfaces for:
  - Messages and conversations
  - Webhook requests/responses
  - Tool calls and responses
  - User data structures

### Utils (`/src/utils/`)

#### `helpers.ts`
- Shared utility functions
- Common operations and validations
- Message formatting and parsing

## Workflow

1. **Message Reception**
   ```
   User Message → Messenger API → Webhook Handler
   ```

2. **Conversation Preparation**
   ```
   Webhook Handler → chatService.ts
   ↓
   conversationManager.ts
   - Checks user status
   - Loads history
   - Adds context
   ```

3. **AI Processing**
   ```
   chatService.ts → aiClient.ts
   ↓
   OpenAI API
   - Processes message
   - May call tools
   ```

4. **Tool Execution** (if needed)
   ```
   AI Response → chatService.ts
   ↓
   aiTools.ts
   - Executes requested tool
   - Updates user status
   ```

5. **Response Generation**
   ```
   Tool Result → chatService.ts
   ↓
   Final AI Response
   ```

6. **Message Delivery**
   ```
   Final Response → Messenger API → User
   ```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PAGE_ACCESS_TOKEN`: Your Facebook Page access token

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run test`: Run tests

## Deployment

This project uses TypeScript and compiles to JavaScript for production deployment.

### Local Testing
```bash
# Build TypeScript files
npm run build

# Test the compiled application
npm start
```

### Render.com Deployment

The project is configured for deployment on Render.com with automatic builds:

**Build Process:**
1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript to JavaScript in `dist/` directory
3. `npm start` - Start the compiled application

**Configuration (render.yaml):**
```yaml
buildCommand: npm install && npm run build
startCommand: npm start
```

**Environment Variables (set in Render dashboard):**
- `VERIFY_TOKEN`: Facebook webhook verification token
- `PAGE_ACCESS_TOKEN`: Facebook Page access token  
- `OPENAI_API_KEY`: OpenAI API key

**Important Notes:**
- The `dist/` directory is excluded from git and generated during build
- All environment variables must be configured in the Render dashboard
- The application uses npm scripts which handle the compiled JavaScript files
- Use `npm start` (not direct node commands) to ensure proper script execution

## License

MIT 