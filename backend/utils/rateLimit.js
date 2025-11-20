import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: 'Too many requests',
            message
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

export const postCreationLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    10, // max 10 posts per window
    'Too many posts created. Please try again later.'
);

export const voteLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    30, // max 30 votes per minute
    'Too many votes. Please slow down.'
);