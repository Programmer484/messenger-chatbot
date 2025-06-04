import { APP_CONFIG } from '../appConfig';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
type LogCategory = typeof APP_CONFIG.logging.availableCategories[number];

const logLevels: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const logMethods: Record<LogLevel, typeof console.log> = {
  DEBUG: console.log,
  INFO: console.log,
  WARN: console.warn,
  ERROR: console.error
};

function shouldLog(level: LogLevel, category: LogCategory): boolean {
  return logLevels[level] >= logLevels[APP_CONFIG.logging.level] && 
         APP_CONFIG.logging.enabledCategories.includes(category);
}

function createLogFunction(level: LogLevel) {
  return (message: string, category: LogCategory = 'GENERAL') => {
    if (shouldLog(level, category)) {
      logMethods[level](`[${level}:${category}] ${message}`);
    }
  };
}

export const logger = {
  debug: createLogFunction('DEBUG'),
  info: createLogFunction('INFO'),
  warn: createLogFunction('WARN'),
  error: createLogFunction('ERROR')
}; 