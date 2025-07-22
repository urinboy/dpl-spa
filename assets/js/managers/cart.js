// Cart Manager - Handles shopping cart functionality
class CartManager {
    constructor() {
        this.cart = { items: [], total: 0, count: 0 };
        this.isLoading = false;
        this.localCart = { items: [], total: 0, count: 0 };
        
        this.init();
    }

    // Initialize cart manager
    async init() {
        // Load local cart first
        this.loadLocalCart();
        
        // If authenticated, sync with server
        if (AuthManager.checkAuth()) {
            await this.syncCart();
        }
        
        this.setupEventListeners();
        this.updateCartBadge();
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for auth events
        Utils.events.on('auth:login', () => this.handleAuthLogin());
        Utils.events.on('auth:logout', () => this.handleAuthLogout());
        
        // Listen for cart update events
        Utils.events.on('cart:updated', () => this.updateCartBadge());
        
        // Setup quantity change listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('.quantity-btn, .quantity-btn *')) {
                const btn = e.target.closest('.quantity-btn');
                if (btn) {
                    this.handleQuantityChange(btn, e);
                }
            }
        });
    }

    // Handle authentication login
    async handleAuthLogin() {
        // Sync local cart with server cart
        await this.syncCart();
    }

    // Handle authentication logout
    handleAuthLogout() {
        // Clear server cart, keep local cart
        this.cart = { items: [], total: 0, count: 0 };
        this.updateCartBadge();
    }

    // Load cart from server
    async loadCart() {
        if (!AuthManager.checkAuth()) {
            this.cart = this.localCart;
            return this.cart;
        }

        try {
            this.isLoading = true;
            const response = await API.cart.get();
            
            if (response.success) {
                this.cart = this.processCartData(response.data);
                Utils.events.emit('cart:loaded', this.cart);
                return this.cart;
            } else {
                throw new Error(response.message || 'Failed to load cart');
            }
        } catch (error) {
            console.error('Load cart error:', error);
            // Fallback to local cart
            this.cart = this.localCart;
            return this.cart;
        } finally {
            this.isLoading = false;
        }
    }

    // Process cart data from API
    processCartData(data) {
        return {
            items: data.items || [],
            total: data.total_amount || 0,
            count: data.items_count || 0,
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            shipping: data.shipping || 0,
            discount: data.discount || 0,
            currency: data.currency || Config.APP.DEFAULT_CURRENCY
        };
    }

    // Add item to cart
    async addToCart(productId, quantity = 1, options = {}) {
        const { 
            showToast = true, 
            updateBadge = true,
            variant = null 
        } = options;

        try {
            if (AuthManager.checkAuth()) {
                // Add to server cart
                const response = await API.cart.add(productId, quantity);
                
                if (response.success) {
                    this.cart = this.processCartData(response.data);
                    
                    if (showToast) {
                        UI.Toast.success(Config.SUCCESS.CART_ADD);
                    }
                } else {
                    throw new Error(response.message || 'Failed to add to cart');
                }
            } else {
                // Add to local cart
                await this.addToLocalCart(productId, quantity, variant);
                
                if (showToast) {
                    UI.Toast.success(Config.SUCCESS.CART_ADD);
                }
            }
            
            if (updateBadge) {
                this.updateCartBadge();
            }
            
            Utils.events.emit('cart:item-added', { productId, quantity });
            
            return true;
        } catch (error) {
            console.error('Add to cart error:', error);
            
            if (showToast) {
                UI.Toast.error(error.message || 'Savatga qo\'shishda xatolik');
            }
            
            return false;
        }
    }

    // Add to local cart
    async addToLocalCart(productId, quantity, variant = null) {
        try {
            // Get product details (cache or API)
            const product = await this.getProductDetails(productId);
            
            if (!product) {
                throw new Error('Mahsulot topilmadi');
            }

            const existingItemIndex = this.localCart.items.findIndex(item => 
                item.product_id === productId && 
                JSON.stringify(item.variant) === JSON.stringify(variant)
            );

            if (existingItemIndex > -1) {
                // Update existing item
                this.localCart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                const cartItem = {
                    id: Utils.generateId('local_item'),
                    product_id: productId,
                    product: product,
                    quantity: quantity,
                    price: product.current_price || product.price,
                    variant: variant,
                    total: (product.current_price || product.price) * quantity
                };
                
                this.localCart.items.push(cartItem);
            }

            this.calculateLocalCartTotals();
            this.saveLocalCart();
            
        } catch (error) {
            console.error('Add to local cart error:', error);
            throw error;
        }
    }

    // Get product details for local cart
    async getProductDetails(productId) {
        try {
            // Check cache first
            const cacheKey = `product_${productId}`;
            let product = Storage.get(cacheKey);
            
            if (!product) {
                // Fetch from API
                const response = await API.products.getById(productId);
                if (response.success) {
                    product = response.data;
                    // Cache for 10 minutes
                    Storage.set(cacheKey, product, { expiryInMinutes: 10 });
                }
            }
            
            return product;
        } catch (error) {
            console.error('Get product details error:', error);
            return null;
        }
    }

    // Update cart item quantity
    async updateCartQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            return this.removeFromCart(itemId);
        }

        try {
            if (AuthManager.checkAuth()) {
                // Update server cart
                const response = await API.cart.update(itemId, newQuantity);
                
                if (response.success) {
                    this.cart = this.processCartData(response.data);
                    Utils.events.emit('cart:item-updated', { itemId, newQuantity });
                    return true;
                } else {
                    throw new Error(response.message || 'Failed to update cart');
                }
            } else {
                // Update local cart
                const item = this.localCart.items.find(item => item.id === itemId);
                if (item) {
                    item.quantity = newQuantity;
                    item.total = item.price * newQuantity;
                    
                    this.calculateLocalCartTotals();
                    this.saveLocalCart();
                    
                    Utils.events.emit('cart:item-updated', { itemId, newQuantity });
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Update cart quantity error:', error);
            UI.Toast.error(error.message || 'Miqdorni yangilashda xatolik');
            return false;
        }
    }

    // Remove item from cart
    async removeFromCart(itemId, showToast = true) {
        try {
            if (AuthManager.checkAuth()) {
                // Remove from server cart
                const response = await API.cart.remove(itemId);
                
                if (response.success) {
                    this.cart = this.processCartData(response.data);
                    
                    if (showToast) {
                        UI.Toast.success(Config.SUCCESS.CART_REMOVE);
                    }
                } else {
                    throw new Error(response.message || 'Failed to remove from cart');
                }
            } else {
                // Remove from local cart
                this.localCart.items = this.localCart.items.filter(item => item.id !== itemId);
                this.calculateLocalCartTotals();
                this.saveLocalCart();
                
                if (showToast) {
                    UI.Toast.success(Config.SUCCESS.CART_REMOVE);
                }
            }
            
            this.updateCartBadge();
            Utils.events.emit('cart:item-removed', { itemId });
            
            return true;
        } catch (error) {
            console.error('Remove from cart error:', error);
            
            if (showToast) {
                UI.Toast.error(error.message || 'Mahsulotni o\'chirishda xatolik');
            }
            
            return false;
        }
    }

    // Clear entire cart
    async clearCart(showToast = true) {
        try {
            const confirmed = confirm('Savatchani butunlay tozalashni xohlaysizmi?');
            if (!confirmed) return false;

            if (AuthManager.checkAuth()) {
                // Clear server cart
                const response = await API.cart.clear();
                
                if (response.success) {
                    this.cart = { items: [], total: 0, count: 0 };
                    
                    if (showToast) {
                        UI.Toast.success(Config.SUCCESS.CART_CLEAR);
                    }
                } else {
                    throw new Error(response.message || 'Failed to clear cart');
                }
            } else {
                // Clear local cart
                this.localCart = { items: [], total: 0, count: 0 };
                this.saveLocalCart();
                
                if (showToast) {
                    UI.Toast.success(Config.SUCCESS.CART_CLEAR);
                }
            }
            
            this.updateCartBadge();
            Utils.events.emit('cart:cleared');
            
            return true;
        } catch (error) {
            console.error('Clear cart error:', error);
            
            if (showToast) {
                UI.Toast.error(error.message || 'Savatchani tozalashda xatolik');
            }
            
            return false;
        }
    }

    // Sync local cart with server cart
    async syncCart() {
        if (!AuthManager.checkAuth() || this.localCart.items.length === 0) {
            await this.loadCart();
            return;
        }

        try {
            UI.Loading.show('Savatcha sinxronizatsiya qilinmoqda...');
            
            // Load server cart first
            await this.loadCart();
            
            // Add local items to server cart
            for (const localItem of this.localCart.items) {
                await this.addToCart(
                    localItem.product_id, 
                    localItem.quantity, 
                    { showToast: false, updateBadge: false }
                );
            }
            
            // Clear local cart after sync
            this.clearLocalCart();
            
            // Reload final cart state
            await this.loadCart();
            
            UI.Toast.success('Savatcha sinxronizatsiya qilindi');
        } catch (error) {
            console.error('Cart sync error:', error);
            UI.Toast.warning('Savatcha sinxronizatsiya qilinmadi');
        } finally {
            UI.Loading.hide();
        }
    }

    // Calculate local cart totals
    calculateLocalCartTotals() {
        this.localCart.total = this.localCart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        this.localCart.count = this.localCart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        
        this.cart = this.localCart;
    }

    // Load cart count for badge
    async loadCartCount() {
        try {
            if (AuthManager.checkAuth()) {
                const cart = await this.loadCart();
                return cart.count || 0;
            } else {
                this.loadLocalCart();
                return this.localCart.count || 0;
            }
        } catch (error) {
            console.error('Load cart count error:', error);
            return 0;
        }
    }

    // Update cart badge
    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const count = AuthManager.checkAuth() ? this.cart.count : this.localCart.count;
            cartBadge.textContent = count || 0;
            
            // Add animation for updates
            cartBadge.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Handle quantity change from UI
    async handleQuantityChange(btn, event) {
        event.preventDefault();
        
        const itemId = btn.dataset.itemId || btn.closest('[data-item-id]')?.dataset.itemId;
        const action = btn.dataset.action;
        
        if (!itemId) return;
        
        const currentQuantityElement = btn.parentNode.querySelector('.quantity-display');
        if (!currentQuantityElement) return;
        
        const currentQuantity = parseInt(currentQuantityElement.textContent) || 1;
        let newQuantity = currentQuantity;
        
        if (action === 'increase') {
            newQuantity = Math.min(currentQuantity + 1, Config.APP.CART_MAX_ITEMS);
        } else if (action === 'decrease') {
            newQuantity = Math.max(currentQuantity - 1, 0);
        }
        
        if (newQuantity !== currentQuantity) {
            // Optimistic update
            currentQuantityElement.textContent = newQuantity;
            
            // Update cart
            const success = await this.updateCartQuantity(itemId, newQuantity);
            
            if (!success) {
                // Revert on failure
                currentQuantityElement.textContent = currentQuantity;
            }
        }
    }

    // Local storage operations
    loadLocalCart() {
        this.localCart = CartStore.getCart();
        if (!AuthManager.checkAuth()) {
            this.cart = this.localCart;
        }
    }

    saveLocalCart() {
        CartStore.setCart(this.localCart);
    }

    clearLocalCart() {
        this.localCart = { items: [], total: 0, count: 0 };
        CartStore.clearCart();
    }

    // Show cart page
    showCart() {
        if (!AuthManager.checkAuth() && this.localCart.items.length === 0) {
            UI.Toast.info('Savatcha bo\'sh');
            return;
        }
        
        Router.navigate('cart');
    }

    // Get cart summary for checkout
    getCartSummary() {
        const currentCart = AuthManager.checkAuth() ? this.cart : this.localCart;
        
        return {
            items: currentCart.items,
            itemCount: currentCart.count,
            subtotal: currentCart.subtotal || currentCart.total,
            tax: currentCart.tax || 0,
            shipping: currentCart.shipping || 0,
            discount: currentCart.discount || 0,
            total: currentCart.total,
            currency: currentCart.currency || Config.APP.DEFAULT_CURRENCY
        };
    }

    // Validate cart for checkout
    validateCart() {
        const currentCart = AuthManager.checkAuth() ? this.cart : this.localCart;
        const errors = [];
        
        if (!currentCart.items || currentCart.items.length === 0) {
            errors.push('Savatcha bo\'sh');
        }
        
        // Check item availability
        currentCart.items.forEach((item, index) => {
            if (!item.product) {
                errors.push(`${index + 1}-mahsulot ma\'lumotlari topilmadi`);
            } else if (item.quantity <= 0) {
                errors.push(`${item.product.name} miqdori noto'g'ri`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Apply coupon/discount code
    async applyCoupon(code) {
        try {
            UI.Loading.show('Kupon tekshirilmoqda...');
            
            // TODO: Implement coupon API
            // const response = await API.cart.applyCoupon(code);
            
            UI.Toast.info('Kupon funksiyasi tez orada qo\'shiladi');
        } catch (error) {
            console.error('Apply coupon error:', error);
            UI.Toast.error('Kupon qo\'llashda xatolik');
        } finally {
            UI.Loading.hide();
        }
    }

    // Get cart statistics for analytics
    getCartStats() {
        const currentCart = AuthManager.checkAuth() ? this.cart : this.localCart;
        
        return {
            itemCount: currentCart.count,
            uniqueItems: currentCart.items.length,
            totalValue: currentCart.total,
            averageItemPrice: currentCart.items.length > 0 ? 
                currentCart.total / currentCart.items.reduce((sum, item) => sum + item.quantity, 0) : 0,
            categories: [...new Set(currentCart.items.map(item => item.product?.category_id).filter(Boolean))],
            isAuthenticated: AuthManager.checkAuth()
        };
    }

    // Debug method
    debug() {
        console.log('Cart Manager State:', {
            cart: this.cart,
            localCart: this.localCart,
            isLoading: this.isLoading,
            isAuthenticated: AuthManager.checkAuth()
        });
    }
}

// Create and export global instance
const CartManager = new CartManager();

// Make globally available
window.CartManager = CartManager;