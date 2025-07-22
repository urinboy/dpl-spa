// App Configuration
const Config = {
    // API Configuration
    API: {
        BASE_URL: 'https://dompro.itorda.uz/api/v1',
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    },
    
    // Storage Keys
    STORAGE: {
        AUTH_TOKEN: 'auth_token',
        USER_DATA: 'user_data',
        CART_DATA: 'cart_data',
        THEME: 'app_theme',
        LANGUAGE: 'app_language',
        LAST_VISIT: 'last_visit'
    },
    
    // App Settings
    APP: {
        NAME: 'E-commerce Shop',
        VERSION: '1.0.0',
        DEFAULT_LOCALE: 'uz',
        SUPPORTED_LOCALES: ['uz', 'ru', 'en'],
        DEFAULT_CURRENCY: 'UZS',
        ITEMS_PER_PAGE: 12,
        CART_MAX_ITEMS: 99,
        SEARCH_MIN_LENGTH: 3,
        SEARCH_DEBOUNCE: 300,
        TOAST_DURATION: 3000
    },
    
    // UI Settings
    UI: {
        HEADER_HEIGHT: '64px',
        BOTTOM_NAV_HEIGHT: '64px',
        SIDEBAR_WIDTH: '280px',
        MOBILE_BREAKPOINT: 768,
        TABLET_BREAKPOINT: 1024,
        DESKTOP_BREAKPOINT: 1280
    },
    
    // API Endpoints
    ENDPOINTS: {
        // Auth
        AUTH_LOGIN: '/auth/login',
        AUTH_REGISTER: '/auth/register',
        AUTH_LOGOUT: '/auth/logout',
        AUTH_ME: '/auth/me',
        AUTH_PROFILE: '/auth/profile',
        
        // Categories
        CATEGORIES: '/categories',
        CATEGORIES_MAIN: '/categories/main',
        CATEGORY_BY_ID: '/categories/{id}',
        
        // Products
        PRODUCTS: '/products',
        PRODUCTS_FEATURED: '/products/featured',
        PRODUCTS_SEARCH: '/products/search',
        PRODUCTS_BY_CATEGORY: '/products/category/{categoryId}',
        PRODUCT_BY_ID: '/products/{id}',
        PRODUCT_REVIEWS: '/products/{product}/reviews',
        
        // Cart
        CART: '/cart',
        CART_ITEM: '/cart/{id}',
        
        // Orders
        ORDERS: '/orders',
        ORDER_BY_ID: '/orders/{id}',
        ORDER_REORDER: '/orders/{id}/reorder',
        ORDER_STATUS_HISTORY: '/orders/{id}/status-history',
        
        // Profile
        PROFILE: '/profile',
        PROFILE_AVATAR: '/profile/avatar',
        PROFILE_PASSWORD: '/profile/change-password',
        PROFILE_DELETE: '/profile/delete-account',
        PROFILE_STATS: '/profile/statistics',
        PROFILE_NOTIFICATIONS: '/profile/notification-settings',
        
        // Reviews
        REVIEWS: '/reviews',
        REVIEW_BY_ID: '/reviews/{id}',
        REVIEW_HELPFUL: '/reviews/{id}/helpful',
        MY_REVIEWS: '/reviews/my-reviews',
        REVIEWABLE_PRODUCTS: '/reviews/reviewable-products',
        REVIEW_STATS: '/reviews/statistics',
        
        // Addresses
        ADDRESSES: '/addresses',
        ADDRESS_BY_ID: '/addresses/{id}',
        ADDRESS_SET_DEFAULT: '/addresses/{id}/set-default',
        
        // Cities
        CITIES: '/cities',
        CITIES_DELIVERY: '/cities/delivery-available',
        CITY_BY_ID: '/cities/{id}',
        CITY_DELIVERY_FEE: '/cities/{id}/delivery-fee',
        
        // File Upload
        UPLOAD_IMAGE: '/upload/image',
        UPLOAD_IMAGES: '/upload/images',
        UPLOAD_DELETE: '/upload/image',
        UPLOAD_CROP: '/upload/crop',
        UPLOAD_RESIZE: '/upload/resize',
        UPLOAD_INFO: '/upload/image-info',
        UPLOAD_STATS: '/upload/storage-stats'
    },
    
    // Error Messages
    ERRORS: {
        NETWORK: 'Internetga ulanishda xatolik yuz berdi',
        SERVER: 'Server xatoligi yuz berdi',
        UNAUTHORIZED: 'Kirish huquqi yo\'q',
        FORBIDDEN: 'Ruxsat etilmagan',
        NOT_FOUND: 'Ma\'lumot topilmadi',
        VALIDATION: 'Ma\'lumotlar noto\'g\'ri',
        TIMEOUT: 'So\'rov vaqti tugadi',
        UNKNOWN: 'Noma\'lum xatolik yuz berdi'
    },
    
    // Success Messages
    SUCCESS: {
        LOGIN: 'Muvaffaqiyatli kirildi!',
        REGISTER: 'Muvaffaqiyatli ro\'yxatdan o\'tildi!',
        LOGOUT: 'Chiqildi!',
        CART_ADD: 'Mahsulot savatga qo\'shildi!',
        CART_UPDATE: 'Savatcha yangilandi!',
        CART_REMOVE: 'Mahsulot savatdan olib tashlandi!',
        CART_CLEAR: 'Savatcha tozalandi!',
        ORDER_CREATE: 'Buyurtma muvaffaqiyatli yaratildi!',
        PROFILE_UPDATE: 'Profil yangilandi!',
        PASSWORD_CHANGE: 'Parol o\'zgartirildi!'
    },
    
    // Product Categories Icons
    CATEGORY_ICONS: [
        '🍎', '👔', '📱', '🏠', '⚽', '📚', '🎵', '🚗',
        '💄', '👟', '🎮', '📷', '⌚', '🎯', '🏀', '🎸',
        '🍕', '☕', '🌟', '🎨', '🔧', '💎', '🌸', '🎭'
    ],
    
    // Order Status Colors
    ORDER_STATUS: {
        pending: { color: '#92400e', bg: '#fef3c7', label: 'Kutilmoqda' },
        confirmed: { color: '#1e40af', bg: '#dbeafe', label: 'Tasdiqlangan' },
        processing: { color: '#7c2d12', bg: '#fed7aa', label: 'Tayyorlanmoqda' },
        shipped: { color: '#581c87', bg: '#e9d5ff', label: 'Yuborilgan' },
        delivered: { color: '#065f46', bg: '#d1fae5', label: 'Yetkazilgan' },
        cancelled: { color: '#991b1b', bg: '#fee2e2', label: 'Bekor qilingan' }
    },
    
    // Payment Methods
    PAYMENT_METHODS: {
        cash: { label: 'Naqd pul', icon: 'fas fa-money-bill' },
        card: { label: 'Plastik karta', icon: 'fas fa-credit-card' },
        online: { label: 'Online to\'lov', icon: 'fas fa-globe' }
    },
    
    // Rating Stars
    RATING: {
        EMPTY_STAR: '☆',
        FULL_STAR: '★',
        HALF_STAR: '⭐'
    }
};

// Environment specific overrides
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    Config.API.BASE_URL = 'http://localhost/api/v1';
} else if (window.location.hostname.includes('staging')) {
    Config.API.BASE_URL = 'https://staging.dompro.itorda.uz/api/v1';
}

// Freeze config to prevent modifications
Object.freeze(Config);

// Export for use in other modules
window.Config = Config;