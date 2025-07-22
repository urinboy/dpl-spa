// Storage Manager - Enhanced localStorage wrapper with encryption and caching
class StorageManager {
    constructor() {
        this.prefix = 'ecommerce_';
        this.encryptionKey = this.generateEncryptionKey();
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.compressionEnabled = true;
        
        // Initialize storage cleanup
        this.initCleanup();
    }

    // Generate a simple encryption key based on browser fingerprint
    generateEncryptionKey() {
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width,
            screen.height,
            new Date().getTimezoneOffset()
        ].join('|');
        
        return btoa(fingerprint).slice(0, 16);
    }

    // Simple encryption/decryption using base64 and character shifting
    encrypt(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            const charCode = data.charCodeAt(i) + (this.encryptionKey.charCodeAt(i % this.encryptionKey.length) % 10);
            encrypted += String.fromCharCode(charCode);
        }
        
        return btoa(encrypted);
    }

    decrypt(encryptedData) {
        try {
            const data = atob(encryptedData);
            let decrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i) - (this.encryptionKey.charCodeAt(i % this.encryptionKey.length) % 10);
                decrypted += String.fromCharCode(charCode);
            }
            
            return decrypted;
        } catch (e) {
            console.error('Decryption failed:', e);
            return null;
        }
    }

    // Compression using simple RLE (Run Length Encoding) for JSON strings
    compress(data) {
        if (!this.compressionEnabled || typeof data !== 'string') {
            return data;
        }
        
        let compressed = '';
        let count = 1;
        let currentChar = data[0];
        
        for (let i = 1; i < data.length; i++) {
            if (data[i] === currentChar && count < 9) {
                count++;
            } else {
                compressed += count > 1 ? count + currentChar : currentChar;
                currentChar = data[i];
                count = 1;
            }
        }
        
        compressed += count > 1 ? count + currentChar : currentChar;
        return compressed;
    }

    decompress(compressedData) {
        if (!this.compressionEnabled || typeof compressedData !== 'string') {
            return compressedData;
        }
        
        let decompressed = '';
        
        for (let i = 0; i < compressedData.length; i++) {
            const char = compressedData[i];
            
            if (/\d/.test(char) && i + 1 < compressedData.length) {
                const count = parseInt(char);
                const nextChar = compressedData[i + 1];
                decompressed += nextChar.repeat(count);
                i++; // Skip the next character as it's already processed
            } else {
                decompressed += char;
            }
        }
        
        return decompressed;
    }

    // Get full key with prefix
    getKey(key) {
        return this.prefix + key;
    }

    // Set item with optional expiry and encryption
    set(key, value, options = {}) {
        try {
            const {
                encrypt = false,
                compress = false,
                expiryInMinutes = null,
                skipCache = false
            } = options;

            let data = typeof value === 'object' ? JSON.stringify(value) : String(value);
            
            // Compress if requested
            if (compress) {
                data = this.compress(data);
            }
            
            // Encrypt if requested
            if (encrypt) {
                data = this.encrypt(data);
            }
            
            // Create storage object with metadata
            const storageObject = {
                data: data,
                timestamp: Date.now(),
                encrypted: encrypt,
                compressed: compress,
                expiry: expiryInMinutes ? Date.now() + (expiryInMinutes * 60 * 1000) : null
            };
            
            const fullKey = this.getKey(key);
            localStorage.setItem(fullKey, JSON.stringify(storageObject));
            
            // Update cache if not skipped
            if (!skipCache) {
                this.cache.set(key, value);
                if (expiryInMinutes) {
                    this.cacheExpiry.set(key, storageObject.expiry);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    // Get item with automatic decryption and decompression
    get(key, defaultValue = null, options = {}) {
        try {
            const { skipCache = false, useCache = true } = options;
            
            // Check cache first if enabled
            if (useCache && !skipCache && this.cache.has(key)) {
                const cacheExpiry = this.cacheExpiry.get(key);
                if (!cacheExpiry || Date.now() < cacheExpiry) {
                    return this.cache.get(key);
                } else {
                    // Cache expired, remove from cache
                    this.cache.delete(key);
                    this.cacheExpiry.delete(key);
                }
            }
            
            const fullKey = this.getKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (!item) {
                return defaultValue;
            }
            
            const storageObject = JSON.parse(item);
            
            // Check if item has expired
            if (storageObject.expiry && Date.now() > storageObject.expiry) {
                this.remove(key);
                return defaultValue;
            }
            
            let data = storageObject.data;
            
            // Decrypt if encrypted
            if (storageObject.encrypted) {
                data = this.decrypt(data);
                if (data === null) {
                    this.remove(key);
                    return defaultValue;
                }
            }
            
            // Decompress if compressed
            if (storageObject.compressed) {
                data = this.decompress(data);
            }
            
            // Try to parse as JSON, fallback to string
            let parsedData;
            try {
                parsedData = JSON.parse(data);
            } catch (e) {
                parsedData = data;
            }
            
            // Update cache
            if (useCache && !skipCache) {
                this.cache.set(key, parsedData);
                if (storageObject.expiry) {
                    this.cacheExpiry.set(key, storageObject.expiry);
                }
            }
            
            return parsedData;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    // Remove item from storage and cache
    remove(key) {
        try {
            const fullKey = this.getKey(key);
            localStorage.removeItem(fullKey);
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    // Clear all items with the prefix
    clear() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            this.cache.clear();
            this.cacheExpiry.clear();
            
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    // Check if key exists and is not expired
    has(key) {
        const fullKey = this.getKey(key);
        const item = localStorage.getItem(fullKey);
        
        if (!item) return false;
        
        try {
            const storageObject = JSON.parse(item);
            if (storageObject.expiry && Date.now() > storageObject.expiry) {
                this.remove(key);
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get all keys with the prefix
    keys() {
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key.substring(this.prefix.length));
            }
        }
        
        return keys;
    }

    // Get storage size in bytes
    getSize() {
        let totalSize = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                const value = localStorage.getItem(key);
                totalSize += key.length + (value ? value.length : 0);
            }
        }
        
        return totalSize;
    }

    // Get storage statistics
    getStats() {
        const keys = this.keys();
        let totalSize = 0;
        let encryptedCount = 0;
        let compressedCount = 0;
        let expiredCount = 0;
        let validCount = 0;
        
        keys.forEach(key => {
            const fullKey = this.getKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (item) {
                totalSize += fullKey.length + item.length;
                
                try {
                    const storageObject = JSON.parse(item);
                    
                    if (storageObject.encrypted) encryptedCount++;
                    if (storageObject.compressed) compressedCount++;
                    
                    if (storageObject.expiry && Date.now() > storageObject.expiry) {
                        expiredCount++;
                    } else {
                        validCount++;
                    }
                } catch (e) {
                    // Invalid storage object
                }
            }
        });
        
        return {
            totalKeys: keys.length,
            validKeys: validCount,
            expiredKeys: expiredCount,
            encryptedKeys: encryptedCount,
            compressedKeys: compressedCount,
            totalSize: totalSize,
            formattedSize: Utils.formatFileSize(totalSize),
            cacheSize: this.cache.size
        };
    }

    // Clean up expired items
    cleanup() {
        const keys = this.keys();
        let cleanedCount = 0;
        
        keys.forEach(key => {
            const fullKey = this.getKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (item) {
                try {
                    const storageObject = JSON.parse(item);
                    
                    if (storageObject.expiry && Date.now() > storageObject.expiry) {
                        this.remove(key);
                        cleanedCount++;
                    }
                } catch (e) {
                    // Remove invalid items
                    this.remove(key);
                    cleanedCount++;
                }
            }
        });
        
        return cleanedCount;
    }

    // Initialize automatic cleanup
    initCleanup() {
        // Clean up on page load
        setTimeout(() => this.cleanup(), 1000);
        
        // Clean up every 10 minutes
        setInterval(() => this.cleanup(), 10 * 60 * 1000);
        
        // Clean up before page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    // Batch operations
    setMultiple(items, options = {}) {
        const results = {};
        
        Object.keys(items).forEach(key => {
            results[key] = this.set(key, items[key], options);
        });
        
        return results;
    }

    getMultiple(keys, defaultValue = null, options = {}) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.get(key, defaultValue, options);
        });
        
        return results;
    }

    removeMultiple(keys) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.remove(key);
        });
        
        return results;
    }

    // Export data for backup
    export() {
        const data = {};
        const keys = this.keys();
        
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        
        return {
            timestamp: Date.now(),
            version: Config.APP.VERSION,
            data: data
        };
    }

    // Import data from backup
    import(backupData, options = { overwrite: false }) {
        try {
            const { overwrite } = options;
            let importedCount = 0;
            let skippedCount = 0;
            
            Object.keys(backupData.data).forEach(key => {
                if (!overwrite && this.has(key)) {
                    skippedCount++;
                } else {
                    this.set(key, backupData.data[key]);
                    importedCount++;
                }
            });
            
            return {
                success: true,
                imported: importedCount,
                skipped: skippedCount,
                total: Object.keys(backupData.data).length
            };
        } catch (error) {
            console.error('Storage import error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Storage quota management
    getQuotaInfo() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            return navigator.storage.estimate().then(estimate => ({
                quota: estimate.quota,
                usage: estimate.usage,
                available: estimate.quota - estimate.usage,
                usagePercentage: (estimate.usage / estimate.quota) * 100
            }));
        }
        
        // Fallback estimation
        return Promise.resolve({
            quota: 5 * 1024 * 1024, // Assume 5MB
            usage: this.getSize(),
            available: (5 * 1024 * 1024) - this.getSize(),
            usagePercentage: (this.getSize() / (5 * 1024 * 1024)) * 100
        });
    }

    // Check if storage is available
    isAvailable() {
        try {
            const testKey = this.getKey('__test__');
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Performance monitoring
    measurePerformance(operation, ...args) {
        const start = performance.now();
        const result = this[operation](...args);
        const end = performance.now();
        
        console.log(`Storage ${operation} took ${end - start} milliseconds`);
        return result;
    }
}

// Specific storage managers for different data types
class AuthStorage extends StorageManager {
    constructor() {
        super();
        this.prefix = 'auth_';
    }

    setToken(token, expiryInMinutes = 60 * 24 * 7) { // 7 days default
        return this.set(Config.STORAGE.AUTH_TOKEN, token, {
            encrypt: true,
            expiryInMinutes
        });
    }

    getToken() {
        return this.get(Config.STORAGE.AUTH_TOKEN);
    }

    setUser(userData) {
        return this.set(Config.STORAGE.USER_DATA, userData, {
            encrypt: true,
            compress: true
        });
    }

    getUser() {
        return this.get(Config.STORAGE.USER_DATA);
    }

    clearAuth() {
        this.remove(Config.STORAGE.AUTH_TOKEN);
        this.remove(Config.STORAGE.USER_DATA);
    }

    isAuthenticated() {
        return this.has(Config.STORAGE.AUTH_TOKEN) && this.getToken();
    }
}

class CartStorage extends StorageManager {
    constructor() {
        super();
        this.prefix = 'cart_';
    }

    setCart(cartData) {
        return this.set(Config.STORAGE.CART_DATA, cartData, {
            compress: true,
            expiryInMinutes: 60 * 24 * 3 // 3 days
        });
    }

    getCart() {
        return this.get(Config.STORAGE.CART_DATA, { items: [], total: 0 });
    }

    clearCart() {
        return this.remove(Config.STORAGE.CART_DATA);
    }

    addItem(item) {
        const cart = this.getCart();
        const existingIndex = cart.items.findIndex(i => i.id === item.id);
        
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += item.quantity || 1;
        } else {
            cart.items.push({ ...item, quantity: item.quantity || 1 });
        }
        
        this.updateCartTotal(cart);
        return this.setCart(cart);
    }

    removeItem(itemId) {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.id !== itemId);
        this.updateCartTotal(cart);
        return this.setCart(cart);
    }

    updateQuantity(itemId, quantity) {
        const cart = this.getCart();
        const item = cart.items.find(i => i.id === itemId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.updateCartTotal(cart);
                return this.setCart(cart);
            }
        }
        
        return false;
    }

    updateCartTotal(cart) {
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        cart.count = cart.items.reduce((count, item) => count + item.quantity, 0);
    }

    getItemCount() {
        const cart = this.getCart();
        return cart.count || 0;
    }
}

class SettingsStorage extends StorageManager {
    constructor() {
        super();
        this.prefix = 'settings_';
    }

    setTheme(theme) {
        return this.set(Config.STORAGE.THEME, theme);
    }

    getTheme() {
        return this.get(Config.STORAGE.THEME, 'light');
    }

    setLanguage(language) {
        return this.set(Config.STORAGE.LANGUAGE, language);
    }

    getLanguage() {
        return this.get(Config.STORAGE.LANGUAGE, Config.APP.DEFAULT_LOCALE);
    }

    setLastVisit() {
        return this.set(Config.STORAGE.LAST_VISIT, Date.now());
    }

    getLastVisit() {
        return this.get(Config.STORAGE.LAST_VISIT);
    }

    setPreferences(preferences) {
        return this.set('preferences', preferences, { compress: true });
    }

    getPreferences() {
        return this.get('preferences', {});
    }
}

// Create global instances
const Storage = new StorageManager();
const AuthStore = new AuthStorage();
const CartStore = new CartStorage();
const SettingsStore = new SettingsStorage();

// Make them globally available
window.Storage = Storage;
window.AuthStore = AuthStore;
window.CartStore = CartStore;
window.SettingsStore = SettingsStore;