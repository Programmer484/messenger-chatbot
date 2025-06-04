import { logger } from '../../utils/logger';

const qualifiedUsers = new Map<string, { qualifiedAt: Date, availability?: string[] }>();

export function markQualified(userId: string): void {
  logger.debug(`Marking user ${userId} as qualified`, 'QUALIFICATION');
  
  qualifiedUsers.set(userId, {
    qualifiedAt: new Date()
  });
}

export function submitAvailability(userId: string, times: string[]): void {
  logger.debug(`Submitting availability for user ${userId}: ${times.join(', ')}`, 'QUALIFICATION');
  
  const user = qualifiedUsers.get(userId);
  
  if (!user) {
    throw new Error('User must be qualified before submitting availability');
  }
  
  qualifiedUsers.set(userId, {
    ...user,
    availability: times
  });
} 