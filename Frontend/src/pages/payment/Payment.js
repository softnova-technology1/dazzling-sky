import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './payment.module.css';

export default function Payment() {
    const navigate = useNavigate();

    // Form inputs state
    const [cardData, setCardData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [activeMethod, setActiveMethod] = useState('card');
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Load items to checkout from localStorage
    const [checkoutItems] = useState(() => {
        const localCheckout = localStorage.getItem('dazzling_sky_checkout_items');
        if (localCheckout) {
            try {
                return JSON.parse(localCheckout);
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Simple card formatting logic
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) return;
        } else if (name === 'expiry') {
            formattedValue = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim();
            if (formattedValue.endsWith('/')) formattedValue = formattedValue.slice(0, -1);
            if (formattedValue.length > 5) return;
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 4) return;
        }
        setCardData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleMethodChange = (methodId) => {
        setActiveMethod(methodId);
    };

    // Calculate Summary Values
    const subtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingCost = 0.00; // Free standard shipping
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('customerToken');
        if (!token) {
            alert('Please login to place an order.');
            return;
        }
        
        if (activeMethod === 'card') {
            if (!cardData.cardholderName || !cardData.cardNumber || !cardData.expiry || !cardData.cvv) {
                alert('Please complete all card details.');
                return;
            }
        }

        const addressObjStr = localStorage.getItem('dazzling_sky_checkout_address_obj');
        if (!addressObjStr) {
            alert('Missing shipping address. Please go back to delivery step.');
            return;
        }
        const shippingAddress = JSON.parse(addressObjStr);

        const orderItems = checkoutItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            image: item.product.image || 'no-image',
            price: item.product.price,
            product: item.product.id || item.product._id
        }));

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderItems,
                    shippingAddress,
                    paymentMethod: activeMethod,
                    taxPrice: tax,
                    shippingPrice: shippingCost,
                    totalPrice: total
                })
            });

            if (response.ok) {
                const data = await response.json();
                setOrderNumber(data._id);
                
                localStorage.removeItem('dazzling_sky_cart');
                window.dispatchEvent(new Event('cart_updated'));
                
                await fetch('http://localhost:5000/api/users/cart/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cart: [] })
                });

                setShowSuccess(true);
            } else {
                const errData = await response.json();
                alert(`Error placing order: ${errData.message}`);
            }
        } catch (error) {
            alert('Network error while placing order.');
            console.error(error);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigate('/order-confirmed');
    };

    return (
        <div className={styles.paymentPageWrapper}>
            <div className={styles.paymentContainer}>
                
                {/* Stepper Header */}
                <header className={styles.pageHeader}>
                    <div className={styles.stepper}>
                        <span className={styles.stepCompleted}>01. Cart</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.stepCompleted}>02. Delivery</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.stepActive}>03. Payment</span>
                    </div>
                    <h1 className={styles.pageTitle}>Payment Details</h1>
                </header>

                <div className={styles.paymentGrid}>
                    {/* Left Column Form */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Select Payment Method</h2>
                        
                        <div className={styles.methodTabs}>
                            <button 
                                type="button"
                                className={`${styles.methodTab} ${activeMethod === 'card' ? styles.methodTabActive : ''}`}
                                onClick={() => handleMethodChange('card')}
                            >
                                <span className="material-symbols-outlined">credit_card</span>
                                <span>Credit Card</span>
                            </button>
                            <button 
                                type="button"
                                className={`${styles.methodTab} ${activeMethod === 'paypal' ? styles.methodTabActive : ''}`}
                                onClick={() => handleMethodChange('paypal')}
                            >
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                                <span>PayPal</span>
                            </button>
                            <button 
                                type="button"
                                className={`${styles.methodTab} ${activeMethod === 'bank' ? styles.methodTabActive : ''}`}
                                onClick={() => handleMethodChange('bank')}
                            >
                                <span className="material-symbols-outlined">account_balance</span>
                                <span>Bank Transfer</span>
                            </button>
                        </div>

                        {activeMethod === 'card' ? (
                            <form onSubmit={handlePlaceOrder} className={styles.formGrid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.inputLabel}>Cardholder Name *</label>
                                    <input 
                                        className={styles.textInput} 
                                        type="text" 
                                        name="cardholderName"
                                        placeholder="Name as it appears on your card"
                                        value={cardData.cardholderName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label className={styles.inputLabel}>Card Number *</label>
                                    <input 
                                        className={styles.textInput} 
                                        type="text" 
                                        name="cardNumber"
                                        placeholder="0000 0000 0000 0000"
                                        value={cardData.cardNumber}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Expiration Date *</label>
                                    <input 
                                        className={styles.textInput} 
                                        type="text" 
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={cardData.expiry}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>CVV / CVC *</label>
                                    <input 
                                        className={styles.textInput} 
                                        type="password" 
                                        name="cvv"
                                        placeholder="000"
                                        value={cardData.cvv}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                            </form>
                        ) : activeMethod === 'paypal' ? (
                            <div style={{ textAlign: 'left', padding: '16px 0' }}>
                                <p className={styles.inputLabel} style={{ marginBottom: '16px' }}>PayPal Account Verification</p>
                                <p style={{ color: 'rgba(229, 226, 225, 0.6)', fontSize: '15px', lineHeight: '24px' }}>
                                    You will be redirected to PayPal's secure portal to authorize this payment after clicking "Place Order".
                                </p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'left', padding: '16px 0' }}>
                                <p className={styles.inputLabel} style={{ marginBottom: '16px' }}>Direct Bank Wire Details</p>
                                <p style={{ color: 'rgba(229, 226, 225, 0.6)', fontSize: '15px', lineHeight: '24px' }}>
                                    Please wire the total amount to the following bank account. Your order will be processed as soon as we receive payment confirmation.
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div><strong style={{ color: '#ff8ad8' }}>Bank Name:</strong> Premium Floral Bank</div>
                                    <div><strong style={{ color: '#ff8ad8' }}>Account Number:</strong> 9482 1029 3849</div>
                                    <div><strong style={{ color: '#ff8ad8' }}>Routing Number:</strong> 123456789</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Summary Column */}
                    <aside className={styles.summarySection}>
                        <h2 className={styles.summaryTitle}>Summary</h2>
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span style={{ color: '#d1bcff' }}>Free</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Estimated Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryDivider}></div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={handlePlaceOrder} className={styles.placeOrderBtn}>
                            <span className="material-symbols-outlined">verified</span>
                            <span>Place Order</span>
                        </button>
                        
                        <button type="button" className={styles.backToShippingBtn} onClick={() => navigate('/checkout')}>
                            <span className="material-symbols-outlined">arrow_left_alt</span>
                            <span>Back to Shipping</span>
                        </button>
                    </aside>
                </div>
            </div>

            {/* Success Overlay Confirmation Popup */}
            {showSuccess && (
                <div className={styles.successOverlay}>
                    <div className={styles.successCard}>
                        <span className={`material-symbols-outlined ${styles.successIconWrapper}`}>task_alt</span>
                        <h2 className={styles.successTitle}>Order Placed!</h2>
                        <p className={styles.successText}>
                            Thank you for shopping with us. Your luxury arrangement order has been registered and is being custom-curated.
                        </p>
                        <div className={styles.orderNumber}>
                            Order ID: {orderNumber}
                        </div>
                        <button className={styles.continueShoppingBtn} onClick={handleCloseSuccess}>
                            <span>Continue Shopping</span>
                            <span className="material-symbols-outlined">arrow_right_alt</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
