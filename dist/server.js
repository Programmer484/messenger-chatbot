"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookHandler_1 = require("./routes/webhookHandler");
const appConfig_1 = require("./appConfig");
// Environment variable sanity checks
['VERIFY_TOKEN', 'PAGE_ACCESS_TOKEN', 'OPENAI_API_KEY'].forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`${key} is missing. Please set it in your .env file.`);
    }
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Webhook routes
app.get('/webhook', webhookHandler_1.verifyWebhook);
app.post('/webhook', webhookHandler_1.handleWebhook);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        environment: appConfig_1.APP_CONFIG.server.environment,
        timestamp: new Date().toISOString()
    });
});
const PORT = appConfig_1.APP_CONFIG.server.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${appConfig_1.APP_CONFIG.server.environment}`);
});
