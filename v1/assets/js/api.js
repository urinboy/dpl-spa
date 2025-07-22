// API Service Layer
class ApiService {
    constructor() {
        this.baseURL = Config.API.BASE_URL;
        this.timeout = Config.API.TIMEOUT;
        this.retryAttempts = Config.API.RETRY_ATTEMPTS;
        this.retryDelay = Config.API.RETRY_DELAY;
    }

    // Get auth token from storage
    getAuthToken() {
        return Utils.storage.get(Config.STORAGE.AUTH_TOKEN);
    }

    // Build full URL with parameter substitution
    buildUrl(endpoint, params = {}) {
        let url = endpoint;
        
        // Replace path parameters like {id}, {categoryId}
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
        
        return this.baseURL + url;
    }

    // Default headers
    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...customHeaders
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Retry logic for failed requests
    async retryRequest(requestFn, attempt = 1) {
        try {
            return await requestFn();
        } catch (error) {
            if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                console.warn(`Request failed, retrying... (attempt ${attempt + 1})`);
                await this.delay(this.retryDelay * attempt);
                return this.retryRequest(requestFn, attempt + 1);
            }
            throw error;
        }
    }

    // Check if error should trigger a retry
    shouldRetry(error) {
        const retryableErrors = [
            'NetworkError',
            'TimeoutError',
            500, 502, 503, 504 // Server errors
        ];
        
        return retryableErrors.includes(error.status) || 
               retryableErrors.includes(error.name) ||
               error.message.includes('Failed to fetch');
    }

    // Delay utility for retries
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main request method
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            data = null,
            params = {},
            headers = {},
            timeout = this.timeout,
            ...otherOptions
        } = options;

        const url = this.buildUrl(endpoint, params);
        const requestHeaders = this.getHeaders(headers);

        const fetchOptions = {
            method,
            headers: requestHeaders,
            credentials: 'include',
            ...otherOptions
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            if (data instanceof FormData) {
                // Remove Content-Type header for FormData
                delete fetchOptions.headers['Content-Type'];
                fetchOptions.body = data;
            } else {
                fetchOptions.body = JSON.stringify(data);
            }
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        const requestPromise = async () => {
            const response = await Promise.race([
                fetch(url, fetchOptions),
                timeoutPromise
            ]);

            return this.handleResponse(response);
        };

        return this.retryRequest(requestPromise);
    }

    // Handle response
    async handleResponse(response) {
        let data;
        
        try {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        } catch (e) {
            data = null;
        }

        if (!response.ok) {
            const error = new Error(
                data?.message || 
                Config.ERRORS[response.status] || 
                `HTTP ${response.status}: ${response.statusText}`
            );
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    // GET request
    async get(endpoint, params = {}, options = {}) {
        return this.request(endpoint, { 
            method: 'GET', 
            params, 
            ...options 
        });
    }

    // POST request
    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, { 
            method: 'POST', 
            data, 
            ...options 
        });
    }

    // PUT request
    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, { 
            method: 'PUT', 
            data, 
            ...options 
        });
    }

    // PATCH request
    async patch(endpoint, data = null, options = {}) {
        return this.request(endpoint, { 
            method: 'PATCH', 
            data, 
            ...options 
        });
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { 
            method: 'DELETE', 
            ...options 
        });
    }

    // Upload file
    async upload(endpoint, file, additionalData = {}, onProgress = null) {
        const formData = new FormData();
        formData.append('image', file);
        
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const headers = this.getHeaders();
        delete headers['Content-Type']; // Let browser set it for FormData

        const xhr = new XMLHttpRequest();
        
        return new Promise((resolve, reject) => {
            xhr.upload.addEventListener('progress', (e) => {
                if (onProgress && e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', this.buildUrl(endpoint));
            
            // Set headers
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.send(formData);
        });
    }
}

// API Endpoints wrapper
class API {
    constructor() {
        this.service = new ApiService();
    }

    // Auth endpoints
    auth = {
        login: (credentials) => 
            this.service.post(Config.ENDPOINTS.AUTH_LOGIN, credentials),
        
        register: (userData) => 
            this.service.post(Config.ENDPOINTS.AUTH_REGISTER, userData),
        
        logout: () => 
            this.service.post(Config.ENDPOINTS.AUTH_LOGOUT),
        
        me: () => 
            this.service.get(Config.ENDPOINTS.AUTH_ME),
        
        profile: () => 
            this.service.get(Config.ENDPOINTS.AUTH_PROFILE)
    };

    // Categories endpoints
    categories = {
        getAll: (query = {}) => 
            this.service.get(Config.ENDPOINTS.CATEGORIES, query),
        
        getMain: () => 
            this.service.get(Config.ENDPOINTS.CATEGORIES_MAIN),
        
        getById: (id) => 
            this.service.get(Config.ENDPOINTS.CATEGORY_BY_ID, { id })
    };

    // Products endpoints
    products = {
        getAll: (query = {}) => 
            this.service.get(Config.ENDPOINTS.PRODUCTS, query),
        
        getFeatured: () => 
            this.service.get(Config.ENDPOINTS.PRODUCTS_FEATURED),
        
        search: (q, params = {}) => 
            this.service.get(Config.ENDPOINTS.PRODUCTS_SEARCH, { q, ...params }),
        
        getByCategory: (categoryId, params = {}) => 
            this.service.get(Config.ENDPOINTS.PRODUCTS_BY_CATEGORY, { categoryId, ...params }),
        
        getById: (id) => 
            this.service.get(Config.ENDPOINTS.PRODUCT_BY_ID, { id }),
        
        getReviews: (productId, params = {}) => 
            this.service.get(Config.ENDPOINTS.PRODUCT_REVIEWS, { product: productId, ...params })
    };

    // Cart endpoints
    cart = {
        get: () => 
            this.service.get(Config.ENDPOINTS.CART),
        
        add: (productId, quantity = 1) => 
            this.service.post(Config.ENDPOINTS.CART, { product_id: productId, quantity }),
        
        update: (itemId, quantity) => 
            this.service.put(Config.ENDPOINTS.CART_ITEM, { id: itemId }, { quantity }),
        
        remove: (itemId) => 
            this.service.delete(Config.ENDPOINTS.CART_ITEM, { id: itemId }),
        
        clear: () => 
            this.service.delete(Config.ENDPOINTS.CART)
    };

    // Orders endpoints
    orders = {
        getAll: (params = {}) => 
            this.service.get(Config.ENDPOINTS.ORDERS, params),
        
        create: (orderData) => 
            this.service.post(Config.ENDPOINTS.ORDERS, orderData),
        
        getById: (id) => 
            this.service.get(Config.ENDPOINTS.ORDER_BY_ID, { id }),
        
        reorder: (id) => 
            this.service.post(Config.ENDPOINTS.ORDER_REORDER, { id }),
        
        getStatusHistory: (id) => 
            this.service.get(Config.ENDPOINTS.ORDER_STATUS_HISTORY, { id })
    };

    // Profile endpoints
    profile = {
        get: () => 
            this.service.get(Config.ENDPOINTS.PROFILE),
        
        update: (data) => 
            this.service.put(Config.ENDPOINTS.PROFILE, data),
        
        uploadAvatar: (file, onProgress) => 
            this.service.upload(Config.ENDPOINTS.PROFILE_AVATAR, file, {}, onProgress),
        
        deleteAvatar: () => 
            this.service.delete(Config.ENDPOINTS.PROFILE_AVATAR),
        
        changePassword: (passwordData) => 
            this.service.post(Config.ENDPOINTS.PROFILE_PASSWORD, passwordData),
        
        deleteAccount: (data) => 
            this.service.delete(Config.ENDPOINTS.PROFILE_DELETE, data),
        
        getStatistics: () => 
            this.service.get(Config.ENDPOINTS.PROFILE_STATS),
        
        getNotificationSettings: () => 
            this.service.get(Config.ENDPOINTS.PROFILE_NOTIFICATIONS),
        
        updateNotificationSettings: (settings) => 
            this.service.put(Config.ENDPOINTS.PROFILE_NOTIFICATIONS, settings)
    };

    // Reviews endpoints
    reviews = {
        create: (reviewData) => 
            this.service.post(Config.ENDPOINTS.REVIEWS, reviewData),
        
        getById: (id) => 
            this.service.get(Config.ENDPOINTS.REVIEW_BY_ID, { id }),
        
        update: (id, data) => 
            this.service.put(Config.ENDPOINTS.REVIEW_BY_ID, { id }, data),
        
        delete: (id) => 
            this.service.delete(Config.ENDPOINTS.REVIEW_BY_ID, { id }),
        
        markHelpful: (id, isHelpful) => 
            this.service.post(Config.ENDPOINTS.REVIEW_HELPFUL, { id }, { is_helpful: isHelpful }),
        
        getMy: (params = {}) => 
            this.service.get(Config.ENDPOINTS.MY_REVIEWS, params),
        
        getReviewableProducts: () => 
            this.service.get(Config.ENDPOINTS.REVIEWABLE_PRODUCTS),
        
        getStatistics: () => 
            this.service.get(Config.ENDPOINTS.REVIEW_STATS)
    };

    // Cities endpoints
    cities = {
        getAll: () => 
            this.service.get(Config.ENDPOINTS.CITIES),
        
        getDeliveryAvailable: () => 
            this.service.get(Config.ENDPOINTS.CITIES_DELIVERY),
        
        getById: (id) => 
            this.service.get(Config.ENDPOINTS.CITY_BY_ID, { id }),
        
        getDeliveryFee: (id) => 
            this.service.get(Config.ENDPOINTS.CITY_DELIVERY_FEE, { id })
    };

    // File upload endpoints
    upload = {
        image: (file, folder = 'uploads', options = {}) => 
            this.service.upload(Config.ENDPOINTS.UPLOAD_IMAGE, file, { folder, ...options }),
        
        images: (files, folder = 'uploads') => {
            const formData = new FormData();
            files.forEach(file => formData.append('images[]', file));
            formData.append('folder', folder);
            return this.service.post(Config.ENDPOINTS.UPLOAD_IMAGES, formData);
        },
        
        delete: (path) => 
            this.service.delete(Config.ENDPOINTS.UPLOAD_DELETE, { path }),
        
        getInfo: (path) => 
            this.service.get(Config.ENDPOINTS.UPLOAD_INFO, { path }),
        
        getStats: () => 
            this.service.get(Config.ENDPOINTS.UPLOAD_STATS)
    };
}

// Create global API instance
window.API = new API();