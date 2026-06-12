import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './wishlist.module.css';

export default function Wishlist() {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);

    const [popupProduct, setPopupProduct] = useState(null);

    // Load wishlist items on mount
    useEffect(() => {
        const localWishlist = localStorage.getItem('dazzling_sky_wishlist');
        if (localWishlist) {
            try {
                const ids = JSON.parse(localWishlist);
                const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(p => p !== undefined);
                setWishlistItems(items);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Remove from wishlist
    const handleRemoveFromWishlist = (productId, e) => {
        e.stopPropagation(); // Prevent card navigation click
        const updated = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(updated);
        localStorage.setItem('dazzling_sky_wishlist', JSON.stringify(updated.map(item => item.id)));
        window.dispatchEvent(new Event('wishlist_updated'));
    };

    // Add to cart from wishlist
    const handleAddToCart = (product, e) => {
        e.stopPropagation(); // Prevent card navigation click
        const existingCart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
        } else {
            existingCart.push({ id: product.id, quantity: 1 });
        }
        localStorage.setItem('dazzling_sky_cart', JSON.stringify(existingCart));
        window.dispatchEvent(new Event('cart_updated'));
        setPopupProduct(product);
        setTimeout(() => {
            setPopupProduct(current => current && current.id === product.id ? null : current);
        }, 4000);
    };

    return (
        <div className={styles.wishlistPageWrapper}>
            <div className={styles.wishlistContainer}>
                
                {/* Header Section */}
                <header className={styles.pageHeader}>
                    <span className={styles.pageSubtitle}>Saved Arrangements</span>
                    <h1 className={styles.pageTitle}>Your Wishlist</h1>
                </header>

                {wishlistItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>favorite</span>
                        <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
                        <p className={styles.emptyText}>
                            Explore our premium designs and tap the heart icon to save your favorite arrangements here.
                        </p>
                        <Link to="/shop" className={styles.shopNowBtn}>
                            Start Browsing
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.wishlistGrid}>
                        {wishlistItems.map(prod => (
                            <article 
                                key={prod.id} 
                                className={styles.productCard}
                                onClick={() => navigate(`/product/${prod.id}`)}
                            >
                                {/* Remove Heart Button */}
                                <button 
                                    className={styles.removeBtn}
                                    onClick={(e) => handleRemoveFromWishlist(prod.id, e)}
                                    title="Remove from Wishlist"
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>

                                {/* Image Wrapper */}
                                <div className={styles.productImageWrapper}>
                                    <img className={styles.productImage} src={prod.image} alt={prod.name} />
                                </div>

                                {/* Details */}
                                <div className={styles.productDetails}>
                                    <h3 className={styles.productName}>{prod.name}</h3>
                                    <p className={styles.productCollection}>{prod.collection}</p>
                                </div>

                                {/* Footer actions */}
                                <div className={styles.productFooter}>
                                    <span className={styles.price}>${prod.price}</span>
                                    <button 
                                        className={styles.cartBtn}
                                        onClick={(e) => handleAddToCart(prod, e)}
                                        title="Add to Cart"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_cart</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </div>
            {/* Success Cart Popup Toast */}
            {popupProduct && (
                <div className={styles.cartPopupOverlay}>
                    <div className={styles.cartPopupCard}>
                        <div 
                            className={styles.popupProductLink}
                            onClick={() => navigate(`/product/${popupProduct.id}`)}
                        >
                            <span className={`material-symbols-outlined ${styles.popupCheck}`}>task_alt</span>
                            <img className={styles.popupImg} src={popupProduct.image} alt={popupProduct.name} />
                            <div className={styles.popupInfo}>
                                <h4 className={styles.popupTitle}>Added to Cart</h4>
                                <p className={styles.popupName}>
                                    {popupProduct.name} <span className={styles.popupGoArrow}>➔</span>
                                </p>
                            </div>
                        </div>
                        <div className={styles.popupActions}>
                            <button className={styles.popupBtnView} onClick={() => navigate('/cart')}>View Cart</button>
                            <button className={styles.popupBtnClose} onClick={() => setPopupProduct(null)}>
                                <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
