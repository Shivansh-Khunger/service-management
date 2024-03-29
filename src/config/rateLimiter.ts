// Import necessary modules
import rateLimit from 'express-rate-limit';

// Standard rate limiter: limit each IP to 50 requests per windowMs
export const stdLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
});

// Rate limiter for 'getDeal' route: limit each IP to 75 requests per windowMs
export const getDealLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 75, // limit each IP to 75 requests per windowMs
});
