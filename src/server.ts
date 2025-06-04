import express from 'express';
import { verifyWebhook, handleWebhook } from './routes/webhookHandler';
import { APP_CONFIG } from './appConfig';

// Environment variable sanity checks
['VERIFY_TOKEN', 'PAGE_ACCESS_TOKEN', 'OPENAI_API_KEY'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing. Please set it in your .env file.`);
  }
});

const app = express();
app.use(express.json());

// Webhook routes
app.get('/webhook', verifyWebhook);
app.post('/webhook', handleWebhook);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    environment: APP_CONFIG.server.environment,
    timestamp: new Date().toISOString()
  });
});

const PORT = APP_CONFIG.server.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${APP_CONFIG.server.environment}`);
}); 