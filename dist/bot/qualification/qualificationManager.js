"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markQualified = markQualified;
exports.submitAvailability = submitAvailability;
const logger_1 = require("../../utils/logger");
const qualifiedUsers = new Map();
function markQualified(userId) {
    logger_1.logger.debug(`Marking user ${userId} as qualified`, 'QUALIFICATION');
    qualifiedUsers.set(userId, {
        qualifiedAt: new Date()
    });
}
function submitAvailability(userId, times) {
    logger_1.logger.debug(`Submitting availability for user ${userId}: ${times.join(', ')}`, 'QUALIFICATION');
    const user = qualifiedUsers.get(userId);
    if (!user) {
        throw new Error('User must be qualified before submitting availability');
    }
    qualifiedUsers.set(userId, {
        ...user,
        availability: times
    });
}
