import { chatCompletion } from './aiClient';
import { prepareConversation } from './conversationManager';
import { executeTool, AI_TOOLS } from './aiTools';

export async function getAiResponse(senderId: string, userMessage: string): Promise<string> {
  try {
    const messages = await prepareConversation(senderId, userMessage);
    const response = await chatCompletion(messages, AI_TOOLS);

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const toolResult = await executeTool(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      );

      messages.push(response);
      messages.push({
        role: 'tool',
        content: JSON.stringify(toolResult),
        tool_call_id: toolCall.id
      });

      return response.content || 'I apologize, but I cannot continue this conversation.';
    }

    return response.content || 'I apologize, but I cannot continue this conversation.';
  } catch (error) {
    console.error('Error getting ChatGPT response:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 