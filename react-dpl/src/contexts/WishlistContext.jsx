
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '../components/Toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const { showToast } = useToast();

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        setWishlistItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                showToast(`'${product.name}' sevimlilardan olib tashlandi`, 'info');
                return prevItems.filter(item => item.id !== product.id);
            } else {
                showToast(`'${product.name}' sevimlilarga qo'shildi`, 'success');
                return [...prevItems, product];
            }
        });
    };

    const isItemInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isItemInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
