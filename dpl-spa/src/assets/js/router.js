// Router - Client-side routing for SPA
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.params = {};
        this.query = {};
        this.middleware = [];
        this.history = [];
        this.maxHistoryLength = 50;
        
        this.init();
    }

    // Initialize router
    init() {
        this.setupRoutes();
        this.setupEventListeners();
        this.handleInitialRoute();
    }

    // Setup default routes
    setupRoutes() {
        this.addRoute('home', {
            handler: () => this.showPage('home'),
            title: 'Bosh sahifa',
            requiresAuth: false
        });

        this.addRoute('products', {
            handler: () => this.showPage('products'),
            title: 'Mahsulotlar',
            requiresAuth: false
        });

        this.addRoute('products/:categoryId', {
            handler: (params) => this.showCategoryProducts(params.categoryId),
            title: 'Kategoriya mahsulotlari',
            requiresAuth: false
        });

        this.addRoute('product/:id', {
            handler: (params) => this.showProductDetail(params.id),
            title: 'Mahsulot batafsil',
            requiresAuth: false
        });

        this.addRoute('cart', {
            handler: () => this.showPage('cart'),
            title: 'Savatcha',
            requiresAuth: true,
            authRedirect: 'home'
        });

        this.addRoute('orders', {
            handler: () => this.showPage('orders'),
            title: 'Buyurtmalar',
            requiresAuth: true,
            authRedirect: 'home'
        });

        this.addRoute('profile', {
            handler: () => this.showPage('profile'),
            title: 'Profil',
            requiresAuth: true,
            authRedirect: 'home'
        });

        this.addRoute('search', {
            handler: () => this.showSearchResults(),
            title: 'Qidiruv natijalari',
            requiresAuth: false
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handlePopState(e);
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route], [data-route] *')) {
                e.preventDefault();
                const routeElement = e.target.closest('[data-route]');
                const route = routeElement.dataset.route;
                const params = routeElement.dataset.params ? JSON.parse(routeElement.dataset.params) : {};
                this.navigate(route, params);
            }
        });

        // Handle form submissions that should navigate
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-route-form]')) {
                e.preventDefault();
                const route = e.target.dataset.routeForm;
                const formData = new FormData(e.target);
                const params = Object.fromEntries(formData.entries());
                this.navigate(route, {}, params);
            }
        });
    }

    // Add route
    addRoute(path, config) {
        const route = {
            path: path,
            pattern: this.pathToRegex(path),
            handler: config.handler,
            title: config.title || '',
            requiresAuth: config.requiresAuth || false,
            authRedirect: config.authRedirect || 'home',
            middleware: config.middleware || [],
            meta: config.meta || {}
        };

        this.routes.set(path, route);
    }

    // Convert path to regex pattern
    pathToRegex(path) {
        const paramNames = [];
        const regexPath = path
            .replace(/\//g, '\\/')
            .replace(/:([^\/]+)/g, (match, paramName) => {
                paramNames.push(paramName);
                return '([^\\/]+)';
            });

        return {
            regex: new RegExp(`^${regexPath}`),
            paramNames: paramNames
        };
    }

    // Navigate to route
    async navigate(routeName, params = {}, query = {}) {
        try {
            // Find route
            const route = this.routes.get(routeName);
            if (!route) {
                console.error(`Route not found: ${routeName}`);
                this.navigate('home');
                return;
            }

            // Check authentication
            if (route.requiresAuth && !AuthManager.checkAuth()) {
                // Store intended route for after login
                SettingsStore.set('intended_route', { routeName, params, query });
                
                UI.Toast.warning('Bu sahifani ko\'rish uchun tizimga kirish kerak');
                AuthManager.showLogin();
                return;
            }

            // Run middleware
            const canProceed = await this.runMiddleware(route, params, query);
            if (!canProceed) {
                return;
            }

            // Update browser history
            this.updateHistory(routeName, params, query);

            // Store current route info
            this.currentRoute = routeName;
            this.params = params;
            this.query = query;

            // Update page title
            this.updatePageTitle(route.title);

            // Update navigation state
            this.updateNavigation(routeName);

            // Call route handler
            await route.handler(params, query);

            // Emit navigation event
            Utils.events.emit('route:changed', {
                route: routeName,
                params,
                query,
                title: route.title
            });

        } catch (error) {
            console.error('Navigation error:', error);
            UI.Toast.error('Sahifa yuklanishida xatolik');
        }
    }

    // Run middleware functions
    async runMiddleware(route, params, query) {
        // Global middleware
        for (const middleware of this.middleware) {
            const result = await middleware(route, params, query);
            if (result === false) {
                return false;
            }
        }

        // Route-specific middleware
        for (const middleware of route.middleware) {
            const result = await middleware(route, params, query);
            if (result === false) {
                return false;
            }
        }

        return true;
    }

    // Update browser history
    updateHistory(routeName, params, query) {
        let url = `#${routeName}`;
        
        // Add params to URL
        if (Object.keys(params).length > 0) {
            const paramString = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
            url += `?${paramString}`;
        }

        // Add query parameters
        if (Object.keys(query).length > 0) {
            const queryString = Object.keys(query)
                .map(key => `${key}=${encodeURIComponent(query[key])}`)
                .join('&');
            url += Object.keys(params).length > 0 ? `&${queryString}` : `?${queryString}`;
        }

        // Update browser URL without triggering popstate
        history.pushState(
            { route: routeName, params, query },
            '',
            url
        );

        // Add to internal history
        this.history.push({
            route: routeName,
            params,
            query,
            timestamp: Date.now(),
            title: document.title
        });

        // Limit history size
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    // Handle browser back/forward
    handlePopState(event) {
        if (event.state) {
            const { route, params, query } = event.state;
            this.navigate(route, params, query);
        } else {
            this.handleInitialRoute();
        }
    }

    // Handle initial route from URL
    handleInitialRoute() {
        const hash = window.location.hash.slice(1); // Remove #
        const [routeName, queryString] = hash.split('?');
        
        if (routeName) {
            const query = this.parseQueryString(queryString || '');
            this.navigate(routeName, {}, query);
        } else {
            this.navigate('home');
        }
    }

    // Parse query string
    parseQueryString(queryString) {
        const query = {};
        
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    query[decodeURIComponent(key)] = decodeURIComponent(value || '');
                }
            });
        }
        
        return query;
    }

    // Update page title
    updatePageTitle(title) {
        const fullTitle = title ? `${title} - ${Config.APP.NAME}` : Config.APP.NAME;
        document.title = fullTitle;
    }

    // Update navigation active states
    updateNavigation(currentRoute) {
        // Update bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Find and activate current nav item
        const currentNavItem = document.querySelector(`[onclick*="${currentRoute}"], [data-route="${currentRoute}"]`);
        if (currentNavItem) {
            currentNavItem.classList.add('active');
        }

        // Update breadcrumbs if present
        this.updateBreadcrumbs(currentRoute);
    }

    // Update breadcrumbs
    updateBreadcrumbs(currentRoute) {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;

        const breadcrumbs = this.generateBreadcrumbs(currentRoute);
        breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? crumb.title : `<a href="#" onclick="Router.navigate('${crumb.route}')">${crumb.title}</a>`}
                </span>
                ${!isLast ? '<span class="breadcrumb-separator">/</span>' : ''}
            `;
        }).join('');
    }

    // Generate breadcrumbs for current route
    generateBreadcrumbs(currentRoute) {
        const breadcrumbs = [{ route: 'home', title: 'Bosh sahifa' }];
        
        const route = this.routes.get(currentRoute);
        if (route && currentRoute !== 'home') {
            breadcrumbs.push({ route: currentRoute, title: route.title });
        }
        
        return breadcrumbs;
    }

    // Show page helper
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // Clear previous content
            mainContent.innerHTML = '';

            // Create a new page container
            const newPage = document.createElement('div');
            newPage.id = `${pageName}Page`;
            newPage.className = 'page active';
            
            // For now, just add a title. We will add full page content later.
            newPage.innerHTML = `<div class="page-header"><h1 class="page-title">${this.routes.get(pageName)?.title || 'Sahifa'}</h1></div>`;

            mainContent.appendChild(newPage);

            // Load page-specific data
            this.loadPageData(pageName);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Load page-specific data
    async loadPageData(pageName) {
        const pageElement = document.getElementById(`${pageName}Page`);
        if (!pageElement) return;

        try {
            switch (pageName) {
                case 'home':
                    pageElement.innerHTML = `
                        <div class="page-header"><h1 class="page-title">Bosh sahifa</h1></div>
                        <h2 class="section-title">Kategoriyalar</h2>
                        <div class="category-grid" id="categoriesGrid"><div class="loading"><div class="spinner"></div></div></div>
                        <h2 class="section-title">Tavsiya etilgan mahsulotlar</h2>
                        <div class="product-grid" id="featuredProductsGrid"><div class="loading"><div class="spinner"></div></div></div>
                    `;
                    this.loadCategories();
                    this.loadFeaturedProducts();
                    break;
                case 'products':
                    pageElement.innerHTML = `
                        <div class="page-header"><h1 class="page-title">Mahsulotlar</h1></div>
                        <div class="product-grid" id="productsGrid"><div class="loading"><div class="spinner"></div></div></div>
                    `;
                    this.loadProducts();
                    break;
                case 'cart':
                    pageElement.innerHTML = `
                        <div class="page-header"><h1 class="page-title">Savatcha</h1></div>
                        <div id="cartItems"></div>
                        <div id="cartSummary" class="cart-summary"></div>
                    `;
                    this.loadCart();
                    break;
                case 'orders':
                    pageElement.innerHTML = `<div class="page-header"><h1 class="page-title">Buyurtmalarim</h1></div><div class="orders-empty">Buyurtmalar yo'q</div>`;
                    break;
                case 'profile':
                    pageElement.innerHTML = `<div class="page-header"><h1 class="page-title">Profil</h1></div><div class="profile-guest">Profilni ko'rish uchun tizimga kiring</div>`;
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${pageName} data:`, error);
            pageElement.innerHTML = `<div class="error">Sahifani yuklashda xatolik</div>`;
        }
    }

    async loadCategories() {
        const container = document.getElementById('categoriesGrid');
        try {
            const { data: categories } = await window.API.categories.getAll();
            if (categories && categories.length) {
                container.innerHTML = categories.map(category => `
                    <div class="category-card" data-route="products" data-params='{"categoryId":"${category.id}"}'>
                        <div class="category-icon">🛍️</div>
                        <h3>${Utils.sanitizeHtml(category.name)}</h3>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<p>Kategoriyalar topilmadi.</p>';
            }
        } catch (error) {
            container.innerHTML = `<div class="error">Kategoriyalarni yuklab bo olmadim</div>`;
        }
    }

    async loadFeaturedProducts() {
        const container = document.getElementById('featuredProductsGrid');
        try {
            const { data: products } = await window.API.products.getFeatured();
            if (products && products.length) {
                container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
            } else {
                container.innerHTML = '<p>Tavsiya etilgan mahsulotlar topilmadi.</p>';
            }
        } catch (error) {
            container.innerHTML = `<div class="error">Mahsulotlarni yuklab bo olmadim</div>`;
        }
    }

    async loadProducts() {
        const container = document.getElementById('productsGrid');
        try {
            const { data: products } = await window.API.products.getAll();
            if (products && products.length) {
                container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
            } else {
                container.innerHTML = '<p>Mahsulotlar topilmadi.</p>';
            }
        } catch (error) {
            container.innerHTML = `<div class="error">Mahsulotlarni yuklab bo olmadim</div>`;
        }
    }

    async loadCart() {
        const itemsContainer = document.getElementById('cartItems');
        const summaryContainer = document.getElementById('cartSummary');
        try {
            const cart = await window.CartManager.getCartSummary();
            if (cart && cart.items.length) {
                itemsContainer.innerHTML = cart.items.map(item => `
                    <div class="cart-item" data-item-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.product.image || ''}" alt="${item.product.name}">
                        </div>
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.product.name}</h4>
                            <div class="cart-item-price">${Utils.formatPrice(item.price)}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" data-action="decrease">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" data-action="remove">O'chirish</button>
                    </div>
                `).join('');
                summaryContainer.innerHTML = `
                    <div class="cart-summary-row">
                        <span>Jami:</span>
                        <span class="cart-total">${Utils.formatPrice(cart.total)}</span>
                    </div>
                    <button class="btn btn-primary btn-block">Buyurtma berish</button>
                `;
            } else {
                itemsContainer.innerHTML = `<div class="cart-empty">Savatcha bo'sh</div>`;
                summaryContainer.innerHTML = '';
            }
        } catch (error) {
            itemsContainer.innerHTML = `<div class="error">Savatni yuklab bo olmadim</div>`;
        }
    }

    renderProductCard(product) {
        return `
            <div class="product-card" data-route="product" data-params='{"id":"${product.id}"}'>
                <div class="product-image">
                    <img src="${product.image || ''}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${Utils.formatPrice(product.price)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" data-action="add-to-cart" data-product-id="${product.id}">Savatga</button>
                </div>
            </div>
        `;
    }

    // Show category products
    showCategoryProducts(categoryId) {
        this.showPage('products');
        // if (window.ProductRenderer) {
        //     ProductRenderer.loadProductsByCategory(categoryId);
        // }
    }

    // Show product detail
    showProductDetail(productId) {
        // For now, show a toast. In future, implement product detail page
        // UI.Toast.info('Mahsulot batafsil sahifasi keyingi versiyada qo\'shiladi');
    }

    // Show search results
    showSearchResults() {
        const searchQuery = this.query.q || '';
        this.showPage('products');
        
        // if (window.ProductRenderer && searchQuery) {
        //     ProductRenderer.searchProducts(searchQuery);
        // }
    }

    // Add global middleware
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }

    // Go back in history
    goBack() {
        if (this.history.length > 1) {
            // Remove current page from history
            this.history.pop();
            
            // Get previous page
            const previousPage = this.history[this.history.length - 1];
            this.navigate(previousPage.route, previousPage.params, previousPage.query);
        } else {
            // Fallback to home
            this.navigate('home');
        }
    }

    // Get current route info
    getCurrentRoute() {
        return {
            route: this.currentRoute,
            params: this.params,
            query: this.query
        };
    }

    // Check if current route matches
    isCurrentRoute(routeName) {
        return this.currentRoute === routeName;
    }

    // Generate URL for route
    generateUrl(routeName, params = {}, query = {}) {
        let url = `#${routeName}`;
        
        if (Object.keys(params).length > 0 || Object.keys(query).length > 0) {
            const allParams = { ...params, ...query };
            const paramString = Object.keys(allParams)
                .map(key => `${key}=${encodeURIComponent(allParams[key])}`)
                .join('&');
            url += `?${paramString}`;
        }
        
        return url;
    }

    // Navigate to intended route after login
    navigateToIntended() {
        const intendedRoute = SettingsStore.get('intended_route');
        if (intendedRoute) {
            SettingsStore.remove('intended_route');
            this.navigate(intendedRoute.routeName, intendedRoute.params, intendedRoute.query);
        } else {
            this.navigate('home');
        }
    }

    // Redirect helper
    redirect(routeName, params = {}, query = {}) {
        // Replace current history entry instead of adding new one
        history.replaceState(
            { route: routeName, params, query },
            '',
            this.generateUrl(routeName, params, query)
        );
        
        this.navigate(routeName, params, query);
    }

    // Route guards
    guards = {
        auth: (route, params, query) => {
            if (route.requiresAuth && !AuthManager.checkAuth()) {
                AuthManager.showLogin();
                return false;
            }
            return true;
        },
        
        guest: (route, params, query) => {
            // For guest-only routes (like login page)
            if (route.guestOnly && AuthManager.checkAuth()) {
                Router.navigate('home');
                return false;
            }
            return true;
        }
    };

    // Debug method
    debug() {
        console.log('Router State:', {
            currentRoute: this.currentRoute,
            params: this.params,
            query: this.query,
            historyLength: this.history.length,
            routes: Array.from(this.routes.keys())
        });
    }
}

export default new Router();