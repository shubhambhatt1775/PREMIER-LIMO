const NodeCache = require('node-cache');

// stdTTL: standard time to live in seconds (default: 10 minutes)
// checkperiod: period in seconds for the check and delete of expired keys
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

console.log('🚀 Advanced Caching Layer Initialized');

module.exports = {
    cache,
    // Helper to generate consistent cache keys
    getCacheKey: (prefix, params = {}) => {
        const queryPart = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
        return `${prefix}:${queryPart || 'all'}`;
    },
    // Constants for TTLs
    TTL: {
        SHORT: 60,      // 1 minute (e.g., live stats)
        MEDIUM: 600,    // 10 minutes (e.g., car listings)
        LONG: 3600      // 1 hour (e.g., static configurations)
    }
};
