import { Message } from '../types';
import { systemPrompt, criteria } from '../appConfig/systemPrompt';
import { getContext, updateContext } from './conversationStore';
import { isStriked } from './userModeration';

/**
 * Prepares the conversation context for the AI, including:
 * 1. Checking if user is blocked
 * 2. Loading conversation history
 * 3. Adding system context (property details, criteria)
 * 4. Adding the user's message
 * 
 * @param senderId - The ID of the user
 * @param userMessage - The message from the user
 * @returns The prepared conversation messages
 */
export async function prepareConversation(senderId: string, userMessage: string): Promise<Message[]> {
  // Check if user is blocked
  if (isStriked(senderId)) {
    return [{
      role: 'system',
      content: 'This user has been blocked from using the service.'
    }];
  }

  // Get or initialize conversation context
  let messages = getContext(senderId);
  
  if (messages.length === 0) {
    messages = [{ 
      role: 'system', 
      content: `${systemPrompt}\n\nScreening Criteria:\n${JSON.stringify(criteria, null, 2)}`
    }];
  }

  // Add user message to context
  messages.push({ role: 'user', content: userMessage });

  // Update context with trimming
  updateContext(senderId, messages);

  return messages;
} 