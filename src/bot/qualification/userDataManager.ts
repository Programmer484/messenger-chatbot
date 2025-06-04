import { BOT_CONFIG, UserDataField } from '../config/botConfig';
import { logger } from '../../utils/logger';

// User data storage (using Map for in-memory storage)
const userDataStorage = new Map<string, Partial<Record<UserDataField, string>>>();

// Set user data for a specific field
export function setUserData(userId: string, field: UserDataField, value: string): boolean {
  logger.debug(`Setting ${field} for user ${userId}: ${value}`, 'USER_DATA');
  
  if (!BOT_CONFIG.userData.validFields[field]) {
    throw new Error(`Invalid field: ${field}. Valid fields: ${Object.keys(BOT_CONFIG.userData.validFields).join(', ')}`);
  }
  
  const existing = userDataStorage.get(userId) || {};
  
  userDataStorage.set(userId, {
    ...existing,
    [field]: value
  });

  return true;
}

export function getUserData(userId: string, field?: UserDataField): any {
  const userData = userDataStorage.get(userId);
  
  if (!userData) {
    return field ? null : {};
  }

  if (field) {
    return userData[field] || null;
  }

  return userData;
} 