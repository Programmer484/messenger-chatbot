"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_TOOLS = void 0;
exports.executeTool = executeTool;
const userModeration_1 = require("./userModeration");
exports.AI_TOOLS = [
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
async function executeTool(toolName, params) {
    switch (toolName) {
        case 'addStrike':
            return (0, userModeration_1.addStrike)(params.userId, params.reason);
        case 'getStrikes':
            return (0, userModeration_1.getStrikes)(params.userId);
        case 'hasExceededStrikes':
            return (0, userModeration_1.hasExceededStrikes)(params.userId);
        case 'resetStrikes':
            return (0, userModeration_1.resetStrikes)(params.userId);
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
