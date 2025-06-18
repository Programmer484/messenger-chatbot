// Bot behavior and business logic configuration
// These settings can be easily modified by landlords/property managers

export const BOT_CONFIG = {
  // User data field definitions
  userData: {
    // Valid field names with descriptions and validation rules
    validFields: {
      'move_in_date': {
        description: 'Move-in date - MUST be in exact DD/MM/YYYY format with leading zeros (e.g., 15/07/2025, 03/12/2024)',
        validation: { type: 'date', format: 'DD/MM/YYYY' }
      },
      'current_renting_status': {
        description: 'Current renting status',
        validation: { type: 'enum', values: ['renting', 'not renting'] }
      },
      'number_of_people': {
        description: 'Number of people',
        validation: { type: 'enum', values: ['1', '2', '3+'] }
      },
      'relationship': {
        description: 'Relationship between occupants',
        validation: { type: 'enum', values: ['couple', 'not couple'] }
      },
      'job_title_primary': {
        description: 'Job title (primary applicant)',
        validation: { type: 'text', minLength: 2 }
      },
      'job_title_secondary': {
        description: 'Job title (secondary applicant)',
        validation: { type: 'text', minLength: 2 }
      },
      'name': {
        description: 'Applicant name',
        validation: { type: 'text', minLength: 2 }
      },
      'pets': {
        description: 'Pet status',
        validation: { type: 'enum', values: ['yes', 'no'] }
      },
      'smoking': {
        description: 'Smoking status',
        validation: { type: 'enum', values: ['yes', 'no'] }
      },
      'drugs': {
        description: 'Drug use status',
        validation: { type: 'enum', values: ['yes', 'no'] }
      }
    } as const,
    
    // Required fields that must be collected for eligibility
    requiredFields: [
      'move_in_date',
      'current_renting_status', 
      'number_of_people',
      'relationship',
      'job_title_primary'
    ] as const
  },

  // Standard bot responses
  responses: {
    blockedUser: "Based on our screening criteria, you do not meet the requirements for this rental property. Thank you for your interest.",
    noResponse: "I'm sorry, I'm having trouble processing your request right now. Please try again."
  },

  // Conversation management (business rules)
  chat: {
    maxMessages: 20,           // Maximum chat history to keep
    maxTokens: 150,           // OpenAI response token limit
    temperature: 0.7          // AI response creativity (0-1)
  },

  // User moderation (business rules)
  moderation: {
    strikeLimit: 3,           // Maximum strikes before blocking
    blockDuration: 24 * 60 * 60 * 1000  // 24 hours in milliseconds
  },

  // OpenAI settings (bot personality)
  openai: {
    model: 'gpt-4o',
    maxRetries: 3,
    retryDelay: 1000         // milliseconds
  },

  // Facebook Messenger API (bot communication)
  messenger: {
    apiVersion: 'v18.0',
    maxRetries: 2,
    retryDelay: 500          // milliseconds
  }
};

// Export types for use elsewhere
export type UserDataField = keyof typeof BOT_CONFIG.userData.validFields;
export type FieldValidation = {
  type: 'enum';
  values: readonly string[];
} | {
  type: 'text';
  minLength?: number;
  maxLength?: number;
} | {
  type: 'date';
  format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
}; 