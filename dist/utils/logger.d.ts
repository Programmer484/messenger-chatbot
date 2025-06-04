import { APP_CONFIG } from '../appConfig';
type LogCategory = typeof APP_CONFIG.logging.availableCategories[number];
export declare const logger: {
    debug: (message: string, category?: LogCategory) => void;
    info: (message: string, category?: LogCategory) => void;
    warn: (message: string, category?: LogCategory) => void;
    error: (message: string, category?: LogCategory) => void;
};
export {};
