import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
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
    const [createdOrder, setCreatedOrder] = useState(null);

    // Helper to resolve product images consistently
    const getImageSrc = (img) => {
        if (!img) return '/images/card1.jpg';
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
        if (img.startsWith('/uploads/') || img.startsWith('uploads/')) {
            const clean = img.startsWith('/') ? img : `/${img}`;
            return `${API_BASE_URL}${clean}`;
        }
        return img;
    };

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

    // Load shipping option & cost chosen in Delivery step
    const [shippingOption] = useState(() => {
        const localOpt = localStorage.getItem('dazzling_sky_checkout_shipping_option');
        if (localOpt) {
            try {
                return JSON.parse(localOpt);
            } catch (e) {}
        }
        return { name: 'Standard Delivery', price: 0 };
    });

    const shippingCost = Number(shippingOption.price || localStorage.getItem('dazzling_sky_checkout_shipping_cost') || 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
    const subtotal = checkoutItems.reduce((sum, item) => sum + ((item.product?.price || item.price || 0) * (item.quantity || 1)), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    const totalItemCount = checkoutItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

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
            alert('Missing delivery address. Please return to the delivery step.');
            navigate('/checkout');
            return;
        }
        const shippingAddress = JSON.parse(addressObjStr);

        const orderItems = checkoutItems.map(item => ({
            name: item.product?.name || item.name,
            quantity: item.quantity || 1,
            image: item.product?.image || item.product?.imageUrl || item.image || '/images/card1.jpg',
            price: item.product?.price || item.price,
            product: item.product?.id || item.product?._id || item.id
        }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderItems,
                    shippingAddress,
                    paymentMethod: activeMethod === 'card' ? 'Credit Card' : activeMethod === 'paypal' ? 'PayPal' : 'Bank Transfer',
                    taxPrice: tax,
                    shippingPrice: shippingCost,
                    totalPrice: total
                })
            });

            if (response.ok) {
                const data = await response.json();
                setOrderNumber(data._id);
                setCreatedOrder(data);
                
                localStorage.removeItem('dazzling_sky_cart');
                window.dispatchEvent(new Event('cart_updated'));
                
                try {
                    await fetch(`${API_BASE_URL}/api/users/cart/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ cart: [] })
                    });
                } catch (e) {}

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
        navigate('/order-confirmed', { 
            state: { 
                order: createdOrder,
                shippingAddress: localStorage.getItem('dazzling_sky_checkout_address_obj') ? JSON.parse(localStorage.getItem('dazzling_sky_checkout_address_obj')) : null,
                paymentMethod: activeMethod === 'card' ? 'Credit Card' : activeMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'
            } 
        });
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
                    
                    {/* Left Column Forms */}
                    <div className={styles.methodsSection}>
                        <h2 className={styles.sectionTitle}>Select Payment Method</h2>
                        
                        <div className={styles.methodTabs}>
                            <button 
                                type="button"
                                className={`${styles.methodTab} ${activeMethod === 'card' ? styles.methodTabActive : ''}`}
                                onClick={() => handleMethodChange('card')}
                            >
                                <CreditCard size={18} />
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
                                    Please wire the total amount to the following bank account. Your bespoke botanical order will be processed as soon as we receive payment confirmation.
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div><strong style={{ color: '#ff8ad8' }}>Bank Name:</strong> Dazzling Sky Atelier Treasury</div>
                                    <div><strong style={{ color: '#ff8ad8' }}>Account Number:</strong> 9482 1029 3849</div>
                                    <div><strong style={{ color: '#ff8ad8' }}>Routing / SWIFT:</strong> DAZZLGSG</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Summary Column with Product Preview */}
                    <aside className={styles.summarySection}>
                        <h2 className={styles.summaryTitle}>Summary</h2>

                        {/* Order Items Preview */}
                        <div className={styles.previewContainer}>
                            <div className={styles.previewHeader}>
                                <h3 className={styles.previewTitle}>
                                    <ShoppingBag size={14} color="#ff8ad8" />
                                    <span>Selected Items</span>
                                </h3>
                                <span className={styles.previewCountBadge}>
                                    {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>

                            {checkoutItems.length === 0 ? (
                                <div className={styles.emptyPreviewNote}>
                                    No items in current selection.
                                </div>
                            ) : (
                                <div className={styles.previewItemList}>
                                    {checkoutItems.map((item, idx) => {
                                        const prod = item.product || item;
                                        const imgUrl = prod.image || prod.imageUrl || '/images/card1.jpg';
                                        const itemPrice = Number(prod.price || 0);
                                        const quantity = item.quantity || 1;
                                        const lineTotal = itemPrice * quantity;

                                        return (
                                            <div key={idx} className={styles.previewItem}>
                                                <div className={styles.previewItemImgWrap}>
                                                    <img 
                                                        src={getImageSrc(imgUrl)} 
                                                        alt={prod.name || 'Floral Arrangement'} 
                                                        className={styles.previewItemImg}
                                                        onError={(e) => { e.target.src = '/images/card1.jpg'; }}
                                                    />
                                                    <span className={styles.previewQtyBadge}>
                                                        {quantity}
                                                    </span>
                                                </div>

                                                <div className={styles.previewItemDetails}>
                                                    <h4 className={styles.previewItemName} title={prod.name}>
                                                        {prod.name}
                                                    </h4>
                                                    <div className={styles.previewItemMeta}>
                                                        <span>{prod.collection || prod.category || 'Signature Floral'}</span>
                                                        <span>•</span>
                                                        <span>${itemPrice.toFixed(2)} each</span>
                                                    </div>
                                                </div>

                                                <div className={styles.previewItemPrice}>
                                                    ${lineTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping ({shippingOption.name || 'Standard'})</span>
                                <span style={{ color: shippingCost === 0 ? '#d1bcff' : '#ff8ad8', fontWeight: '600' }}>
                                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Estimated Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryDivider}></div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span className={styles.totalPrice}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={handlePlaceOrder} className={styles.placeOrderBtn}>
                            <ShieldCheck size={18} />
                            <span>Place Order & Pay ${total.toFixed(2)}</span>
                        </button>
                        
                        <button type="button" className={styles.backToShippingBtn} onClick={() => navigate('/checkout')}>
                            <ArrowLeft size={16} />
                            <span>Back to Delivery</span>
                        </button>
                    </aside>
                </div>
            </div>

            {/* Success Overlay Confirmation Popup */}
            {showSuccess && (
                <div className={styles.successOverlay}>
                    <div className={styles.successCard}>
                        <div className={styles.successIconWrapper}>
                            <CheckCircle2 size={40} color="#ff8ad8" />
                        </div>
                        <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
                        <p className={styles.successText}>
                            Thank you for your order. Your luxury floral arrangement is being handcrafted by our atelier artisans.
                        </p>
                        <div className={styles.orderNumber}>
                            Order Reference: {orderNumber}
                        </div>
                        <button onClick={handleCloseSuccess} className={styles.successContinueBtn}>
                            View Order Confirmation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
