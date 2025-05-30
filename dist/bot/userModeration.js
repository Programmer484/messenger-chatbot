"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStrike = addStrike;
exports.getStrikes = getStrikes;
exports.hasExceededStrikes = hasExceededStrikes;
exports.resetStrikes = resetStrikes;
exports.isStriked = isStriked;
const DEFAULT_STRIKE_LIMIT = 3;
const strikeStore = new Map();
function addStrike(userId, reason) {
    const current = strikeStore.get(userId) || { count: 0, reasons: [], lastStrike: new Date() };
    strikeStore.set(userId, {
        count: current.count + 1,
        reasons: [...current.reasons, reason],
        lastStrike: new Date()
    });
}
function getStrikes(userId) {
    return strikeStore.get(userId)?.count || 0;
}
function hasExceededStrikes(userId, limit = DEFAULT_STRIKE_LIMIT) {
    const record = strikeStore.get(userId);
    return record !== undefined && record.count >= limit;
}
function resetStrikes(userId) {
    strikeStore.delete(userId);
}
function isStriked(userId) {
    return hasExceededStrikes(userId);
}
