import React, { createContext, useState, useContext, useEffect } from 'react';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [checkoutData, setCheckoutData] = useState({
        // Buyurtma ma'lumotlari
        items: [],
        
        // Yetkazib berish ma'lumotlari
        deliveryInfo: {
            address: null,
            deliveryMethod: 'standard',
            deliveryDate: null,
            deliveryTime: null
        },
        
        // To'lov ma'lumotlari
        paymentInfo: {
            method: null,
            cardDetails: null,
            installments: 1
        },
        
        // Qo'shimcha ma'lumotlar
        customerNotes: '',
        promoCode: null,
        discount: 0
    });

    const updateCheckoutData = (section, data) => {
        setCheckoutData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const nextStep = () => {
        if (checkoutStep < 4) {
            setCheckoutStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (checkoutStep > 1) {
            setCheckoutStep(prev => prev - 1);
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 1: // Savat tekshiruvi
                return checkoutData.items && checkoutData.items.length > 0;
            case 2: // Yetkazib berish ma'lumotlari
                return checkoutData.deliveryInfo.address !== null;
            case 3: // To'lov ma'lumotlari
                return checkoutData.paymentInfo.method !== null;
            case 4: // Yakuniy tasdiqlash
                return true;
            default:
                return false;
        }
    };

    const calculateTotals = () => {
        const subtotal = checkoutData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = checkoutData.deliveryInfo.deliveryMethod === 'express' ? 50000 : 25000;
        const discountAmount = (subtotal * checkoutData.discount) / 100;
        const total = subtotal + deliveryCost - discountAmount;

        return {
            subtotal,
            deliveryCost,
            discountAmount,
            total
        };
    };

    const submitOrder = async () => {
        try {
            const orderData = {
                ...checkoutData,
                totals: calculateTotals(),
                orderDate: new Date().toISOString(),
                status: 'pending'
            };

            // Bu yerda API ga so'rov yuboriladi
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const order = await response.json();
                // Buyurtma muvaffaqiyatli yaratildi
                return { success: true, order };
            } else {
                throw new Error('Buyurtma yaratishda xatolik');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return (
        <CheckoutContext.Provider value={{
            checkoutStep,
            checkoutData,
            updateCheckoutData,
            nextStep,
            prevStep,
            validateStep,
            calculateTotals,
            submitOrder
        }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
