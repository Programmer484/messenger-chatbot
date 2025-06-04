import axios from 'axios';
import { APP_CONFIG } from '../appConfig';

// Types used for OpenAI chat completions
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

interface AITool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function chatCompletion(messages: Message[], tools?: AITool[]): Promise<Message> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages,
        tools: tools?.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          }
        })),
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_CONFIG.credentials.openaiApiKey}`,
        }
      }
    );
    return response.data.choices[0].message;
  } catch (error) {
    console.error('Error calling OpenAI:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 