"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStrikes = addStrikes;
exports.getStrikes = getStrikes;
exports.hasExceededStrikes = hasExceededStrikes;
exports.resetStrikes = resetStrikes;
const logger_1 = require("../../utils/logger");
const DEFAULT_STRIKE_LIMIT = 3;
const strikeStore = new Map();
function addStrikes(userId, count, reason) {
    logger_1.logger.debug(`Adding ${count} strikes for user ${userId}, reason: ${reason}`, 'STRIKES');
    const current = strikeStore.get(userId) || { count: 0, reasons: [], lastStrike: new Date() };
    strikeStore.set(userId, {
        count: current.count + count,
        reasons: [...current.reasons, reason],
        lastStrike: new Date()
    });
}
function getStrikes(userId) {
    return strikeStore.get(userId)?.count || 0;
}
function hasExceededStrikes(userId, limit = DEFAULT_STRIKE_LIMIT) {
    const record = strikeStore.get(userId);
    const strikeCount = record?.count || 0;
    logger_1.logger.debug(`User ${userId} has ${strikeCount} strikes, limit: ${limit}`, 'STRIKES');
    return record !== undefined && record.count >= limit;
}
function resetStrikes(userId) {
    logger_1.logger.debug(`Resetting strikes for user ${userId}`, 'STRIKES');
    strikeStore.delete(userId);
}
