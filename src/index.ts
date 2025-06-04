import { APP_CONFIG } from './appConfig';

console.log('Starting messenger chatbot...');
console.log(`Port: ${APP_CONFIG.server.port}`);
console.log(`Environment: ${APP_CONFIG.server.environment}`);

import('./server');