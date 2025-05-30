import { addStrike, getStrikes, hasExceededStrikes, resetStrikes } from './userModeration';

export interface AITool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export const AI_TOOLS: AITool[] = [
  {
    name: 'addStrike',
    description: 'Add a strike to a user for violating rules or asking redundant questions',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user to add a strike to'
        },
        reason: {
          type: 'string',
          description: 'The reason for adding the strike'
        }
      },
      required: ['userId', 'reason']
    }
  },
  {
    name: 'getStrikes',
    description: 'Get the number of strikes a user has',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user to check'
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'hasExceededStrikes',
    description: 'Check if a user has exceeded the strike limit',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user to check'
        }
      },
      required: ['userId']
    }
  },
  {
    name: 'resetStrikes',
    description: 'Reset strikes for a user',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user to reset strikes for'
        }
      },
      required: ['userId']
    }
  }
];

export async function executeTool(toolName: string, params: any): Promise<any> {
  switch (toolName) {
    case 'addStrike':
      return addStrike(params.userId, params.reason);
    case 'getStrikes':
      return getStrikes(params.userId);
    case 'hasExceededStrikes':
      return hasExceededStrikes(params.userId);
    case 'resetStrikes':
      return resetStrikes(params.userId);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
} 