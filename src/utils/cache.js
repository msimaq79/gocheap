class Cache {
    constructor() {
        this.cache = new Map();
        this.ttl = 1000 * 60 * 60; // 1 hour default TTL
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    set(key, value, ttl = this.ttl) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl
        });
    }
}

module.exports = new Cache();