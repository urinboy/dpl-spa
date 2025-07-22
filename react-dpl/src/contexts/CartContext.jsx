import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartStore, AuthStore, SettingsStore } from '../services/storage';
import { API } from '../services/api';
import { Utils } from '../services/utils.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [localCart, setLocalCart] = useState({ items: [], total: 0, count: 0 });

    // Helper to process cart data from API
    const processCartData = useCallback((data) => {
        return {
            items: data.items || [],
            total: data.total_amount || 0,
            count: data.items_count || 0,
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            shipping: data.shipping || 0,
            discount: data.discount || 0,
            currency: data.currency || Utils.Config.APP.DEFAULT_CURRENCY
        };
    }, []);

    // Load cart from server or local storage
    const loadCart = useCallback(async () => {
        const isAuthenticated = AuthStore.isAuthenticated();
        if (!isAuthenticated) {
            const storedLocalCart = CartStore.getCart();
            setLocalCart(storedLocalCart);
            setCart(storedLocalCart);
            return storedLocalCart;
        }

        try {
            setIsLoading(true);
            const response = await API.cart.get();
            if (response.success) {
                const processedCart = processCartData(response.data);
                setCart(processedCart);
                Utils.events.emit('cart:loaded', processedCart);
                return processedCart;
            } else {
                throw new Error(response.message || 'Failed to load cart');
            }
        } catch (error) {
            console.error('Load cart error:', error);
            // Fallback to local cart if API fails
            const storedLocalCart = CartStore.getCart();
            setLocalCart(storedLocalCart);
            setCart(storedLocalCart);
            return storedLocalCart;
        } finally {
            setIsLoading(false);
        }
    }, [processCartData]);

    // Add item to cart
    const addToCart = useCallback(async (productId, quantity = 1, options = {}) => {
        const { showToast = true, updateBadge = true, variant = null } = options;
        const isAuthenticated = AuthStore.isAuthenticated();

        try {
            if (isAuthenticated) {
                const response = await API.cart.add(productId, quantity);
                if (response.success) {
                    setCart(processCartData(response.data));
                    if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_ADD); */ }
                } else {
                    throw new Error(response.message || 'Failed to add to cart');
                }
            }
            else {
                // Add to local cart
                const product = await getProductDetails(productId);
                if (!product) { throw new Error('Mahsulot topilmadi'); }

                setLocalCart(prevLocalCart => {
                    const existingItemIndex = prevLocalCart.items.findIndex(item => 
                        item.product_id === productId && 
                        JSON.stringify(item.variant) === JSON.stringify(variant)
                    );

                    let updatedItems;
                    if (existingItemIndex > -1) {
                        updatedItems = prevLocalCart.items.map((item, index) => 
                            index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
                        );
                    } else {
                        const cartItem = {
                            id: Utils.generateId('local_item'),
                            product_id: productId,
                            product: product,
                            quantity: quantity,
                            price: product.current_price || product.price,
                            variant: variant,
                            total: (product.current_price || product.price) * quantity
                        };
                        updatedItems = [...prevLocalCart.items, cartItem];
                    }
                    const newLocalCart = { ...prevLocalCart, items: updatedItems };
                    calculateLocalCartTotals(newLocalCart);
                    CartStore.setCart(newLocalCart);
                    setCart(newLocalCart); // Update main cart state as well
                    return newLocalCart;
                });
                if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_ADD); */ }
            }
            if (updateBadge) { updateCartBadge(); }
            Utils.events.emit('cart:item-added', { productId, quantity });
            return true;
        } catch (error) {
            console.error('Add to cart error:', error);
            if (showToast) { /* UI.Toast.error(error.message || 'Savatga qo\'shishda xatolik'); */ }
            return false;
        }
    }, [processCartData]);

    // Get product details for local cart (mock/cache for now)
    const getProductDetails = useCallback(async (productId) => {
        try {
            const cacheKey = `product_${productId}`;
            let product = Utils.Storage.get(cacheKey);
            if (!product) {
                const response = await API.products.getById(productId);
                if (response.success) {
                    product = response.data;
                    Utils.Storage.set(cacheKey, product, { expiryInMinutes: 10 });
                }
            }
            return product;
        } catch (error) {
            console.error('Get product details error:', error);
            return null;
        }
    }, []);

    // Update cart item quantity
    const updateCartQuantity = useCallback(async (itemId, newQuantity) => {
        if (newQuantity <= 0) { return removeFromCart(itemId); }
        const isAuthenticated = AuthStore.isAuthenticated();

        try {
            if (isAuthenticated) {
                const response = await API.cart.update(itemId, newQuantity);
                if (response.success) {
                    setCart(processCartData(response.data));
                    Utils.events.emit('cart:item-updated', { itemId, newQuantity });
                    return true;
                } else {
                    throw new Error(response.message || 'Failed to update cart');
                }
            } else {
                setLocalCart(prevLocalCart => {
                    const updatedItems = prevLocalCart.items.map(item => 
                        item.id === itemId ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item
                    );
                    const newLocalCart = { ...prevLocalCart, items: updatedItems };
                    calculateLocalCartTotals(newLocalCart);
                    CartStore.setCart(newLocalCart);
                    setCart(newLocalCart); // Update main cart state as well
                    return newLocalCart;
                });
                Utils.events.emit('cart:item-updated', { itemId, newQuantity });
                return true;
            }
        } catch (error) {
            console.error('Update cart quantity error:', error);
            // UI.Toast.error(error.message || 'Miqdorni yangilashda xatolik'); // Will be handled by React component
            return false;
        }
    }, [processCartData]);

    // Remove item from cart
    const removeFromCart = useCallback(async (itemId, showToast = true) => {
        const isAuthenticated = AuthStore.isAuthenticated();

        try {
            if (isAuthenticated) {
                const response = await API.cart.remove(itemId);
                if (response.success) {
                    setCart(processCartData(response.data));
                    if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_REMOVE); */ }
                } else {
                    throw new Error(response.message || 'Failed to remove from cart');
                }
            } else {
                setLocalCart(prevLocalCart => {
                    const updatedItems = prevLocalCart.items.filter(item => item.id !== itemId);
                    const newLocalCart = { ...prevLocalCart, items: updatedItems };
                    calculateLocalCartTotals(newLocalCart);
                    CartStore.setCart(newLocalCart);
                    setCart(newLocalCart); // Update main cart state as well
                    return newLocalCart;
                });
                if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_REMOVE); */ }
            }
            updateCartBadge();
            Utils.events.emit('cart:item-removed', { itemId });
            return true;
        } catch (error) {
            console.error('Remove from cart error:', error);
            if (showToast) { /* UI.Toast.error(error.message || 'Mahsulotni o\'chirishda xatolik'); */ }
            return false;
        }
    }, [processCartData]);

    // Clear entire cart
    const clearCart = useCallback(async (showToast = true) => {
        const confirmed = window.confirm('Savatchani butunlay tozalashni xohlaysizmi?');
        if (!confirmed) return false;
        const isAuthenticated = AuthStore.isAuthenticated();

        try {
            if (isAuthenticated) {
                const response = await API.cart.clear();
                if (response.success) {
                    setCart({ items: [], total: 0, count: 0 });
                    if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_CLEAR); */ }
                } else {
                    throw new Error(response.message || 'Failed to clear cart');
                }
            }
            else {
                setLocalCart({ items: [], total: 0, count: 0 });
                CartStore.clearCart();
                setCart({ items: [], total: 0, count: 0 }); // Update main cart state as well
                if (showToast) { /* UI.Toast.success(Utils.Config.SUCCESS.CART_CLEAR); */ }
            }
            updateCartBadge();
            Utils.events.emit('cart:cleared');
            return true;
        } catch (error) {
            console.error('Clear cart error:', error);
            if (showToast) { /* UI.Toast.error(error.message || 'Savatchani tozalashda xatolik'); */ }
            return false;
        }
    }, []);

    // Sync local cart with server cart
    const syncCart = useCallback(async () => {
        const isAuthenticated = AuthStore.isAuthenticated();
        if (!isAuthenticated || localCart.items.length === 0) { await loadCart(); return; }

        try {
            // UI.Loading.show('Savatcha sinxronizatsiya qilinmoqda...'); // Will be handled by React component
            await loadCart(); // Load server cart first
            for (const localItem of localCart.items) {
                await addToCart(localItem.product_id, localItem.quantity, { showToast: false, updateBadge: false });
            }
            clearLocalCart(); // Clear local cart after sync
            await loadCart(); // Reload final cart state
            // UI.Toast.success('Savatcha sinxronizatsiya qilindi'); // Will be handled by React component
        } catch (error) {
            console.error('Cart sync error:', error);
            // UI.Toast.warning('Savatcha sinxronizatsiya qilinmadi'); // Will be handled by React component
        } finally {
            // UI.Loading.hide(); // Will be handled by React component
        }
    }, [localCart, loadCart, addToCart]);

    // Calculate local cart totals
    const calculateLocalCartTotals = useCallback((cartToCalculate) => {
        cartToCalculate.total = cartToCalculate.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        cartToCalculate.count = cartToCalculate.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    }, []);

    // Update cart badge (DOM manipulation, will be refactored)
    const updateCartBadge = useCallback(() => {
        const cartBadgeElement = document.getElementById('cartBadge');
        if (cartBadgeElement) {
            const count = AuthStore.isAuthenticated() ? cart.count : localCart.count;
            cartBadgeElement.textContent = count || 0;
            cartBadgeElement.style.transform = 'scale(1.2)';
            setTimeout(() => { cartBadgeElement.style.transform = 'scale(1)'; }, 200);
        }
    }, [cart, localCart]);

    // Local storage operations
    const loadLocalCart = useCallback(() => {
        const storedLocalCart = CartStore.getCart();
        setLocalCart(storedLocalCart);
        if (!AuthStore.isAuthenticated()) { setCart(storedLocalCart); }
    }, []);

    const saveLocalCart = useCallback(() => {
        CartStore.setCart(localCart);
    }, [localCart]);

    const clearLocalCart = useCallback(() => {
        setLocalCart({ items: [], total: 0, count: 0 });
        CartStore.clearCart();
    }, []);

    // Initial load and event listeners
    useEffect(() => {
        loadLocalCart();
        if (AuthStore.isAuthenticated()) { loadCart(); }

        const handleAuthLogin = () => syncCart();
        const handleAuthLogout = () => {
            setCart({ items: [], total: 0, count: 0 });
            updateCartBadge();
        };

        Utils.events.on('auth:login', handleAuthLogin);
        Utils.events.on('auth:logout', handleAuthLogout);
        Utils.events.on('cart:updated', updateCartBadge);

        return () => {
            Utils.events.off('auth:login', handleAuthLogin);
            Utils.events.off('auth:logout', handleAuthLogout);
            Utils.events.off('cart:updated', updateCartBadge);
        };
    }, [loadLocalCart, loadCart, syncCart, updateCartBadge]);

    const value = {
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        syncCart,
        getCartSummary: () => AuthStore.isAuthenticated() ? cart : localCart,
        // Add other CartManager methods as needed
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);