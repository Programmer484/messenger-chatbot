import axios from 'axios';
import { Message } from '../types';
import { AITool } from './aiTools';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function chatCompletion(messages: Message[], tools?: AITool[]): Promise<Message> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages,
        tools: tools ? tools.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
          }
        })) : undefined,
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message;
  } catch (error) {
    console.error('Error calling OpenAI:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 