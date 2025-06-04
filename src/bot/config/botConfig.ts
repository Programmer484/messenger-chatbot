// Bot behavior and business logic configuration
// These settings can be easily modified by landlords/property managers

export const BOT_CONFIG = {
  // User data field definitions
  userData: {
    // Valid field names - these should match what's defined in the system prompt
    validFields: {
      'move_in_date': 'Move-in date',
      'current_renting_status': 'Current renting status',
      'number_of_people': 'Number of people',
      'relationship': 'Relationship between occupants',
      'job_title_primary': 'Job title (primary applicant)',
      'job_title_secondary': 'Job title (secondary applicant)',
      'name': 'Applicant name',
      'pets': 'Pet status',
      'smoking': 'Smoking status',
      'drugs': 'Drug use status'
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