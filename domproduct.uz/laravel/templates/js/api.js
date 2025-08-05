/**
 * DOM PRODUCT API Client
 * API bilan ishlash uchun asosiy funksiyalar
 */

class DOMProductAPI {
    constructor() {
        this.baseURL = 'https://api.domproduct.uz/api';
        this.token = this.getStoredToken();
        this.refreshToken = this.getStoredRefreshToken();
        this.isRefreshing = false;
        this.failedQueue = [];

        // Request interceptors
        this.setupInterceptors();

        // Initialize axios defaults if available
        if (typeof axios !== 'undefined') {
            this.setupAxios();
        }
    }

    // ==================== AUTHENTICATION ====================

    /**
     * Saqlangan tokenni olish
     */
    getStoredToken() {
        return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }

    /**
     * Saqlangan refresh tokenni olish
     */
    getStoredRefreshToken() {
        return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    }

    /**
     * Tokenni saqlash
     */
    setToken(token, refreshToken = null, remember = false) {
        this.token = token;
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem('access_token', token);
        if (refreshToken) {
            this.refreshToken = refreshToken;
            storage.setItem('refresh_token', refreshToken);
        }
    }

    /**
     * Tokenlarni o'chirish
     */
    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
    }

    /**
     * Foydalanuvchi autentifikatsiya qilinganmi?
     */
    isAuthenticated() {
        return !!this.token;
    }

    // ==================== HTTP CLIENT ====================

    /**
     * Axios konfiguratsiya
     */
    setupAxios() {
        axios.defaults.baseURL = this.baseURL;
        axios.defaults.timeout = 30000;
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        if (this.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }
    }

    /**
     * Interceptors sozlash
     */
    setupInterceptors() {
        if (typeof axios === 'undefined') return;

        // Request interceptor
        axios.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axios(originalRequest);
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshAccessToken();
                        this.processQueue(null, newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError, null);
                        this.logout();
                        window.location.href = '/login.html';
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * Failed queue ni qayta ishlash
     */
    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });

        this.failedQueue = [];
    }

    /**
     * Fetch API bilan HTTP so'rov
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 401 && this.refreshToken) {
                const newToken = await this.refreshAccessToken();
                config.headers.Authorization = `Bearer ${newToken}`;
                return fetch(url, config);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(errorData.message || 'Network error', response.status, errorData);
            }

            return response.json();
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError('Network error', 0, { originalError: error });
        }
    }

    // ==================== AUTH ENDPOINTS ====================

    /**
     * Ro'yxatdan o'tish
     */
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token, response.data.refresh_token, userData.remember);
        }

        return response;
    }

    /**
     * Tizimga kirish
     */
    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token, response.data.refresh_token, credentials.remember);
        }

        return response;
    }

    /**
     * Tizimdan chiqish
     */
    async logout() {
        try {
            if (this.token) {
                await this.request('/auth/logout', { method: 'POST' });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    }

    /**
     * Token yangilash
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.request('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: this.refreshToken })
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token, response.data.refresh_token);
            return response.data.token;
        }

        throw new Error('Token refresh failed');
    }

    /**
     * Foydalanuvchi ma'lumotlari
     */
    async getCurrentUser() {
        return this.request('/auth/user');
    }

    // ==================== PUBLIC ENDPOINTS ====================

    /**
     * Tillar ro'yxati
     */
    async getLanguages() {
        return this.request('/v1/languages');
    }

    /**
     * Tarjimalar
     */
    async getTranslations(languageCode) {
        return this.request(`/v1/translations/${languageCode}`);
    }

    /**
     * Kategoriyalar
     */
    async getCategories() {
        return this.request('/v1/categories');
    }

    /**
     * Kategoriya daraxti
     */
    async getCategoryTree() {
        return this.request('/v1/categories/tree');
    }

    /**
     * Bitta kategoriya
     */
    async getCategory(id) {
        return this.request(`/v1/categories/${id}`);
    }

    /**
     * Mahsulotlar ro'yxati
     */
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/v1/products${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Tavsiya etilgan mahsulotlar
     */
    async getFeaturedProducts() {
        return this.request('/v1/products/featured');
    }

    /**
     * Bitta mahsulot
     */
    async getProduct(id) {
        return this.request(`/v1/products/${id}`);
    }

    /**
     * O'xshash mahsulotlar
     */
    async getRelatedProducts(id) {
        return this.request(`/v1/products/${id}/related`);
    }

    /**
     * Mahsulotlarni qidirish
     */
    async searchProducts(query, filters = {}) {
        const params = { search: query, ...filters };
        return this.getProducts(params);
    }

    // ==================== USER ENDPOINTS ====================

    /**
     * Profil ko'rish
     */
    async getProfile() {
        return this.request('/user/profile');
    }

    /**
     * Profilni yangilash
     */
    async updateProfile(data) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Parolni o'zgartirish
     */
    async changePassword(data) {
        return this.request('/user/password', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Avatar yuklash
     */
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        return this.request('/user/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });
    }

    // ==================== CART ENDPOINTS ====================

    /**
     * Savatni olish
     */
    async getCart() {
        return this.request('/cart');
    }

    /**
     * Savatga mahsulot qo'shish
     */
    async addToCart(productId, quantity, options = {}) {
        return this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                quantity,
                options
            })
        });
    }

    /**
     * Savat elementini yangilash
     */
    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    /**
     * Savat elementini o'chirish
     */
    async removeCartItem(itemId) {
        return this.request(`/cart/items/${itemId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Savatni tozalash
     */
    async clearCart() {
        return this.request('/cart/clear', {
            method: 'DELETE'
        });
    }

    /**
     * Kupon qo'llash
     */
    async applyCoupon(couponCode) {
        return this.request('/cart/coupon/apply', {
            method: 'POST',
            body: JSON.stringify({ coupon_code: couponCode })
        });
    }

    /**
     * Kuponni o'chirish
     */
    async removeCoupon() {
        return this.request('/cart/coupon', {
            method: 'DELETE'
        });
    }

    /**
     * Savat xulosasi
     */
    async getCartSummary() {
        return this.request('/cart/summary');
    }

    // ==================== ORDER ENDPOINTS ====================

    /**
     * Buyurtmalar ro'yxati
     */
    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Yangi buyurtma
     */
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Buyurtma ko'rish
     */
    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    /**
     * Buyurtmani bekor qilish
     */
    async cancelOrder(id, reason = null) {
        return this.request(`/orders/${id}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }

    /**
     * Buyurtma status tarixi
     */
    async getOrderStatusHistory(id) {
        return this.request(`/orders/${id}/status-history`);
    }

    // ==================== ADDRESS ENDPOINTS ====================

    /**
     * Manzillar ro'yxati
     */
    async getAddresses() {
        return this.request('/addresses');
    }

    /**
     * Yangi manzil qo'shish
     */
    async createAddress(addressData) {
        return this.request('/addresses', {
            method: 'POST',
            body: JSON.stringify(addressData)
        });
    }

    /**
     * Manzilni yangilash
     */
    async updateAddress(id, addressData) {
        return this.request(`/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(addressData)
        });
    }

    /**
     * Manzilni o'chirish
     */
    async deleteAddress(id) {
        return this.request(`/addresses/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Standart manzil qilish
     */
    async setDefaultAddress(id) {
        return this.request(`/addresses/${id}/set-default`, {
            method: 'POST'
        });
    }

    // ==================== PAYMENT ENDPOINTS ====================

    /**
     * To'lov usullari
     */
    async getPaymentMethods() {
        return this.request('/payments/methods');
    }

    /**
     * To'lovni amalga oshirish
     */
    async processPayment(paymentData) {
        return this.request('/payments/process', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    /**
     * To'lov tarixi
     */
    async getPaymentHistory(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/payments/history${queryString ? '?' + queryString : ''}`);
    }

    /**
     * To'lov holatini tekshirish
     */
    async getPaymentStatus(id) {
        return this.request(`/payments/${id}/status`);
    }

    // ==================== NOTIFICATION ENDPOINTS ====================

    /**
     * Bildirishnomalar
     */
    async getNotifications(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/notifications${queryString ? '?' + queryString : ''}`);
    }

    /**
     * O'qilmagan bildirishnomalar soni
     */
    async getUnreadNotificationCount() {
        return this.request('/notifications/unread-count');
    }

    /**
     * Bildirishnomani o'qilgan deb belgilash
     */
    async markNotificationAsRead(id) {
        return this.request(`/notifications/${id}/mark-read`, {
            method: 'POST'
        });
    }

    /**
     * Barcha bildirishnomalarni o'qilgan deb belgilash
     */
    async markAllNotificationsAsRead() {
        return this.request('/notifications/mark-all-read', {
            method: 'POST'
        });
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Faylni yuklash
     */
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);

        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        return this.request(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });
    }

    /**
     * Rasm URL olish
     */
    getImageUrl(path) {
        if (!path) return '/images/placeholder.png';
        if (path.startsWith('http')) return path;
        return `${this.baseURL.replace('/api', '')}/storage/${path}`;
    }

    /**
     * Error handling
     */
    handleError(error) {
        console.error('API Error:', error);

        if (error instanceof APIError) {
            return {
                success: false,
                message: error.message,
                status: error.status,
                errors: error.errors
            };
        }

        return {
            success: false,
            message: 'Tarmoq xatosi yuz berdi',
            status: 0,
            errors: {}
        };
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 0, errors = {}) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.errors = errors;
    }
}

// Global API instance
const api = new DOMProductAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOMProductAPI, APIError };
}

