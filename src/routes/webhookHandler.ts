import { Request, Response, RequestHandler } from 'express';
import { sendMessage } from '../clients/messengerClient';
import { getAiResponse } from '../bot/chatService';
import { logger } from '../utils/logger';
import { APP_CONFIG } from '../appConfig';

// Webhook types - used only in this file
interface WebhookQuery {
  'hub.mode'?: string;
  'hub.verify_token'?: string;
  'hub.challenge'?: string;
}

interface WebhookBody {
  object: string;
  entry: Array<{
    messaging: Array<{
      sender: { id: string };
      message?: { text: string };
      postback?: { payload: string };
    }>;
  }>;
}


export const verifyWebhook: RequestHandler = (req: Request<{}, {}, {}, WebhookQuery>, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === APP_CONFIG.credentials.verifyToken) {
    logger.info('Webhook verified successfully', 'GENERAL');
    res.status(200).send(challenge);
  } else {
    logger.error('Webhook verification failed - invalid token or mode', 'GENERAL');
    res.sendStatus(403);
  }
};

export const handleWebhook: RequestHandler = async (req: Request<{}, WebhookBody>, res: Response) => {
  try {
    const body = req.body;

    if (body.object !== 'page') {
      logger.warn('Received webhook for non-page object', 'GENERAL');
      res.sendStatus(404);
      return;
    }

    // Iterate through all entries and messaging events
    for (const entry of body.entry) {
      for (const evt of entry.messaging) {
        logger.debug(`Received event: ${JSON.stringify(evt)}`, 'GENERAL');
    
        const senderId = evt.sender.id;
    
        if (evt.message && evt.message.text) {
          // Handle user text messages with AI
          logger.debug(`Processing text message from ${senderId}: ${evt.message.text}`, 'GENERAL');
          const AiResponse = await getAiResponse(senderId, evt.message.text);
          await sendMessage(senderId, AiResponse);
        } else if (evt.postback) {
          // Handle button postbacks - treat payload as user input
          logger.debug(`Processing postback from ${senderId}: ${evt.postback.payload}`, 'GENERAL');
          const AiResponse = await getAiResponse(senderId, evt.postback.payload);
          await sendMessage(senderId, AiResponse);
        } else {
          logger.debug(`Unhandled event type from ${senderId}: ${Object.keys(evt).join(', ')}`, 'GENERAL');
        }
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    logger.error(`Webhook processing error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GENERAL');
    res.sendStatus(500);
  }
}; 