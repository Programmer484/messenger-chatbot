import {addStrikes, resetStrikes} from './qualification/userModeration';
import { markQualified, submitAvailability } from './qualification/qualificationManager';
import { setUserData } from './qualification/userDataManager';
import { BOT_CONFIG } from './config/botConfig';

export const AI_TOOLS = [
  {
    name: 'addStrikes',
    description: 'Add strikes to a user for violations',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        count: { type: 'number', description: 'Number of strikes to add' },
        reason: { type: 'string', description: 'Reason for the strikes' }
      },
      required: ['userId', 'count', 'reason']
    }
  },
  {
    name: 'resetStrikes',
    description: 'Reset all strikes for a user',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' }
      },
      required: ['userId']
    }
  },
  {
    name: 'markQualified',
    description: 'Mark user as qualified for rental',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' }
      },
      required: ['userId']
    }
  },
  {
    name: 'submitAvailability',
    description: 'Submit user viewing availability times',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        times: { type: 'array', items: { type: 'string' }, description: 'Available viewing times' }
      },
      required: ['userId', 'times']
    }
  },
  {
    name: 'setUserData',
    description: 'Store user information - can set multiple fields at once',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        data: { 
          type: 'object', 
          description: `Object containing field-value pairs to set. Valid fields: ${Object.keys(BOT_CONFIG.userData.validFields).join(', ')}`,
          properties: Object.fromEntries(
            Object.entries(BOT_CONFIG.userData.validFields).map(([key, fieldConfig]) => [
              key, { 
                type: 'string', 
                description: `${fieldConfig.description}${
                  fieldConfig.validation.type === 'enum' 
                    ? `. Allowed values: ${fieldConfig.validation.values.join(', ')}` 
                    : fieldConfig.validation.type === 'date' && fieldConfig.validation.format
                    ? `. Required format: ${fieldConfig.validation.format}`
                    : ''
                }`
              }
            ])
          ),
          additionalProperties: false
        }
      },
      required: ['userId', 'data']
    }
  }
];

export async function executeTool(toolName: string, params: any): Promise<any> {
  switch (toolName) {
    case 'addStrikes': return addStrikes(params.userId, params.count, params.reason);
    case 'resetStrikes': return resetStrikes(params.userId);
    case 'markQualified': return markQualified(params.userId);
    case 'submitAvailability': return submitAvailability(params.userId, params.times);
    case 'setUserData': return setUserData(params.userId, params.data);
    default: throw new Error(`Unknown tool: ${toolName}`);
  }
}