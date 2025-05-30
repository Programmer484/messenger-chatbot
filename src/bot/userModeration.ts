interface StrikeRecord {
  count: number;
  reasons: string[];
  lastStrike: Date;
}

const DEFAULT_STRIKE_LIMIT = 3;
const strikeStore = new Map<string, StrikeRecord>();

export function addStrike(userId: string, reason: string): void {
  const current = strikeStore.get(userId) || { count: 0, reasons: [], lastStrike: new Date() };
  
  strikeStore.set(userId, {
    count: current.count + 1,
    reasons: [...current.reasons, reason],
    lastStrike: new Date()
  });
}

export function getStrikes(userId: string): number {
  return strikeStore.get(userId)?.count || 0;
}

export function hasExceededStrikes(userId: string, limit: number = DEFAULT_STRIKE_LIMIT): boolean {
  const record = strikeStore.get(userId);
  return record !== undefined && record.count >= limit;
}

export function resetStrikes(userId: string): void {
  strikeStore.delete(userId);
}

export function isStriked(userId: string): boolean {
  return hasExceededStrikes(userId);
} 