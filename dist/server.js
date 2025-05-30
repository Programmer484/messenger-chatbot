"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const webhookHandler_1 = require("./routes/webhookHandler");
// Environment variable sanity checks
['VERIFY_TOKEN', 'PAGE_ACCESS_TOKEN', 'OPENAI_API_KEY'].forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`${key} is missing. Please set it in your .env file.`);
    }
});
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Webhook endpoints
    app.get('/webhook', webhookHandler_1.verifyWebhook);
    app.post('/webhook', webhookHandler_1.handleWebhook);
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Unhandled error:', err);
        res.status(500).send('Internal Server Error');
    });
    return app;
}
