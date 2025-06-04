import { systemPrompt } from './config/systemPrompt';

// Message type for chat history
interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: {
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }[];
  tool_call_id?: string;
  name?: string;
}

const MAX_MESSAGES = 20;
const conversationContext = new Map<string, Message[]>();

function getContext(userId: string): Message[] {
  return conversationContext.get(userId) || [];
}

export function saveContext(userId: string, messages: Message[]): void {
  // Always keep the system message and trim to last N-1 messages
  const trimmedMessages = messages.length > MAX_MESSAGES 
    ? [messages[0], ...messages.slice(-(MAX_MESSAGES - 1))]
    : messages;
  
  conversationContext.set(userId, trimmedMessages);
}

export function clearContext(userId: string): void {
  conversationContext.delete(userId);
}

/**
 * Gets the chat history for the AI, including:
 * 1. Loading conversation history
 * 2. Adding system context with property details and screening criteria
 * 3. Adding the user's message
 * 
 * @param senderId - The ID of the user
 * @param userMessage - The message from the user
 * @returns The chat history messages for AI processing
 */
export function getChatHistory(senderId: string, userMessage: string): Message[] {
  // Get or initialize conversation context
  let messages = getContext(senderId);
  
  if (messages.length === 0) {
    messages = [{ 
      role: 'system', 
      content: systemPrompt
    }];
  }

  // Add user message to context (but don't save yet)
  messages.push({ role: 'user', content: userMessage });

  return messages;
} 