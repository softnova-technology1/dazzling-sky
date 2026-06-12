import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './productDetails.module.css';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = PRODUCTS.find(p => p.id === parseInt(id, 10));
    
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeInfoTab, setActiveInfoTab] = useState('Description');
    const [faqOpen, setFaqOpen] = useState({ shipping: false, freshness: false, returns: false });
    const [isBuying, setIsBuying] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isWished, setIsWished] = useState(false);

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image);
            setQuantity(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [product, id]);

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

    // Get 4 related products
    const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

    const toggleFaq = (key) => {
        setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleBuyNowClick = () => {
        setIsBuying(true);
        setTimeout(() => {
            setIsBuying(false);
        }, 1500);
    };

    const handleAddToCartClick = () => {
        setIsAdding(true);
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
                                <span className={styles.dotSeparator}></span>
                                <span className={styles.stockStatus} style={{ color: product.inStock ? '#d1bcff' : '#f87171' }}>
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
                            <div className={styles.quantityRow}>
                                <span className={styles.actionLabel}>Quantity</span>
                                <div className={styles.quantitySelector}>
                                    <button className={styles.qtyBtn} onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1}>-</button>
                                    <span className={styles.qtyValue}>{quantity}</span>
                                    <button className={styles.qtyBtn} onClick={() => setQuantity(prev => prev + 1)}>+</button>
                                </div>
                            </div>

                            <div className={styles.btnRow}>
                                <button 
                                    className={`${styles.cartBtn} ${isAdding ? styles.cartBtnActive : ''}`} 
                                    onClick={handleAddToCartClick}
                                    disabled={!product.inStock || isAdding}
                                >
                                    <span className={`${styles.cartIcon} ${isAdding ? styles.cartIconAdd : ''} material-symbols-outlined`}>
                                        {isAdding ? 'check_circle' : 'shopping_bag'}
                                    </span>
                                    <span>{isAdding ? 'Saved' : 'Add to Cart'}</span>
                                </button>
                                <button 
                                    className={`${styles.buyBtn} ${isBuying ? styles.buyBtnActive : ''}`} 
                                    onClick={handleBuyNowClick}
                                    disabled={!product.inStock || isBuying}
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

                            <button 
                                className={`${styles.wishlistAction} ${isWished ? styles.wished : ''}`}
                                onClick={() => setIsWished(!isWished)}
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
                        {['Description', 'Features', 'Specifications', 'Care Instructions', 'Reviews'].map(tab => (
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
                        {activeInfoTab === 'Description' && (
                            <div className={styles.descriptionTabGrid}>
                                <div className={styles.tabLeft}>
                                    <h3 className={styles.tabHeading}>Bespoke Curation</h3>
                                    <p className={styles.tabText}>
                                        Our Midnight Velvet roses are sourced exclusively from a high-altitude garden in the Andes, where the combination of rich volcanic soil and direct sunlight creates an unmatched color depth. Each petal is inspected for structural integrity before being hand-arranged into our signature minimalist aesthetic.
                                    </p>
                                    <div className={styles.tabMetrics}>
                                        <div className={styles.metricItem}>
                                            <span className={styles.metricLabel}>Dimensions</span>
                                            <p className={styles.metricValue}>Height: 18" | Diameter: 14"</p>
                                        </div>
                                        <div className={styles.metricItem}>
                                            <span className={styles.metricLabel}>Longevity</span>
                                            <p className={styles.metricValue}>10-14 days with proper care</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.tabCard}>
                                    <h4 className={styles.tabCardTitle}>Care Ritual</h4>
                                    <ul className={styles.careList}>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>01.</span>
                                            Keep in a cool, indirect-light location to preserve velvet texture.
                                        </li>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>02.</span>
                                            Refresh water every 48 hours using the included botanical tonic.
                                        </li>
                                        <li className={styles.careItem}>
                                            <span className={styles.careIndex}>03.</span>
                                            Trim stems at a 45° angle for optimal hydration.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeInfoTab !== 'Description' && (
                            <div className={styles.tabFallbackContent}>
                                <h3 className={styles.tabHeading}>{activeInfoTab}</h3>
                                <p className={styles.tabText}>
                                    Information details for {activeInfoTab} of the {product.name} are coming soon.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Reviews Section */}
                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <div>
                            <h2 className={styles.reviewsHeading}>Customer Experiences</h2>
                            <p className={styles.reviewsSubheading}>Voices of the LushGala collective</p>
                        </div>
                        <button className={styles.writeReviewBtn}>
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
                                <p className={styles.reviewQuote}>"The color is truly breathtaking. It's not just red; it's a deep, living void of velvet. It transformed my dining space instantly."</p>
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
                                <p className={styles.reviewQuote}>"The flowers stayed vibrant for nearly two weeks. The quality of the roses is vastly superior to anything I've ordered before."</p>
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

            </main>
        </div>
    );
}
