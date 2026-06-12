import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './cart.module.css';

export default function Cart() {
    const navigate = useNavigate();
    
    // Initialize cart items from localStorage, or use defaults if empty
    const [cartItems, setCartItems] = useState(() => {
        const localCart = localStorage.getItem('dazzling_sky_cart');
        if (localCart) {
            try {
                const parsed = JSON.parse(localCart);
                return parsed.map(item => {
                    const prod = PRODUCTS.find(p => p.id === item.id);
                    return prod ? { product: prod, quantity: item.quantity } : null;
                }).filter(item => item !== null);
            } catch (e) {
                console.error(e);
            }
        }
        // Default items if localStorage is empty
        const defaultItems = [
            { product: PRODUCTS.find(p => p.id === 1) || PRODUCTS[0], quantity: 1 },
            { product: PRODUCTS.find(p => p.id === 2) || PRODUCTS[1], quantity: 2 },
            { product: PRODUCTS.find(p => p.id === 3) || PRODUCTS[2], quantity: 1 }
        ].filter(item => item.product !== undefined);
        localStorage.setItem('dazzling_sky_cart', JSON.stringify(defaultItems.map(item => ({ id: item.product.id, quantity: item.quantity }))));
        return defaultItems;
    });

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const updateQuantity = (productId, amount) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            );
            localStorage.setItem('dazzling_sky_cart', JSON.stringify(updated.map(item => ({ id: item.product.id, quantity: item.quantity }))));
            window.dispatchEvent(new Event('cart_updated'));
            return updated;
        });
    };

    const removeItem = (productId) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item.product.id !== productId);
            localStorage.setItem('dazzling_sky_cart', JSON.stringify(updated.map(item => ({ id: item.product.id, quantity: item.quantity }))));
            window.dispatchEvent(new Event('cart_updated'));
            return updated;
        });
    };

    const handleCheckout = () => {
        const checkoutItems = cartItems.map(item => ({ id: item.product.id, quantity: item.quantity }));
        localStorage.setItem('dazzling_sky_checkout_items', JSON.stringify(checkoutItems));
        localStorage.setItem('dazzling_sky_checkout_source', 'cart');
        navigate('/checkout');
    };

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'DAZZLE15') {
            setDiscount(0.15); // 15% discount
            alert('Promo code applied successfully! 15% discount has been applied.');
        } else {
            alert('Invalid promo code. Try "DAZZLE15" for a 15% discount!');
        }
    };

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const shipping = 0; // Free express delivery
    const tax = subtotal * 0.08; // 8% estimated tax
    const total = subtotal - discountAmount + shipping + tax;

    return (
        <div className={styles.cartPageWrapper}>
            <div className={styles.cartContainer}>
                
                {/* Stepper Header */}
                <header className={styles.pageHeader}>
                    <div className={styles.stepper}>
                        <span className={styles.stepActive}>01. Cart</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.step}>02. Delivery</span>
                        <span className={styles.stepDivider}>/</span>
                        <span className={styles.step}>03. Payment</span>
                    </div>
                    <h1 className={styles.pageTitle}>Your Botanical Selection</h1>
                </header>

                {cartItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>shopping_bag</span>
                        <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
                        <p className={styles.emptyText}>Add some premium arrangements to your collection and make your home as comfortable as possible.</p>
                        <Link to="/shop" className={styles.shopNowBtn}>
                            Shop Now
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.cartGrid}>
                        {/* Cart Items List */}
                        <div className={styles.itemsSection}>
                            {cartItems.map(item => (
                                <article key={item.product.id} className={styles.cartItem}>
                                    <div className={styles.itemImageWrapper}>
                                        <img className={styles.itemImage} src={item.product.image} alt={item.product.name} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemName}>{item.product.name}</h3>
                                        <p className={styles.itemCollection}>{item.product.collection}</p>
                                        <span className={styles.itemPrice}>${item.product.price}</span>
                                        <button 
                                            className={styles.viewDetailBtn}
                                            onClick={() => navigate(`/product/${item.product.id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className={styles.quantitySelector}>
                                            <button 
                                                className={styles.qtyBtn} 
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className={styles.qtyValue}>{item.quantity}</span>
                                            <button 
                                                className={styles.qtyBtn} 
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className={styles.removeBtn} 
                                            onClick={() => removeItem(item.product.id)}
                                            title="Remove Item"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <aside className={styles.summarySection}>
                            <h2 className={styles.summaryTitle}>Summary</h2>
                            <div className={styles.summaryRows}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className={styles.summaryRow} style={{ color: '#ff8ad8' }}>
                                        <span>Discount (15%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className={styles.summaryRow}>
                                    <span>Delivery</span>
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

                            {/* Promo Code Code */}
                            <div className={styles.promoContainer}>
                                <input 
                                    className={styles.promoInput} 
                                    placeholder="Enter 'DAZZLE15'" 
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    type="text" 
                                />
                                <button className={styles.promoBtn} onClick={handleApplyPromo}>Apply</button>
                            </div>

                            <button className={styles.checkoutBtn} onClick={handleCheckout}>
                                <span>Proceed to Checkout</span>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
