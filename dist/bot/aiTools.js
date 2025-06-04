"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_TOOLS = void 0;
exports.executeTool = executeTool;
const userModeration_1 = require("./qualification/userModeration");
const qualificationManager_1 = require("./qualification/qualificationManager");
const userDataManager_1 = require("./qualification/userDataManager");
const botConfig_1 = require("./config/botConfig");
exports.AI_TOOLS = [
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
                field: { type: 'string', enum: Object.keys(botConfig_1.BOT_CONFIG.userData.validFields), description: 'Data field name' },
                value: { type: 'string', description: 'Field value' }
            },
            required: ['userId', 'field', 'value']
        }
    }
];
async function executeTool(toolName, params) {
    switch (toolName) {
        case 'addStrikes': return (0, userModeration_1.addStrikes)(params.userId, params.count, params.reason);
        case 'resetStrikes': return (0, userModeration_1.resetStrikes)(params.userId);
        case 'markQualified': return (0, qualificationManager_1.markQualified)(params.userId);
        case 'submitAvailability': return (0, qualificationManager_1.submitAvailability)(params.userId, params.times);
        case 'setUserData': return (0, userDataManager_1.setUserData)(params.userId, params.field, params.value);
        default: throw new Error(`Unknown tool: ${toolName}`);
    }
}
