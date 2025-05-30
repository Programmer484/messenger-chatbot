export declare function addStrike(userId: string, reason: string): void;
export declare function getStrikes(userId: string): number;
export declare function hasExceededStrikes(userId: string, limit?: number): boolean;
export declare function resetStrikes(userId: string): void;
export declare function isStriked(userId: string): boolean;
