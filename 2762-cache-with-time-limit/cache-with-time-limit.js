class TimeLimitedCache {
    constructor() {
        this.cache = new Map();
    }
    
    set(key, value, duration) {
        const now = Date.now();
        const hasKey = this.cache.has(key);
        const exists = hasKey && this.cache.get(key).expiry > now;
        
        // Clear existing timeout if present
        if (hasKey && this.cache.get(key).timeout) {
            clearTimeout(this.cache.get(key).timeout);
        }
        
        // Set new timeout
        const timeout = setTimeout(() => {
            this.cache.delete(key);
        }, duration);
        
        // Store in cache
        this.cache.set(key, {
            value: value,
            expiry: now + duration,
            timeout: timeout
        });
        
        // IMPORTANT: Return whether an un-expired key existed
        return exists;
    }
    
    get(key) {
        const entry = this.cache.get(key);
        if (entry && entry.expiry > Date.now()) {
            return entry.value;
        }
        return -1;
    }
    
    count() {
        const now = Date.now();
        let count = 0;
        
        for (const [key, entry] of this.cache) {
            if (entry.expiry > now) {
                count++;
            } else {
                // Clean up expired entries
                if (entry.timeout) {
                    clearTimeout(entry.timeout);
                }
                this.cache.delete(key);
            }
        }
        
        return count;
    }
}