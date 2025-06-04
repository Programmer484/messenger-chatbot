"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Load environment variables once
const env = {
    // Required secrets
    PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // Optional settings with defaults
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '3000',
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || '5000',
    LOG_LEVEL: process.env.LOG_LEVEL || 'DEBUG'
};
// Technical application configuration
// These are system-level settings that developers manage
exports.APP_CONFIG = {
    // Server settings
    server: {
        port: parseInt(env.PORT),
        requestTimeout: parseInt(env.REQUEST_TIMEOUT),
        environment: env.NODE_ENV
    },
    // API credentials
    credentials: {
        pageAccessToken: env.PAGE_ACCESS_TOKEN,
        verifyToken: env.VERIFY_TOKEN,
        openaiApiKey: env.OPENAI_API_KEY
    },
    // Logging configuration (developer tools)
    logging: {
        level: env.LOG_LEVEL,
        // Categories to show (developer debugging preference)
        enabledCategories: ['USER_DATA', 'STRIKES', 'QUALIFICATION', 'GENERAL'],
        // Available categories (for reference)
        availableCategories: ['USER_DATA', 'STRIKES', 'QUALIFICATION', 'GENERAL']
    },
    // Development/debugging tools
    development: {
        enableDebugLogs: env.NODE_ENV === 'development',
        mockExternalCalls: false
    }
};
