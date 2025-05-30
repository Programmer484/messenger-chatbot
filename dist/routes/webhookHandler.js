"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const messenger_1 = require("../bot/messenger");
const chatService_1 = require("../bot/chatService");
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified');
        res.status(200).send(challenge);
    }
    else {
        console.error('Webhook verification failed');
        res.sendStatus(403);
    }
};
exports.verifyWebhook = verifyWebhook;
const handleWebhook = async (req, res) => {
    try {
        const body = req.body;
        if (body.object !== 'page') {
            res.sendStatus(404);
            return;
        }
        // Iterate through all entries and messaging events
        for (const entry of body.entry) {
            for (const evt of entry.messaging) {
                console.log('Event:', JSON.stringify(evt)); // Log all events
                const senderId = evt.sender.id;
                if (evt.message && evt.message.text) {
                    // Handle user text messages
                    const chatGPTResponse = await (0, chatService_1.getAiResponse)(senderId, evt.message.text);
                    await (0, messenger_1.sendMessage)(senderId, chatGPTResponse);
                }
                else if (evt.postback) {
                    // Handle button postbacks
                    await (0, messenger_1.sendMessage)(senderId, `Received your selection: ${evt.postback.payload}`);
                }
                else {
                    console.log('Unhandled event type:', evt);
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED');
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
