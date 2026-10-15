import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import styles from './productDetails.module.css';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoadingDb, setIsLoadingDb] = useState(true);

    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeInfoTab, setActiveInfoTab] = useState('Description');
    const [faqOpen, setFaqOpen] = useState({ shipping: false, freshness: false, returns: false });
    const [isBuying, setIsBuying] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isWished, setIsWished] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        setReviewSubmitted(true);
        setTimeout(() => {
            setShowReviewModal(false);
            setReviewSubmitted(false);
            setNewReview({ name: '', rating: 5, comment: '' });
        }, 1500);
    };

    useEffect(() => {
        setIsLoadingDb(true);
        fetch(`${API_BASE_URL}/api/products/${id}`)
            .then(async res => {
                if (res.ok) {
                    return res.json();
                }
                const allRes = await fetch(`${API_BASE_URL}/api/products`);
                const allData = await allRes.json();
                return allData.find(p => p._id === id || p.legacyId?.toString() === id.toString());
            })
            .then(found => {
                if (found) {
                    setProduct({
                        id: found._id,
                        legacyId: found.legacyId,
                        name: found.name,
                        price: found.price,
                        originalPrice: found.originalPrice,
                        image: found.imageUrl,
                        collection: found.collectionName || found.category || 'Signature Collection',
                        rating: found.rating !== undefined ? found.rating : 5,
                        inStock: found.stock > 0,
                        description: found.description || `Handcrafted with exquisite blooms in serene hues, artfully arranged for special occasions. Part of our luxury atelier collection.`,
                        longDescription: found.longDescription || found.description,
                        careInstructions: found.careInstructions || '',
                        dimensions: found.dimensions || 'Height: 18" | Diameter: 14"',
                        longevity: found.longevity || '10-14 days with proper care',
                        color: found.color,
                        occasion: found.occasion,
                        flowerType: found.flowerType
                    });

                    // Fetch 4 related products from database
                    fetch(`${API_BASE_URL}/api/products`)
                        .then(r => r.json())
                        .then(all => {
                            if (Array.isArray(all)) {
                                const others = all
                                    .filter(p => p._id !== found._id && (!found.legacyId || p.legacyId !== found.legacyId))
                                    .slice(0, 4)
                                    .map(p => ({
                                        id: p._id,
                                        legacyId: p.legacyId,
                                        name: p.name,
                                        price: p.price,
                                        image: p.imageUrl
                                    }));
                                setRelatedProducts(others);
                            }
                        })
                        .catch(err => console.error("Error fetching related:", err));
                } else {
                    setProduct(null);
                }
            })
            .catch(err => {
                console.error("Error fetching db product:", err);
                setProduct(null);
            })
            .finally(() => setIsLoadingDb(false));
    }, [id]);

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image);
            setQuantity(1);
            const local = localStorage.getItem('dazzling_sky_wishlist');
            const ids = local ? JSON.parse(local) : [];
            setIsWished(ids.includes(product.id));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [product, id]);

    if (isLoadingDb) {
        return <div style={{ textAlign: 'center', paddingTop: '100px', color: '#fff' }}>Loading product details...</div>;
    }

    if (!product) {
        return (
            <div className={styles.detailsContainer} style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2 className={styles.productName} style={{ marginBottom: '24px' }}>Product Not Found</h2>
                <button onClick={() => navigate('/shop')} className={styles.backBtn}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Shop
                </button>
            </div>
        );
    }

    const toggleFaq = (key) => {
        setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleWishlist = () => {
        const local = localStorage.getItem('dazzling_sky_wishlist');
        let ids = local ? JSON.parse(local) : [];
        if (isWished) {
            ids = ids.filter(itemId => itemId !== product.id);
        } else {
            ids.push(product.id);
        }
        localStorage.setItem('dazzling_sky_wishlist', JSON.stringify(ids));
        window.dispatchEvent(new Event('wishlist_updated'));
        setIsWished(!isWished);
    };

    const handleBuyNowClick = () => {
        setIsBuying(true);
        const checkoutItems = [{ product: product, quantity: quantity }];
        localStorage.setItem('dazzling_sky_checkout_items', JSON.stringify(checkoutItems));
        localStorage.setItem('dazzling_sky_checkout_source', 'direct');
        
        setTimeout(() => {
            setIsBuying(false);
            navigate('/checkout');
        }, 1500);
    };

    const handleAddToCartClick = () => {
        setIsAdding(true);
        const existingCart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += quantity;
        } else {
            existingCart.push({ id: product.id, quantity: quantity });
        }
        localStorage.setItem('dazzling_sky_cart', JSON.stringify(existingCart));
        window.dispatchEvent(new Event('cart_updated'));
        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const thumbnails = [
        product.image,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVqEztNF12LSdO84KKQml3LMm4i5OsW3W2QXIGnSx9BDOFSKbBSCG39loPYU54NRud_GxbJXzl2oipEU0nXX7B_i2AbcTBWptT8UyVmHcoyF-SryitI-IzSqq4isC8zLW0lfft3vpWurH7Bf41QbypE6JUTKWWxKmu-6LSRA-Ecm2F2BRAyavwbSBZQ3lHhyeXSxVvUc6X-PeHZC4LxYr6O9BP2bGA2UHOfw7FL6H60sbzBielHQx3yGeRpI4hDedU9Pct5Js-E9Q',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAaxXhzf3ZCqk88ON3_RI8rOZyrg-UyGgpB53l-cUZ7TnVFPWv5ZHI_ivpk2ypavAsQk2fbDUpEpNc6Ona_V-xXqC-SmCmDXz2qA6Vaihh1Gzy_mPK9k80Dw9AwfJckz-1MH8Ln6z0TycLXm_p0_ce_b2U8O5wGm1d2E3uqPm_4BrlI19ibC2vq7YInw4JvYKtHYTSVNJ0n4klMA2t7hPBqgTsSRomM4ktvmJSiO1wSVA0Gecg95UxKethf0dOoL4eh5dxzMqSo6J0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKlwzBtJdH-oB28Hf67-FmM9um9fgWkNwoWnjTAaAQWuoQAE3fz-t9YOsajwjwg_kEGYJIEjTjJm2m6eeHZ6jOyPbYYY-WKJTYaFYeg3jzu5SKQ6cnElUyN8ZJX4NOm6BaW1JSnHYF-yVEypdC8WWC7frfxgL6w-bqxAdcpJQSbFXO9yWjLTx40fU1BlW0OJwSJi7teQcvRWK_p7vnBvwKrbtqLa1JlHzaIFUuCroDchirPGxPHx2S5iWghHaLlul7c6CB8n6Drw'
    ];

    return (
        <div className={styles.detailsPageWrapper}>
            <main className={styles.detailsContainer}>

                {/* Back Link */}
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                    <button onClick={() => navigate('/shop')} className={styles.backBtn}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back to Shop
                    </button>
                </div>

                {/* Product Showcase */}
                <section className={styles.gridContainer}>
                    {/* Left: Gallery */}
                    <div className={styles.galleryWrapper}>
                        <div className={styles.imageWrapper}>
                            <img className={styles.productImg} src={selectedImage || product.image} alt={product.name} />
                            <div className={styles.badgeWrapper}>
                                <span className={styles.productBadge}>Rare Botanical</span>
                            </div>
                        </div>
                        <div className={styles.thumbnailsGrid}>
                            {thumbnails.map((thumb, i) => (
                                <button
                                    key={i}
                                    className={`${styles.thumbBtn} ${selectedImage === thumb ? styles.thumbActive : ''}`}
                                    onClick={() => setSelectedImage(thumb)}
                                >
                                    <img className={styles.thumbImg} src={thumb} alt="product thumbnail" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className={styles.infoSection}>
                        <div className={styles.metaHeader}>
                            <nav className={styles.breadcrumb}>
                                <Link to="/shop" className={styles.breadLink}>Collections</Link>
                                <span className={styles.breadDivider}>/</span>
                                <span className={styles.breadActive}>{product.collection}</span>
                            </nav>
                            <h1 className={styles.productName}>{product.name}</h1>

                            <div className={styles.ratingsContainer}>
                                <div className={styles.stars}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span
                                            key={index}
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: '18px',
                                                fontVariationSettings: index < product.rating ? "'FILL' 1" : "'FILL' 0"
                                            }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.ratingValue}>(128 Reviews)</span>
                                <span className={styles.dotSeparator} style={{ backgroundColor: product.inStock ? '#4ade80' : '#f87171' }}></span>
                                <span className={styles.stockStatus} style={{ color: product.inStock ? '#4ade80' : '#f87171' }}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className={styles.priceContainer}>
                                <span className={styles.price}>${product.price}</span>
                                {product.originalPrice && <span className={styles.originalPrice}>${product.originalPrice}</span>}
                            </div>
                        </div>

                        <p className={styles.descriptionText}>
                            A rare botanical masterpiece curated for the most discerning aesthetic. The {product.name} features deep, multi-tonal crimson petals that feel like the finest silk, housed in a bespoke volcanic-ash black vase.
                        </p>

                        <div className={styles.actionGroup}>
                            <div className={styles.quantityRow} style={!product.inStock ? { opacity: 0.45, pointerEvents: 'none' } : {}}>
                                <span className={styles.actionLabel}>Quantity</span>
                                <div className={styles.quantitySelector}>
                                    <button className={styles.qtyBtn} onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={!product.inStock || quantity <= 1}>-</button>
                                    <span className={styles.qtyValue}>{product.inStock ? quantity : 0}</span>
                                    <button className={styles.qtyBtn} onClick={() => setQuantity(prev => prev + 1)} disabled={!product.inStock}>+</button>
                                </div>
                            </div>

                            {product.inStock ? (
                                <div className={styles.btnRow}>
                                    <button
                                        className={`${styles.cartBtn} ${isAdding ? styles.cartBtnActive : ''}`}
                                        onClick={handleAddToCartClick}
                                        disabled={isAdding}
                                    >
                                        <span className={`${styles.cartIcon} ${isAdding ? styles.cartIconAdd : ''} material-symbols-outlined`}>
                                            {isAdding ? 'check_circle' : 'shopping_bag'}
                                        </span>
                                        <span>{isAdding ? 'Saved' : 'Add to Cart'}</span>
                                    </button>
                                    <button
                                        className={`${styles.buyBtn} ${isBuying ? styles.buyBtnActive : ''}`}
                                        onClick={handleBuyNowClick}
                                        disabled={isBuying}
                                    >
                                        {isBuying ? (
                                            <div className={styles.trolleyTrack}>
                                                <span className={`material-symbols-outlined ${styles.trolley}`}>shopping_cart</span>
                                            </div>
                                        ) : (
                                            'Buy Now'
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.outOfStockBanner}>
                                    <button className={styles.outOfStockBtn} disabled title="Currently out of stock">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>block</span>
                                        <span>OUT OF STOCK • CURRENTLY UNAVAILABLE</span>
                                    </button>
                                    <p className={styles.outOfStockNotice}>
                                        This botanical arrangement is currently sold out. Save it to your wishlist to receive restock alerts.
                                    </p>
                                </div>
                            )}

                             <button
                                className={`${styles.wishlistAction} ${isWished ? styles.wished : ''}`}
                                onClick={toggleWishlist}
                            >
                                <span
                                    className={`material-symbols-outlined ${isWished ? styles.heartPop : ''}`}
                                    style={{
                                        fontVariationSettings: isWished ? "'FILL' 1" : "'FILL' 0"
                                    }}
                                >
                                    favorite
                                </span>
                                {isWished ? 'Added to Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        {/* Delivery Info Card */}
                        <div className={styles.deliveryCard}>
                            <div className={styles.deliveryItem}>
                                <div className={styles.deliveryIconWrapper}>
                                    <span className="material-symbols-outlined">local_shipping</span>
                                </div>
                                <div>
                                    <p className={styles.deliveryTitle}>Free Express Delivery</p>
                                    <p className={styles.deliverySubtitle}>Delivered within 24 hours</p>
                                </div>
                            </div>
                            <div className={styles.deliveryItemDivider}></div>
                            <div className={styles.deliveryItem}>
                                <div className={styles.deliveryIconWrapper} style={{ color: '#d1bcff', background: 'rgba(209, 188, 255, 0.1)' }}>
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <p className={styles.deliveryTitle}>Secure Packaging</p>
                                    <p className={styles.deliverySubtitle}>Arrival guaranteed fresh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Info Tabs */}
                <section className={styles.tabsSection}>
                    <div className={styles.tabsHeader}>
                        {['Description', 'Care Instructions', 'Reviews'].map(tab => (
                            <button
                                key={tab}
                                className={`${styles.tabLink} ${activeInfoTab === tab ? styles.tabLinkActive : ''}`}
                                onClick={() => setActiveInfoTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={styles.tabsContent}>
                        {/* Tab 1: Description */}
                        {activeInfoTab === 'Description' && (
                            <div className={styles.descriptionTabGrid}>
                                <div className={styles.tabLeft}>
                                    <h3 className={styles.tabHeading}>Bespoke Curation</h3>
                                    <p className={styles.tabText} style={{ whiteSpace: 'pre-line' }}>
                                        {product.longDescription || product.description || `Our ${product.name} are sourced exclusively from high-altitude artisan gardens, where the combination of rich volcanic soil and direct sunlight creates an unmatched color depth and structural integrity. Each petal is inspected for perfection before being hand-arranged into our signature minimalist aesthetic.`}
                                    </p>
                                    <div className={styles.tabMetrics}>
                                        <div className={styles.metricItem}>
                                            <span className={styles.metricLabel}>Dimensions</span>
                                            <p className={styles.metricValue}>{product.dimensions || 'Height: 18" | Diameter: 14"'}</p>
                                        </div>
                                        <div className={styles.metricItem}>
                                            <span className={styles.metricLabel}>Longevity</span>
                                            <p className={styles.metricValue}>{product.longevity || '10-14 days with proper care'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.tabCard}>
                                    <h4 className={styles.tabCardTitle}>Atelier Highlights</h4>
                                    <ul className={styles.careList}>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>✦</span>
                                            Artisanal hand-selected luxury blooms
                                        </li>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>✦</span>
                                            Bespoke presentation packaging & signature ribbon
                                        </li>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>✦</span>
                                            Complimentary botanical preservative tonic included
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Care Instructions */}
                        {activeInfoTab === 'Care Instructions' && (
                            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
                                <div className={styles.tabCard} style={{ background: '#0a0a0a', border: '1px solid rgba(255,138,216,0.2)', padding: '36px', borderRadius: '12px' }}>
                                    <h4 className={styles.tabCardTitle} style={{ fontSize: '18px', color: '#ff8ad8', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Care Ritual & Longevity Guide</h4>
                                    {product.careInstructions ? (
                                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.9', color: '#e5e5e5', fontSize: '15px' }}>
                                            {product.careInstructions}
                                        </div>
                                    ) : (
                                        <ul className={styles.careList}>
                                            <li className={styles.careItem}>
                                                <span className={styles.careIndex}>01.</span>
                                                <div>
                                                    <strong style={{ color: '#fff' }}>Optimal Placement:</strong> Keep in a cool, indirect-light location away from direct sunlight, heating radiators, and air vents to preserve petal texture.
                                                </div>
                                            </li>
                                            <li className={styles.careItem}>
                                                <span className={styles.careIndex}>02.</span>
                                                <div>
                                                    <strong style={{ color: '#fff' }}>Hydration Routine:</strong> Refresh cold vase water every 48 hours and mix in the included botanical preservative tonic.
                                                </div>
                                            </li>
                                            <li className={styles.careItem}>
                                                <span className={styles.careIndex}>03.</span>
                                                <div>
                                                    <strong style={{ color: '#fff' }}>Stem Trimming:</strong> Trim stems 1-2 cm at a clean 45-degree angle under cold running water before placing into fresh water for optimal hydration.
                                                </div>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Reviews */}
                        {activeInfoTab === 'Reviews' && (
                            <div className={styles.reviewsSection} style={{ marginTop: '0', paddingTop: '0' }}>
                                <div className={styles.reviewsHeader} style={{ marginBottom: '32px' }}>
                                    <div>
                                        <h2 className={styles.reviewsHeading} style={{ fontSize: '24px' }}>Customer Experiences</h2>
                                        <p className={styles.reviewsSubheading}>Voices of the Dazzling Sky collective</p>
                                    </div>
                                    <button className={styles.writeReviewBtn} onClick={() => setShowReviewModal(true)}>
                                        Write a Review
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                </div>

                                <div className={styles.reviewsGrid}>
                                    {/* Review Card 1 */}
                                    <div className={styles.reviewCard}>
                                        <div>
                                            <div className={styles.reviewStars}>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                            <p className={styles.reviewQuote}>"The color is truly breathtaking. It's not just fresh; it's a deep, living void of velvet. It transformed my dining space instantly."</p>
                                        </div>
                                        <div className={styles.reviewUser}>
                                            <div className={styles.userAvatar}>
                                                <img className={styles.avatarImg} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjp2p3ovefsihp4t5Zy4CCWJWEjazF4bSnLj1lzmi66EN2Z1doik3gLjLcbf1ztjHzzIecLmymNCegGAJ63Zw33VPkNu59AGadPbSH7JB2Ncjx0xPWIs2TQLGHWy4bbhm4o-DLuH28utQlgx4CjT9W64z47dG9W8qv241gc46iUnsNSm4Z1fLuG3qMp1dhC315u9yUGvSVBQ0KlziraI7D5wKSMEx_fXtRY-J8c0CUkZrMgHj99Cgs0q9M1s7yOtesw6-1em_-2Bg" alt="Helena V." />
                                            </div>
                                            <div>
                                                <p className={styles.userName}>Helena V.</p>
                                                <p className={styles.userBadge}>Verified Purchase</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Card 2 */}
                                    <div className={styles.reviewCard}>
                                        <div>
                                            <div className={styles.reviewStars}>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                            <p className={styles.reviewQuote}>"Exceeded all expectations. The packaging was so secure and luxury-grade. A perfect anniversary gift."</p>
                                        </div>
                                        <div className={styles.reviewUser}>
                                            <div className={styles.userAvatar}>
                                                <img className={styles.avatarImg} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTHkNZmua5eLfzOZdzyIm-xnyDp6gCGjQ1XODjvd-LBHbN6VuEFFdMP5j_2CBCVLI9akt_gBxlHqUEdDPcdq-6Kv4Nns4zIVY93_81-M5xxUSVKflFw9pGm1OJBKuIbHm70bzbeydkriXtSFC7roVLBiqyK8dsg0b09ZBdX88fUvxwq-y08YgNXbDp5v7lMc-r-n3xrWibzdahiP6Kgygi6yUlkUQxD_z43Pu911FvHuBpeFXkeVWV3xNCiF4UAe4GMwPExYsMkZU" alt="Julian M." />
                                            </div>
                                            <div>
                                                <p className={styles.userName}>Julian M.</p>
                                                <p className={styles.userBadge}>Verified Purchase</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Card 3 */}
                                    <div className={styles.reviewCard}>
                                        <div>
                                            <div className={styles.reviewStars}>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span key={index} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                            <p className={styles.reviewQuote}>"The flowers stayed vibrant for nearly two weeks. The quality of the arrangement is vastly superior to anything I've ordered before."</p>
                                        </div>
                                        <div className={styles.reviewUser}>
                                            <div className={styles.userAvatar}>
                                                <img className={styles.avatarImg} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtTA6mMporHYR47Ljx_nfZfnzkQLlgC3Dqv1MQdWKubqIW-wirQy95Ij9rc_6D-35kGse58d0UnIGILL2imf5oGbTzqMmOB1nv8fRgzPsw7VJC2BwRycV-sUYVinMtueaUVMGp4TLSzP2xNmlYELoq3DsAD6ViS2XE8eMOjkI8YBVzzMMhX6pO-Gxu4pQIu2AwVZ2NkoPcxIxU5JlBqt-mTgOgEllnrO4dc0AJoYdntVfSWL2zbUna_WSAvxUhUe2hU1hQe8R_rsw" alt="Sarah L." />
                                            </div>
                                            <div>
                                                <p className={styles.userName}>Sarah L.</p>
                                                <p className={styles.userBadge}>Verified Purchase</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Related Products */}
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedHeading}>You May Also Like</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map(prod => (
                            <div key={prod.id} className={styles.relatedCard} onClick={() => navigate(`/product/${prod.id}`)}>
                                <div className={styles.relatedImgWrapper}>
                                    <img className={styles.relatedImg} src={prod.image} alt={prod.name} />
                                    <div className={styles.relatedHoverOverlay}></div>
                                </div>
                                <h3 className={styles.relatedCardTitle}>{prod.name}</h3>
                                <p className={styles.relatedCardPrice}>${prod.price}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className={styles.faqSection}>
                    <h2 className={styles.faqHeading}>Order Information</h2>
                    <div className={styles.faqAccordion}>
                        <div className={styles.faqItem}>
                            <button className={styles.faqTrigger} onClick={() => toggleFaq('shipping')}>
                                <span className={styles.faqQuestion}>Shipping &amp; Hand-Delivery</span>
                                <span className={`material-symbols-outlined ${styles.faqArrow} ${faqOpen.shipping ? styles.faqArrowOpen : ''}`}>expand_more</span>
                            </button>
                            {faqOpen.shipping && (
                                <div className={styles.faqContent}>
                                    We offer same-day hand-delivery for orders placed before 1:00 PM local time. Our specialized couriers ensure the temperature-controlled transport of your arrangement to guarantee freshness upon arrival.
                                </div>
                            )}
                        </div>

                        <div className={styles.faqItem}>
                            <button className={styles.faqTrigger} onClick={() => toggleFaq('freshness')}>
                                <span className={styles.faqQuestion}>Freshness Guarantee</span>
                                <span className={`material-symbols-outlined ${styles.faqArrow} ${faqOpen.freshness ? styles.faqArrowOpen : ''}`}>expand_more</span>
                            </button>
                            {faqOpen.freshness && (
                                <div className={styles.faqContent}>
                                    If your flowers do not arrive in pristine condition, contact us within 24 hours with a photograph, and we will provide a complimentary replacement.
                                </div>
                            )}
                        </div>

                        <div className={styles.faqItem}>
                            <button className={styles.faqTrigger} onClick={() => toggleFaq('returns')}>
                                <span className={styles.faqQuestion}>Return Policy</span>
                                <span className={`material-symbols-outlined ${styles.faqArrow} ${faqOpen.returns ? styles.faqArrowOpen : ''}`}>expand_more</span>
                            </button>
                            {faqOpen.returns && (
                                <div className={styles.faqContent}>
                                    Due to the perishable nature of our artisanal floral arrangements, we cannot accept returns once delivery has been completed. Cancellations are permitted up to 48 hours before the scheduled delivery date.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Write Review Modal */}
                {showReviewModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ background: '#0e0e0e', border: '1px solid rgba(255,138,216,0.3)', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Write an Atelier Review</h3>
                                <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                            </div>
                            {reviewSubmitted ? (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#4ade80' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px' }}>check_circle</span>
                                    <h4 style={{ margin: '0 0 8px', color: '#fff' }}>Thank You!</h4>
                                    <p style={{ margin: 0, color: '#a3a3a3', fontSize: '14px' }}>Your experience has been recorded for the Dazzling Sky collective.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#ff8ad8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>Your Name</label>
                                        <input required type="text" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} placeholder="e.g. Eleanor R." style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid rgba(255,138,216,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#ff8ad8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>Rating</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: star <= newReview.rating ? '#ff8ad8' : '#444', fontVariationSettings: star <= newReview.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#ff8ad8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>Review Experience</label>
                                        <textarea required rows="4" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Describe the fragrance, bloom vibrancy, and arrangement aesthetics..." style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid rgba(255,138,216,0.2)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }}></textarea>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                                        <button type="button" onClick={() => setShowReviewModal(false)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase' }}>Cancel</button>
                                        <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>Submit Review</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
