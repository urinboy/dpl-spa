import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../contexts/CheckoutContext';
import Meta from '../components/Meta';

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartItems } = useCart();
    const {
        checkoutStep,
        checkoutData,
        updateCheckoutData,
        nextStep,
        prevStep,
        validateStep,
        calculateTotals,
        submitOrder
    } = useCheckout();

    const [isLoading, setIsLoading] = useState(false);
    const totals = calculateTotals();

    useEffect(() => {
        // Savat bo'sh bo'lsa, cart sahifasiga qaytarish
        if (cartItems.length === 0) {
            window.location.href = '/cart';
        } else {
            // Checkout ma'lumotlarini savat elementlari bilan yangilash
            updateCheckoutData('items', cartItems);
        }
    }, [cartItems]);

    const handleNextStep = () => {
        if (validateStep(checkoutStep)) {
            nextStep();
        }
    };

    const handleSubmitOrder = async () => {
        setIsLoading(true);
        try {
            const result = await submitOrder();
            if (result.success) {
                // Muvaffaqiyatli buyurtma
                window.location.href = `/order-success?id=${result.order.id}`;
            } else {
                alert('Buyurtma yaratishda xatolik: ' + result.error);
            }
        } catch (error) {
            alert('Buyurtma yaratishda xatolik');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="checkout-steps">
            {[1, 2, 3, 4].map(step => (
                <div key={step} className={`step ${checkoutStep >= step ? 'active' : ''}`}>
                    <div className="step-number">{step}</div>
                    <div className="step-label">
                        {step === 1 && t('cart_review')}
                        {step === 2 && t('delivery_info')}
                        {step === 3 && t('payment_info')}
                        {step === 4 && t('order_confirmation')}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="checkout-step">
            <h2>{t('review_your_order')}</h2>
            <div className="checkout-items">
                {checkoutData.items.map(item => (
                    <div key={item.id} className="checkout-item">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-details">
                            <h4>{t(item.name)}</h4>
                            <p className="item-price">{item.price.toLocaleString('uz-UZ')} UZS</p>
                            <p className="item-quantity">{t('quantity')}: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="step-actions">
                <button className="btn btn-primary" onClick={handleNextStep}>
                    {t('continue_to_delivery')}
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="checkout-step">
            <h2>{t('delivery_information')}</h2>
            <div className="delivery-form">
                <div className="form-group">
                    <label>{t('delivery_address')}</label>
                    <textarea
                        value={checkoutData.deliveryInfo.address || ''}
                        onChange={(e) => updateCheckoutData('deliveryInfo', { address: e.target.value })}
                        placeholder={t('enter_full_address')}
                        rows={3}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>{t('delivery_method')}</label>
                    <select
                        value={checkoutData.deliveryInfo.deliveryMethod}
                        onChange={(e) => updateCheckoutData('deliveryInfo', { deliveryMethod: e.target.value })}
                    >
                        <option value="standard">{t('standard_delivery')} (25,000 UZS)</option>
                        <option value="express">{t('express_delivery')} (50,000 UZS)</option>
                    </select>
                </div>
            </div>
            
            <div className="step-actions">
                <button className="btn btn-secondary" onClick={prevStep}>
                    {t('back')}
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleNextStep}
                    disabled={!validateStep(2)}
                >
                    {t('continue_to_payment')}
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="checkout-step">
            <h2>{t('payment_information')}</h2>
            <div className="payment-methods">
                <div className="payment-option">
                    <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={checkoutData.paymentInfo.method === 'cash'}
                        onChange={(e) => updateCheckoutData('paymentInfo', { method: e.target.value })}
                    />
                    <label htmlFor="cash">
                        <span className="payment-icon">💵</span>
                        {t('cash_on_delivery')}
                    </label>
                </div>
                
                <div className="payment-option">
                    <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={checkoutData.paymentInfo.method === 'card'}
                        onChange={(e) => updateCheckoutData('paymentInfo', { method: e.target.value })}
                    />
                    <label htmlFor="card">
                        <span className="payment-icon">💳</span>
                        {t('card_payment')}
                    </label>
                </div>
                
                <div className="payment-option">
                    <input
                        type="radio"
                        id="click"
                        name="paymentMethod"
                        value="click"
                        checked={checkoutData.paymentInfo.method === 'click'}
                        onChange={(e) => updateCheckoutData('paymentInfo', { method: e.target.value })}
                    />
                    <label htmlFor="click">
                        <span className="payment-icon">📱</span>
                        Click
                    </label>
                </div>
                
                <div className="payment-option">
                    <input
                        type="radio"
                        id="payme"
                        name="paymentMethod"
                        value="payme"
                        checked={checkoutData.paymentInfo.method === 'payme'}
                        onChange={(e) => updateCheckoutData('paymentInfo', { method: e.target.value })}
                    />
                    <label htmlFor="payme">
                        <span className="payment-icon">💎</span>
                        Payme
                    </label>
                </div>
            </div>
            
            <div className="step-actions">
                <button className="btn btn-secondary" onClick={prevStep}>
                    {t('back')}
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleNextStep}
                    disabled={!validateStep(3)}
                >
                    {t('review_order')}
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="checkout-step">
            <h2>{t('order_confirmation')}</h2>
            
            <div className="order-summary-final">
                <h3>{t('order_summary')}</h3>
                <div className="summary-row">
                    <span>{t('subtotal')}:</span>
                    <span>{totals.subtotal.toLocaleString('uz-UZ')} UZS</span>
                </div>
                <div className="summary-row">
                    <span>{t('delivery')}:</span>
                    <span>{totals.deliveryCost.toLocaleString('uz-UZ')} UZS</span>
                </div>
                {totals.discountAmount > 0 && (
                    <div className="summary-row discount">
                        <span>{t('discount')}:</span>
                        <span>-{totals.discountAmount.toLocaleString('uz-UZ')} UZS</span>
                    </div>
                )}
                <div className="summary-row total">
                    <span>{t('total')}:</span>
                    <span>{totals.total.toLocaleString('uz-UZ')} UZS</span>
                </div>
            </div>
            
            <div className="order-details-final">
                <h4>{t('delivery_to')}:</h4>
                <p>{checkoutData.deliveryInfo.address}</p>
                
                <h4>{t('payment_method')}:</h4>
                <p>{t(checkoutData.paymentInfo.method)}</p>
            </div>
            
            <div className="step-actions">
                <button className="btn btn-secondary" onClick={prevStep}>
                    {t('back')}
                </button>
                <button 
                    className="btn btn-success btn-large"
                    onClick={handleSubmitOrder}
                    disabled={isLoading}
                >
                    {isLoading ? t('processing') : t('place_order')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="checkout-page">
            <Meta title={`${t('checkout')} - ${t('app_name')}`} />
            
            <div className="checkout-header">
                <h1>{t('checkout')}</h1>
                {renderStepIndicator()}
            </div>

            <div className="checkout-content">
                <div className="checkout-main">
                    {checkoutStep === 1 && renderStep1()}
                    {checkoutStep === 2 && renderStep2()}
                    {checkoutStep === 3 && renderStep3()}
                    {checkoutStep === 4 && renderStep4()}
                </div>

                <div className="checkout-sidebar">
                    <div className="order-summary">
                        <h3>{t('order_summary')}</h3>
                        <div className="summary-row">
                            <span>{t('items')} ({checkoutData.items.length}):</span>
                            <span>{totals.subtotal.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="summary-row">
                            <span>{t('delivery')}:</span>
                            <span>{totals.deliveryCost.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="summary-row total">
                            <span>{t('total')}:</span>
                            <span>{totals.total.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
