export const RETRY_CONFIG = {
    maxRetries: 3,
    initialRetryDelay: 1000, // 1 sec
    maxRetryDelay: 30000, // 30 sec
};

export const calculateRetryDelay = (retryCount: number): number => {
    const delay = RETRY_CONFIG.initialRetryDelay * Math.pow(2, retryCount);
    return Math.min(delay, RETRY_CONFIG.maxRetryDelay);
};