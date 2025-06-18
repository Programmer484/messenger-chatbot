import { BOT_CONFIG, UserDataField, FieldValidation } from '../config/botConfig';
import { logger } from '../../utils/logger';

// User data storage (using Map for in-memory storage)
const userDataStorage = new Map<string, Partial<Record<UserDataField, string>>>();

// Unified function for setting user data (handles both single field and multiple fields)
export function setUserData(userId: string, data: Record<string, string>): { success: boolean, fieldsSet: string[], errors?: string[] };
export function setUserData(userId: string, field: UserDataField, value: string): boolean;
export function setUserData(userId: string, fieldOrData: UserDataField | Record<string, string>, value?: string): boolean | { success: boolean, fieldsSet: string[], errors?: string[] } {
  // Normalize to data object format
  const data = typeof fieldOrData === 'string' ? { [fieldOrData]: value! } : fieldOrData;
  const isSingleField = typeof fieldOrData === 'string';
  
  const fieldsSet: string[] = [];
  const errors: string[] = [];
  
  for (const [field, fieldValue] of Object.entries(data)) {
    try {
      validateAndStore(userId, field as UserDataField, fieldValue);
      fieldsSet.push(field);
    } catch (error) {
      const errorMsg = `Failed to set ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      
      // For single field, throw immediately
      if (isSingleField) throw error;
    }
  }
  
  return isSingleField ? true : {
    success: errors.length === 0,
    fieldsSet,
    ...(errors.length > 0 && { errors })
  };
}

// Helper function for validation and storage
function validateAndStore(userId: string, field: UserDataField, value: string): void {
  logger.debug(`Setting ${field} for user ${userId}: ${value}`, 'USER_DATA');
  
  const fieldConfig = BOT_CONFIG.userData.validFields[field];
  if (!fieldConfig) {
    throw new Error(`Invalid field: ${field}. Valid fields: ${Object.keys(BOT_CONFIG.userData.validFields).join(', ')}`);
  }
  
  // Validate the value according to field configuration
  validateFieldValue(field, value, fieldConfig.validation);
  
  const existing = userDataStorage.get(userId) || {};
  userDataStorage.set(userId, { ...existing, [field]: value });
}

// Field value validation based on configuration
function validateFieldValue(field: string, value: string, validation: FieldValidation): void {
  const trimmedValue = value.trim().toLowerCase();
  
  switch (validation.type) {
    case 'enum':
      const allowedValues = validation.values.map(v => v.toLowerCase());
      if (!allowedValues.includes(trimmedValue)) {
        throw new Error(`Invalid value for ${field}: "${value}". Allowed values: ${validation.values.join(', ')}`);
      }
      break;
      
    case 'text':
      if (validation.minLength && value.trim().length < validation.minLength) {
        throw new Error(`${field} must be at least ${validation.minLength} characters long`);
      }
      if (validation.maxLength && value.trim().length > validation.maxLength) {
        throw new Error(`${field} must be no more than ${validation.maxLength} characters long`);
      }
      break;
      
    case 'date':
      validateDateFormat(field, value, validation.format);
      break;
      
    default:
      // No validation for unknown types
      break;
  }
}

// Date format validation - strict format checking only
function validateDateFormat(field: string, value: string, format?: string): void {
  const trimmedValue = value.trim();
  
  if (!format) {
    throw new Error(`No date format specified for ${field}`);
  }
  
  switch (format) {
    case 'DD/MM/YYYY':
      const ddmmyyyyPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!ddmmyyyyPattern.test(trimmedValue)) {
        throw new Error(`Invalid date format for ${field}: "${value}". Must be exactly DD/MM/YYYY format (e.g., 15/07/2025)`);
      }
      break;
      
    case 'MM/DD/YYYY':
      const mmddyyyyPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!mmddyyyyPattern.test(trimmedValue)) {
        throw new Error(`Invalid date format for ${field}: "${value}". Must be exactly MM/DD/YYYY format (e.g., 07/15/2025)`);
      }
      break;
      
    case 'YYYY-MM-DD':
      const yyyymmddPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!yyyymmddPattern.test(trimmedValue)) {
        throw new Error(`Invalid date format for ${field}: "${value}". Must be exactly YYYY-MM-DD format (e.g., 2025-07-15)`);
      }
      break;
      
    default:
      throw new Error(`Unknown date format: ${format}`);
  }
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