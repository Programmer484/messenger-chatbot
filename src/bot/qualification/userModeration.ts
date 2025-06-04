import { logger } from '../../utils/logger';

interface StrikeRecord {
  count: number;
  reasons: string[];
  lastStrike: Date;
}

const DEFAULT_STRIKE_LIMIT = 3;
const strikeStore = new Map<string, StrikeRecord>();

export function addStrikes(userId: string, count: number, reason: string): void {
  logger.debug(`Adding ${count} strikes for user ${userId}, reason: ${reason}`, 'STRIKES');
  
  const current = strikeStore.get(userId) || { count: 0, reasons: [], lastStrike: new Date() };
  
  strikeStore.set(userId, {
    count: current.count + count,
    reasons: [...current.reasons, reason],
    lastStrike: new Date()
  });
}

export function getStrikes(userId: string): number {
  return strikeStore.get(userId)?.count || 0;
}

export function hasExceededStrikes(userId: string, limit: number = DEFAULT_STRIKE_LIMIT): boolean {
  const record = strikeStore.get(userId);
  const strikeCount = record?.count || 0;
  
  logger.debug(`User ${userId} has ${strikeCount} strikes, limit: ${limit}`, 'STRIKES');
  
  return record !== undefined && record.count >= limit;
}

export function resetStrikes(userId: string): void {
  logger.debug(`Resetting strikes for user ${userId}`, 'STRIKES');
  
  strikeStore.delete(userId);
}