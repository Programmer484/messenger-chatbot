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
    description: 'Store collected user information',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        field: { type: 'string', enum: Object.keys(BOT_CONFIG.userData.validFields), description: 'Data field name' },
        value: { type: 'string', description: 'Field value' }
      },
      required: ['userId', 'field', 'value']
    }
  }
];

export async function executeTool(toolName: string, params: any): Promise<any> {
  switch (toolName) {
    case 'addStrikes': return addStrikes(params.userId, params.count, params.reason);
    case 'resetStrikes': return resetStrikes(params.userId);
    case 'markQualified': return markQualified(params.userId);
    case 'submitAvailability': return submitAvailability(params.userId, params.times);
    case 'setUserData': return setUserData(params.userId, params.field, params.value);
    default: throw new Error(`Unknown tool: ${toolName}`);
  }
} 