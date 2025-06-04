import { chatCompletion } from '../clients/openaiClient';
import { getChatHistory, saveContext } from './chatHistory';
import { executeTool, AI_TOOLS } from './aiTools';
import { BOT_CONFIG } from './config/botConfig';
import { hasExceededStrikes } from './qualification/userModeration';

export async function getAiResponse(senderId: string, userMessage: string): Promise<string> {
  try {
    // Check if user is blocked before processing
    if (hasExceededStrikes(senderId)) {
      return BOT_CONFIG.responses.blockedUser;
    }

    const messages = getChatHistory(senderId, userMessage);
    const response = await chatCompletion(messages, AI_TOOLS);
    
    messages.push(response);
    let finalContent = response.content;
    
    // Handle tool calls if present
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const params = JSON.parse(toolCall.function.arguments);
      params.userId = senderId; // Manually set userId for AI
      
      const toolResult = await executeTool(toolCall.function.name, params);
      
      // Add tool result
      messages.push({
        role: 'tool',
        content: toolResult !== undefined ? JSON.stringify(toolResult) : "null",
        tool_call_id: toolCall.id
      });

      // Get final response
      const finalResponse = await chatCompletion(messages, AI_TOOLS);
      messages.push(finalResponse);
      finalContent = finalResponse.content;
    }
    
    // Save conversation and return
    saveContext(senderId, messages);
    return finalContent || BOT_CONFIG.responses.noResponse;
    
  } catch (error) {
    console.error('Error getting ChatGPT response:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 