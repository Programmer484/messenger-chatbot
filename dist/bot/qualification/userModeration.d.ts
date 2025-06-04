export declare function addStrikes(userId: string, count: number, reason: string): void;
export declare function getStrikes(userId: string): number;
export declare function hasExceededStrikes(userId: string, limit?: number): boolean;
export declare function resetStrikes(userId: string): void;
