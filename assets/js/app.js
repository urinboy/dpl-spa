// Main App - Application initialization and coordination
class App {
    constructor() {
        this.isInitialized = false;
        this.isOnline = navigator.onLine;
        this.version = Config.APP.VERSION;
        this.startTime = Date.now();
        
        this.managers = {};
        this.renderers = {};
        this.isLoading = false;
    }

    // Initialize the application
    async init() {
        try {
            console.log(`🚀 Initializing ${Config.APP.NAME} v${this.version}`);
            
            // Show loading screen
            this.showInitialLoading();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup network monitoring
            this.setupNetworkMonitoring();
            
            // Initialize storage cleanup
            this.initStorageCleanup();
            
            // Initialize managers
            await this.initializeManagers();
            
            // Initialize renderers  
            await this.initializeRenderers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI components
            this.initializeUI();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup analytics (if needed)
            this.setupAnalytics();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Hide loading screen
            this.hideInitialLoading();
            
            // Show welcome message for new users
            this.showWelcomeMessage();
            
            console.log(`✅ App initialized in ${Date.now() - this.startTime}ms`);
            
            // Emit app ready event
            Utils.events.emit('app:ready');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    // Show initial loading screen
    showInitialLoading() {
        const loadingHTML = `
            <div id="appLoading" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🛍️</div>
                    <h1 style="font-size: 2rem; margin-bottom: 0.5rem; font-weight: bold;">${Config.APP.NAME}</h1>
                    <p style="opacity: 0.8; margin-bottom: 2rem;">Yuklanmoqda...</p>
                    <div class="spinner" style="margin: 0 auto;"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    // Hide initial loading screen
    hideInitialLoading() {
        const loading = document.getElementById('appLoading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }

    // Setup global error handling
    setupErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
            event.preventDefault();
        });

        // Handle API errors
        Utils.events.on('api:error', (error) => {
            this.handleApiError(error);
        });
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('📊 Performance metrics:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 0);
        });

        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 1000) { // Log slow resources
                        console.warn('🐌 Slow resource:', entry.name, `${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    // Setup network monitoring
    setupNetworkMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Back online');
            UI.Toast.success('Internetga ulanish tiklandi');
            Utils.events.emit('network:online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 Gone offline');
            UI.Toast.warning('Internet aloqasi uzildi');
            Utils.events.emit('network:offline');
        });

        // Monitor connection quality
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            const logConnection = () => {
                console.log('📶 Connection:', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt
                });
            };

            connection.addEventListener('change', logConnection);
            logConnection();
        }
    }

    // Initialize storage cleanup
    initStorageCleanup() {
        // Clean up expired data on startup
        Storage.cleanup();
        
        // Setup periodic cleanup
        setInterval(() => {
            Storage.cleanup();
        }, 30 * 60 * 1000); // Every 30 minutes
    }

    // Initialize managers
    async initializeManagers() {
        console.log('🔧 Initializing managers...');
        
        // Auth Manager is already initialized globally
        this.managers.auth = window.AuthManager;
        
        // Cart Manager is already initialized globally  
        this.managers.cart = window.CartManager;
        
        // Initialize other managers as needed
        // this.managers.notification = new NotificationManager();
        // this.managers.search = new SearchManager();
    }

    // Initialize renderers
    async initializeRenderers() {
        console.log('🎨 Initializing renderers...');
        
        // Renderers will be loaded from separate files
        // They should be available globally after their scripts load
        this.renderers = {
            category: window.CategoryRenderer,
            product: window.ProductRenderer,
            cart: window.CartRenderer,
            order: window.OrderRenderer,
            profile: window.ProfileRenderer
        };
    }

    // Setup global event listeners
    setupEventListeners() {
        // App-level event listeners
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals
            if (e.key === 'Escape') {
                UI.Modal.hideAll();
            }
            
            // Ctrl+K for search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
        });

        // Handle auth state changes
        Utils.events.on('auth:login', () => {
            console.log('👤 User logged in');
        });

        Utils.events.on('auth:logout', () => {
            console.log('👤 User logged out');
        });

        // Handle cart changes
        Utils.events.on('cart:updated', () => {
            console.log('🛒 Cart updated');
        });

        // Handle route changes
        Utils.events.on('route:changed', (data) => {
            console.log('🛣️ Route changed:', data.route);
            this.handleRouteChange(data);
        });

        // Handle network changes
        Utils.events.on('network:offline', () => {
            this.handleOfflineMode();
        });

        Utils.events.on('network:online', () => {
            this.handleOnlineMode();
        });

        // Handle visibility changes (tab focus/blur)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHide();
            } else {
                this.handlePageShow();
            }
        });

        // Handle before page unload
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });
    }

    // Initialize UI components
    initializeUI() {
        console.log('🎨 Initializing UI components...');
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Initialize theme
        this.initializeTheme();
        
        // Initialize language
        this.initializeLanguage();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Initialize tooltips if needed
        this.initializeTooltips();
    }

    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Debounced search
            const debouncedSearch = Utils.debounce((query) => {
                if (query.length >= Config.APP.SEARCH_MIN_LENGTH) {
                    this.performSearch(query);
                }
            }, Config.APP.SEARCH_DEBOUNCE);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value.trim());
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    if (query.length >= Config.APP.SEARCH_MIN_LENGTH) {
                        this.performSearch(query);
                    }
                }
            });
        }
    }

    // Initialize theme
    initializeTheme() {
        const savedTheme = SettingsStore.getTheme();
        this.applyTheme(savedTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (savedTheme === 'auto') {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Initialize language
    initializeLanguage() {
        const savedLanguage = SettingsStore.getLanguage();
        this.setLanguage(savedLanguage);
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Add keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Initialize tooltips
    initializeTooltips() {
        // Simple tooltip implementation
        document.addEventListener('mouseover', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                this.hideTooltip();
            }
        });
    }

    // Load initial data
    async loadInitialData() {
        console.log('📡 Loading initial data...');
        
        try {
            // Load essential data
            const promises = [];
            
            // Load categories
            if (this.renderers.category) {
                promises.push(this.renderers.category.loadCategories());
            }
            
            // Load featured products for home page
            if (this.renderers.product) {
                promises.push(this.renderers.product.loadFeaturedProducts());
            }
            
            // Wait for initial data
            await Promise.allSettled(promises);
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            // Don't block app initialization for data loading failures
        }
    }

    // Setup analytics
    setupAnalytics() {
        // Analytics setup would go here
        // For now, just log page views
        Utils.events.on('route:changed', (data) => {
            this.trackPageView(data.route, data.title);
        });
    }

    // Show welcome message for new users
    showWelcomeMessage() {
        const lastVisit = SettingsStore.getLastVisit();
        const isFirstVisit = !lastVisit;
        
        if (isFirstVisit) {
            setTimeout(() => {
                UI.Toast.info('Xush kelibsiz! Savdo qilishdan zavqlaning 🛍️', {
                    duration: 5000
                });
            }, 1000);
        }
        
        // Update last visit
        SettingsStore.setLastVisit();
    }

    // Handle route changes
    handleRouteChange(data) {
        // Update page class for styling
        document.body.className = `page-${data.route}`;
        
        // Track analytics
        this.trackPageView(data.route, data.title);
        
        // Update any global UI based on route
        this.updateGlobalUI(data.route);
    }

    // Handle offline mode
    handleOfflineMode() {
        document.body.classList.add('offline');
        // Enable offline features if any
    }

    // Handle online mode  
    handleOnlineMode() {
        document.body.classList.remove('offline');
        // Sync offline changes if any
        this.syncOfflineData();
    }

    // Handle page hide (tab blur)
    handlePageHide() {
        // Save current state
        this.saveAppState();
        
        // Pause non-critical operations
        this.pauseBackgroundTasks();
    }

    // Handle page show (tab focus)
    handlePageShow() {
        // Resume operations
        this.resumeBackgroundTasks();
        
        // Check for updates if been away for a while
        this.checkForUpdates();
    }

    // Handle before page unload
    handleBeforeUnload(event) {
        // Save critical data
        this.saveAppState();
        
        // If there are unsaved changes, warn user
        if (this.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = 'Saqlashgan o\'zgarishlar yo\'qolishi mumkin. Sahifani yopishni xohlaysizmi?';
            return event.returnValue;
        }
    }

    // Error handling methods
    handleError(error) {
        console.error('Application error:', error);
        
        // Don't show error toasts for minor errors
        if (this.isCriticalError(error)) {
            UI.Toast.error('Kutilmagan xatolik yuz berdi');
        }
        
        // Log error for debugging
        this.logError(error);
    }

    handleApiError(error) {
        console.error('API error:', error);
        
        if (error.status === 401) {
            // Unauthorized - redirect to login
            AuthManager.handleTokenExpired();
        } else if (error.status === 403) {
            UI.Toast.error('Bu amalni bajarish uchun ruxsat yo\'q');
        } else if (error.status >= 500) {
            UI.Toast.error('Server xatoligi. Iltimos, keyinroq urinib ko\'ring');
        } else if (!this.isOnline) {
            UI.Toast.warning('Internet aloqasini tekshiring');
        } else {
            UI.Toast.error(error.message || 'Xatolik yuz berdi');
        }
    }

    handleInitializationError(error) {
        // Show critical error message
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                padding: 2rem;
                background: var(--gray-100);
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem; color: var(--danger-color);">⚠️</div>
                <h1 style="color: var(--gray-900); margin-bottom: 1rem;">Ilovada xatolik</h1>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">
                    Ilovani yuklashda xatolik yuz berdi. Sahifani yangilab ko'ring.
                </p>
                <button onclick="window.location.reload()" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                    Sahifani yangilash
                </button>
            </div>
        `;
    }

    // Utility methods
    isCriticalError(error) {
        // Define what constitutes a critical error
        return error.name === 'ChunkLoadError' || 
               error.message.includes('Loading chunk') ||
               error.message.includes('Network Error');
    }

    logError(error) {
        // In production, send to error logging service
        const errorData = {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            userId: AuthManager.getCurrentUser()?.id
        };
        
        // Store locally for now
        const errors = Storage.get('app_errors', []);
        errors.push(errorData);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.shift();
        }
        
        Storage.set('app_errors', errors);
    }

    // Search functionality
    performSearch(query) {
        console.log('🔍 Searching for:', query);
        
        // Navigate to search results
        Router.navigate('search', {}, { q: query });
        
        // Track search
        this.trackSearch(query);
    }

    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // Theme management
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        SettingsStore.setTheme(theme);
    }

    // Language management
    setLanguage(language) {
        document.documentElement.lang = language;
        SettingsStore.setLanguage(language);
        
        // Update UI text if i18n is implemented
        this.updateLanguageStrings(language);
    }

    updateLanguageStrings(language) {
        // Placeholder for internationalization
        // Would update all text content based on language
    }

    // Tooltip functionality
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--gray-900);
            color: var(--white);
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            z-index: var(--z-tooltip);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        
        // Show tooltip
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        this.activeTooltip = tooltip;
    }

    hideTooltip() {
        if (this.activeTooltip) {
            this.activeTooltip.style.opacity = '0';
            setTimeout(() => {
                if (this.activeTooltip && this.activeTooltip.parentNode) {
                    this.activeTooltip.parentNode.removeChild(this.activeTooltip);
                }
                this.activeTooltip = null;
            }, 200);
        }
    }

    // State management
    saveAppState() {
        const state = {
            route: Router.getCurrentRoute(),
            timestamp: Date.now(),
            version: this.version
        };
        
        Storage.set('app_state', state);
    }

    restoreAppState() {
        const state = Storage.get('app_state');
        if (state && state.version === this.version) {
            // Restore state if needed
            return state;
        }
        return null;
    }

    hasUnsavedChanges() {
        // Check if there are any unsaved changes in forms, cart, etc.
        const forms = document.querySelectorAll('form[data-unsaved]');
        return forms.length > 0;
    }

    // Background tasks
    pauseBackgroundTasks() {
        // Pause any background operations when tab is not visible
        clearInterval(this.backgroundTimer);
    }

    resumeBackgroundTasks() {
        // Resume background operations
        this.backgroundTimer = setInterval(() => {
            this.performBackgroundTasks();
        }, 30000); // Every 30 seconds
    }

    performBackgroundTasks() {
        // Cleanup storage
        Storage.cleanup();
        
        // Sync cart if authenticated
        if (AuthManager.checkAuth()) {
            // Silent cart sync
        }
        
        // Check for app updates
        this.checkForUpdates();
    }

    // Update checking
    async checkForUpdates() {
        try {
            // In a real app, check for service worker updates
            // or fetch version info from server
            
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    registration.update();
                }
            }
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    // Offline data sync
    async syncOfflineData() {
        try {
            // Sync any offline changes when coming back online
            if (AuthManager.checkAuth()) {
                await CartManager.syncCart();
            }
        } catch (error) {
            console.error('Offline sync failed:', error);
        }
    }

    // Analytics
    trackPageView(route, title) {
        // Track page view for analytics
        console.log('📊 Page view:', route, title);
        
        // In production, send to analytics service
        const pageView = {
            route,
            title,
            timestamp: Date.now(),
            referrer: document.referrer,
            userId: AuthManager.getCurrentUser()?.id
        };
        
        // Store locally for now
        const pageViews = Storage.get('page_views', []);
        pageViews.push(pageView);
        
        // Keep only last 100 page views
        if (pageViews.length > 100) {
            pageViews.shift();
        }
        
        Storage.set('page_views', pageViews);
    }

    trackSearch(query) {
        // Track search queries
        const searches = Storage.get('searches', []);
        searches.push({
            query,
            timestamp: Date.now(),
            userId: AuthManager.getCurrentUser()?.id
        });
        
        if (searches.length > 50) {
            searches.shift();
        }
        
        Storage.set('searches', searches);
    }

    // Update global UI
    updateGlobalUI(currentRoute) {
        // Update any global UI elements based on current route
        const headerActions = document.querySelector('.header-actions');
        
        if (headerActions) {
            // Show/hide certain buttons based on route
            if (currentRoute === 'cart') {
                // Maybe hide cart button when on cart page
            }
        }
    }

    // Debug methods
    getDebugInfo() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            isOnline: this.isOnline,
            currentRoute: Router.getCurrentRoute(),
            authState: AuthManager.getSessionInfo(),
            cartStats: CartManager.getCartStats(),
            storageStats: Storage.getStats(),
            errors: Storage.get('app_errors', []),
            performance: {
                initTime: Date.now() - this.startTime,
                memoryUsage: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                } : null
            }
        };
    }

    debug() {
        console.table(this.getDebugInfo());
    }

    // App lifecycle methods
    async restart() {
        console.log('🔄 Restarting app...');
        
        // Clean shutdown
        await this.shutdown();
        
        // Reload page
        window.location.reload();
    }

    async shutdown() {
        console.log('🛑 Shutting down app...');
        
        // Save current state
        this.saveAppState();
        
        // Clear timers
        clearInterval(this.backgroundTimer);
        
        // Cleanup managers
        Object.values(this.managers).forEach(manager => {
            if (manager && typeof manager.shutdown === 'function') {
                manager.shutdown();
            }
        });
        
        // Mark as not initialized
        this.isInitialized = false;
    }

    // Health check
    healthCheck() {
        const health = {
            status: 'healthy',
            checks: {
                initialization: this.isInitialized,
                network: this.isOnline,
                authentication: AuthManager.checkAuth(),
                storage: Storage.isAvailable(),
                router: Router.getCurrentRoute() !== null
            }
        };
        
        // Determine overall health
        const failedChecks = Object.entries(health.checks)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        if (failedChecks.length > 0) {
            health.status = 'unhealthy';
            health.failures = failedChecks;
        }
        
        return health;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Create global app instance
    window.App = new App();
    
    // Start the app
    await App.init();
    
    // Make debug methods available in development
    if (Config.APP.DEBUG) {
        window.debug = () => {
            console.group('🔍 Debug Info');
            App.debug();
            AuthManager.debug();
            CartManager.debug();
            Router.debug();
            console.groupEnd();
        };
        
        window.healthCheck = () => {
            console.log('🏥 Health Check:', App.healthCheck());
        };
    }
});

// Handle app installation (PWA)
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💾 App can be installed');
    
    // Store the event for later use
    window.deferredPrompt = e;
    
    // Show install button or banner if needed
    // showInstallBanner();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}