// Global utility functions
window.api = api;
window.APIError = APIError;

/**
 * Local Storage helpers
 */
const StorageManager = {
    // Cache boshqaruvi
    setCache(key, data, expiryMinutes = 60) {
        const item = {
            data,
            expiry: Date.now() + (expiryMinutes * 60 * 1000)
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    },

    getCache(key) {
        const item = localStorage.getItem(`cache_${key}`);
        if (!item) return null;

        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) {
            localStorage.removeItem(`cache_${key}`);
            return null;
        }

        return parsed.data;
    },

    clearCache() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
    },

    // Savat boshqaruvi
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    setCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    addToLocalCart(productId, quantity = 1, options = {}) {
        const cart = this.getCart();
        const existingItem = cart.find(item =>
            item.productId === productId &&
            JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity, options, addedAt: Date.now() });
        }

        this.setCart(cart);
        return cart;
    },

    removeFromLocalCart(productId, options = {}) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item =>
            !(item.productId === productId &&
              JSON.stringify(item.options) === JSON.stringify(options))
        );
        this.setCart(filteredCart);
        return filteredCart;
    },

    clearLocalCart() {
        localStorage.removeItem('cart');
    },

    // Recently viewed products
    addToRecentlyViewed(productId) {
        const recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        const filtered = recent.filter(id => id !== productId);
        filtered.unshift(productId);

        // Keep only last 10 items
        const limited = filtered.slice(0, 10);
        localStorage.setItem('recently_viewed', JSON.stringify(limited));
    },

    getRecentlyViewed() {
        return JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    },

    // Search history
    addToSearchHistory(query) {
        if (!query.trim()) return;

        const history = JSON.parse(localStorage.getItem('search_history') || '[]');
        const filtered = history.filter(item => item !== query);
        filtered.unshift(query);

        // Keep only last 20 searches
        const limited = filtered.slice(0, 20);
        localStorage.setItem('search_history', JSON.stringify(limited));
    },

    getSearchHistory() {
        return JSON.parse(localStorage.getItem('search_history') || '[]');
    },

    clearSearchHistory() {
        localStorage.removeItem('search_history');
    }
};

window.StorageManager = StorageManager;
