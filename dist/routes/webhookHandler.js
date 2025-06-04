"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const messengerClient_1 = require("../clients/messengerClient");
const chatService_1 = require("../bot/chatService");
const logger_1 = require("../utils/logger");
const appConfig_1 = require("../appConfig");
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === appConfig_1.APP_CONFIG.credentials.verifyToken) {
        logger_1.logger.info('Webhook verified successfully', 'GENERAL');
        res.status(200).send(challenge);
    }
    else {
        logger_1.logger.error('Webhook verification failed - invalid token or mode', 'GENERAL');
        res.sendStatus(403);
    }
};
exports.verifyWebhook = verifyWebhook;
const handleWebhook = async (req, res) => {
    try {
        const body = req.body;
        if (body.object !== 'page') {
            logger_1.logger.warn('Received webhook for non-page object', 'GENERAL');
            res.sendStatus(404);
            return;
        }
        // Iterate through all entries and messaging events
        for (const entry of body.entry) {
            for (const evt of entry.messaging) {
                logger_1.logger.debug(`Received event: ${JSON.stringify(evt)}`, 'GENERAL');
                const senderId = evt.sender.id;
                if (evt.message && evt.message.text) {
                    // Handle user text messages with AI
                    logger_1.logger.debug(`Processing text message from ${senderId}: ${evt.message.text}`, 'GENERAL');
                    const AiResponse = await (0, chatService_1.getAiResponse)(senderId, evt.message.text);
                    await (0, messengerClient_1.sendMessage)(senderId, AiResponse);
                }
                else if (evt.postback) {
                    // Handle button postbacks - treat payload as user input
                    logger_1.logger.debug(`Processing postback from ${senderId}: ${evt.postback.payload}`, 'GENERAL');
                    const AiResponse = await (0, chatService_1.getAiResponse)(senderId, evt.postback.payload);
                    await (0, messengerClient_1.sendMessage)(senderId, AiResponse);
                }
                else {
                    logger_1.logger.debug(`Unhandled event type from ${senderId}: ${Object.keys(evt).join(', ')}`, 'GENERAL');
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED');
    }
    catch (error) {
        logger_1.logger.error(`Webhook processing error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERAL');
        res.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
