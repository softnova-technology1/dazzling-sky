import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './orderConfirmed.module.css';

export default function OrderConfirmed() {
    const navigate = useNavigate();

    // Load purchased items from checkout
    const [purchasedItems] = React.useState(() => {
        const localCheckout = localStorage.getItem('dazzling_sky_checkout_items');
        if (localCheckout) {
            try {
                const parsed = JSON.parse(localCheckout);
                return parsed.map(item => {
                    const prod = PRODUCTS.find(p => p.id === item.id);
                    return prod ? { product: prod, quantity: item.quantity } : null;
                }).filter(item => item !== null);
            } catch (e) {
                console.error(e);
            }
        }
        return [];
    });

    // Clear cart/checkout source on mount
    React.useEffect(() => {
        const source = localStorage.getItem('dazzling_sky_checkout_source');
        if (source === 'cart') {
            localStorage.removeItem('dazzling_sky_cart');
            window.dispatchEvent(new Event('cart_updated'));
        }
        localStorage.removeItem('dazzling_sky_checkout_items');
        localStorage.removeItem('dazzling_sky_checkout_source');
    }, []);

    const orderDetails = {
        orderId: 'DS-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        deliveryMethod: 'Express Delivery (Delivered in 24 Hours)',
        paymentMethod: 'Credit Card (ending in 4321)',
        address: '123 Luxury Lane, Apt 4B, Beverly Hills, CA 90210'
    };

    const subtotal = purchasedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className={styles.confirmationPageWrapper}>
            <div className={styles.confirmationContainer}>
                
                <div className={styles.successCard}>
                    {/* Animated Checkmark */}
                    <div className={styles.successIconWrapper}>
                        <span className="material-symbols-outlined">task_alt</span>
                    </div>

                    {/* Thank You Header */}
                    <div className={styles.successHeading}>
                        <h1 className={styles.successTitle}>Order Confirmed!</h1>
                        <p className={styles.successSubtitle}>
                            Thank you for shopping with Dazzling Sky. We have sent a confirmation email containing your invoice and tracking links.
                        </p>
                    </div>

                    {/* Order Information Grid */}
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Order ID</span>
                            <span className={styles.infoValue}>{orderDetails.orderId}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Date</span>
                            <span className={styles.infoValue}>{orderDetails.date}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Shipping Address</span>
                            <span className={styles.infoValue}>{orderDetails.address}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Delivery Method</span>
                            <span className={styles.infoValue}>{orderDetails.deliveryMethod}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Payment Method</span>
                            <span className={styles.infoValue}>{orderDetails.paymentMethod}</span>
                        </div>
                    </div>

                    {/* Items Purchased List */}
                    <div className={styles.itemsRecapSection}>
                        <h2 className={styles.recapTitle}>Items Purchased</h2>
                        <div className={styles.recapList}>
                            {purchasedItems.map(item => (
                                <div key={item.product.id} className={styles.recapItem}>
                                    <div className={styles.recapItemInfo}>
                                        <img className={styles.recapImg} src={item.product.image} alt={item.product.name} />
                                        <div>
                                            <span className={styles.recapName}>{item.product.name}</span>
                                            <span className={styles.recapQty}>x{item.quantity}</span>
                                        </div>
                                    </div>
                                    <span className={styles.recapPrice}>${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Charges Recap */}
                    <div className={styles.chargesRecap}>
                        <div className={styles.chargeRow}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.chargeRow}>
                            <span>Shipping</span>
                            <span style={{ color: '#d1bcff' }}>Free</span>
                        </div>
                        <div className={styles.chargeRow}>
                            <span>Estimated Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.chargeRow} ${styles.chargeTotalRow}`}>
                            <span>Grand Total</span>
                            <span className={styles.chargeTotalVal}>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className={styles.actions}>
                        <Link to="/shop" className={styles.continueShoppingBtn}>
                            <span>Continue Shopping</span>
                            <span className="material-symbols-outlined">arrow_right_alt</span>
                        </Link>
                        <button className={styles.invoiceBtn} onClick={() => window.print()}>
                            <span className="material-symbols-outlined">download</span>
                            <span>Print Invoice</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
