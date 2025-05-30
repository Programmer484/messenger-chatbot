import express, { Request, Response, NextFunction } from 'express';
import settings from './appConfig/settings';
import { verifyWebhook, handleWebhook } from './routes/webhookHandler';

// Environment variable sanity checks
['VERIFY_TOKEN', 'PAGE_ACCESS_TOKEN', 'OPENAI_API_KEY'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing. Please set it in your .env file.`);
  }
});

export function createServer() {
  const app = express();
  app.use(express.json());

  // Webhook endpoints
  app.get('/webhook', verifyWebhook);
  app.post('/webhook', handleWebhook);

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
  });

  return app;
} 