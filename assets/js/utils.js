// Utility Functions
const Utils = {
    
    // Debounce function
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format price with currency
    formatPrice(price, currency = Config.APP.DEFAULT_CURRENCY) {
        if (typeof price !== 'number') price = parseFloat(price) || 0;
        
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    },
    
    // Format date
    formatDate(dateString, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        return new Date(dateString).toLocaleDateString('uz-UZ', formatOptions);
    },
    
    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const timeUnits = [
            { unit: 'year', seconds: 31536000 },
            { unit: 'month', seconds: 2628000 },
            { unit: 'week', seconds: 604800 },
            { unit: 'day', seconds: 86400 },
            { unit: 'hour', seconds: 3600 },
            { unit: 'minute', seconds: 60 }
        ];
        
        for (const { unit, seconds } of timeUnits) {
            const count = Math.floor(diffInSeconds / seconds);
            if (count > 0) {
                return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'Just now';
    },
    
    // Render star rating
    renderStars(rating, maxStars = 5) {
        if (!rating || rating < 0) {
            return Config.RATING.EMPTY_STAR.repeat(maxStars);
        }
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
        
        return Config.RATING.FULL_STAR.repeat(fullStars) + 
               (hasHalfStar ? Config.RATING.HALF_STAR : '') + 
               Config.RATING.EMPTY_STAR.repeat(emptyStars);
    },
    
    // Generate unique ID
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Deep clone object
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },
    
    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate phone number (Uzbekistan format)
    isValidPhone(phone) {
        const phoneRegex = /^(\+998|998)?[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },
    
    // Sanitize HTML to prevent XSS
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Truncate text
    truncateText(text, maxLength, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    },
    
    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Convert string to URL slug
    slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    },
    
    // Get file extension from filename
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Check if device is mobile
    isMobile() {
        return window.innerWidth < Config.UI.MOBILE_BREAKPOINT;
    },
    
    // Check if device is tablet
    isTablet() {
        return window.innerWidth >= Config.UI.MOBILE_BREAKPOINT && 
               window.innerWidth < Config.UI.DESKTOP_BREAKPOINT;
    },
    
    // Check if device is desktop
    isDesktop() {
        return window.innerWidth >= Config.UI.DESKTOP_BREAKPOINT;
    },
    
    // Get device type
    getDeviceType() {
        if (Utils.isMobile()) return 'mobile';
        if (Utils.isTablet()) return 'tablet';
        return 'desktop';
    },
    
    // Scroll to element
    scrollToElement(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackErr) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },
    
    // Parse URL parameters
    parseUrlParams(url = window.location.href) {
        const params = {};
        const urlObj = new URL(url);
        
        for (const [key, value] of urlObj.searchParams.entries()) {
            params[key] = value;
        }
        
        return params;
    },
    
    // Build URL with parameters
    buildUrl(baseUrl, params = {}) {
        const url = new URL(baseUrl);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            }
        });
        
        return url.toString();
    },
    
    // Local storage with JSON support
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    },
    
    // Event emitter for custom events
    events: {
        listeners: {},
        
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },
        
        off(event, callback) {
            if (!this.listeners[event]) return;
            
            const index = this.listeners[event].indexOf(callback);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        },
        
        emit(event, data = null) {
            if (!this.listeners[event]) return;
            
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error('Event callback error:', e);
                }
            });
        }
    },
    
    // Performance helper
    performance: {
        measure(name, fn) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        },
        
        async measureAsync(name, fn) {
            const start = performance.now();
            const result = await fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        }
    }
};

// Make Utils globally available
window.Utils = Utils;