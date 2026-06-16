import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/productsData';
import styles from './shop.module.css';
import heroimg from '../../images/shop-head.png';


// Color palette options matching Luxury Black & Lavender
const COLORS = [
    { id: 'red', hex: '#ef4444', label: 'Crimson Red' },
    { id: 'pink', hex: '#f472b6', label: 'Blush Pink' },
    { id: 'purple', hex: '#c084fc', label: 'Lavender Purple' },
    { id: 'yellow', hex: '#fef08a', label: 'Sun Yellow' },
    { id: 'white', hex: '#ffffff', label: 'Pure White' }
];

export default function Shop() {
    const location = useLocation();
    const navigate = useNavigate();

    const [clickedProductId, setClickedProductId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(2000);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedColor, setSelectedColor] = useState('all');
    const [rating5, setRating5] = useState(false);
    const [rating4, setRating4] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [favorites, setFavorites] = useState(() => {
        const local = localStorage.getItem('dazzling_sky_wishlist');
        return local ? JSON.parse(local) : [];
    });
    const [popupProduct, setPopupProduct] = useState(null);
    // Database Products State
    const [dbProducts, setDbProducts] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const catalogRef = useRef(null);

    const handleResetFilters = () => {
        setSearchQuery('');
        setPriceRange(2000);
        setSelectedColor('all');
        setSelectedCategory('all');
        setRating5(false);
        setRating4(false);
        setInStockOnly(false);
        setCurrentPage(1);
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const updated = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            localStorage.setItem('dazzling_sky_wishlist', JSON.stringify(updated));
            window.dispatchEvent(new Event('wishlist_updated'));
            return updated;
        });
    };

    const syncCartToDB = async (cart) => {
        const token = localStorage.getItem('customerToken');
        if (token) {
            const formattedCart = cart.map(item => ({ product: item.id, quantity: item.quantity }));
            try {
                await fetch('http://localhost:5000/api/users/cart/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cart: formattedCart })
                });
            } catch (err) {
                console.error("Cart sync failed", err);
            }
        }
    };

    const addToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += 1;
        } else {
            existingCart.push({ id: product.id, quantity: 1 });
        }
        localStorage.setItem('dazzling_sky_cart', JSON.stringify(existingCart));
        window.dispatchEvent(new Event('cart_updated'));
        syncCartToDB(existingCart);
        setPopupProduct(product);
        // Auto close toast/popup after 4 seconds
        setTimeout(() => {
            setPopupProduct(current => current && current.id === product.id ? null : current);
        }, 4000);
    };

    // Reset page and scroll to absolute top of page on location/navigation change (e.g. clicking navbar link)
    useEffect(() => {
        setCurrentPage(1);
        setClickedProductId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location]);

    // Fetch Products from Backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                
                // Map database fields
                const formattedDbProducts = data.map(prod => ({
                    id: prod._id,
                    name: prod.name,
                    price: prod.price,
                    image: prod.imageUrl,
                    collection: prod.category || 'Exclusive',
                    category: prod.category || 'all',
                    color: 'all', // We can't automatically detect color from image yet
                    rating: 5, 
                    inStock: prod.stock > 0,
                    tag: 'NEW'
                }));
                
                setDbProducts(formattedDbProducts);
            } catch (error) {
                console.error("Failed to fetch products from DB:", error);
            }
        };
        fetchProducts();
    }, []);

    // Reset pagination to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, priceRange, selectedColor, selectedCategory, inStockOnly, sortBy]);

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        if (catalogRef.current) {
            const yOffset = -180; // Offset for sticky/fixed navbar
            const y = catalogRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleShopNowClick = () => {
        if (catalogRef.current) {
            const yOffset = -180; // Offset for sticky/fixed navbar
            const y = catalogRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const filteredProducts = useMemo(() => {
        const allProducts = [...dbProducts, ...PRODUCTS];
        
        return allProducts.filter(prod => {
            if (searchQuery && !prod.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (prod.price > priceRange) return false;
            if (selectedColor !== 'all' && prod.color !== selectedColor) return false;
            // Map prod.category or prod.occasion to our unified selectedCategory
            const prodCat = prod.category || prod.occasion || 'all';
            if (selectedCategory !== 'all' && prodCat.toLowerCase() !== selectedCategory.toLowerCase()) return false;
            if (inStockOnly && !prod.inStock) return false;
            if (rating5 && prod.rating !== 5) return false;
            if (rating4 && prod.rating !== 4) return false;
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0; // default (featured)
        });
    }, [dbProducts, searchQuery, priceRange, selectedColor, selectedCategory, inStockOnly, rating5, rating4, sortBy]);

    // Slice products for current page
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className={styles.shopContainer}>
            {/* Hero Section */}
            <header className={styles.heroSection}>
                {/* Background Animation Effect */}
                <div className={styles.heroGlows}>
                    <div className={styles.glowLeft}></div>
                    <div className={styles.glowRight}></div>
                </div>
                <div className={styles.heroContainer}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroTextCol}>
                            <span className={styles.heroTagline}>Welcome our Dazzlingsky...</span>
                            <h1 className={styles.heroTitle}>
                                Make Your Home as Comfortable
                                <span className={styles.textGradientRose}> as Possible</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                Make your home as comfortable as possible with the natural charm of fresh flowers.
                                Add comfort and elegance to your home with beautifully crafted fresh flower bouquets
                            </p>
                             <div className={styles.heroActions}>
                                <button className={styles.btnPrimary} onClick={handleShopNowClick}>Shop Now</button>
                                <button className={styles.btnOutline} onClick={() => navigate('/blog')}>View Lookbook</button>
                            </div>
                        </div>
                        <div className={styles.heroImageCol}>
                            <div className={styles.heroImageWrapper}>
                                <img
                                    className={styles.heroImg}
                                    alt="Premium isolated bouquet of pink peonies and lavender roses"
                                    src={heroimg}
                                />
                            </div>
                            <div className={styles.promoBadge}>
                                <p className={styles.promoTitle}>15% OFF</p>
                                <p className={styles.promoSubtitle}>Wedding Collection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>



            {/* Main Content Area */}
            <main className={styles.mainLayoutGrid} ref={catalogRef}>
                {/* Sidebar Filter */}
                <aside className={`${styles.filterSidebar} ${showMobileFilters ? styles.showFilters : ''}`}>
                    <div className={styles.sidebarCard}>
                        <div className={styles.sidebarHeader}>
                            <h3 className={styles.sidebarTitle}>Filters</h3>
                            <button className={styles.resetBtn} onClick={handleResetFilters}>Reset</button>
                        </div>

                        {/* Price Range Slider */}
                        <div className={styles.filterGroup}>
                            <p className={styles.filterLabel}>Price Range</p>
                            <input
                                type="range"
                                min="50"
                                max="2000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className={styles.rangeInput}
                            />
                            <div className={styles.priceLabels}>
                                <span>$50</span>
                                <span>${priceRange}</span>
                                <span>$2000+</span>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className={styles.filterGroup}>
                            <p className={styles.filterLabel}>Category</p>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={styles.sidebarSelect}
                            >
                                <option value="all">All Categories</option>
                                <option value="Bouquets">Bouquets</option>
                                <option value="Vases">Vases</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Gifts">Gifts</option>
                                <option value="Potted Plants">Potted Plants</option>
                            </select>
                        </div>

                        {/* Color Palette */}
                        <div className={styles.filterGroup}>
                            <p className={styles.filterLabel}>Color Palette</p>
                            <div className={styles.colorPaletteGrid}>
                                {COLORS.map(color => (
                                    <button
                                        key={color.id}
                                        className={`${styles.colorDot} ${selectedColor === color.id ? styles.activeColor : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => setSelectedColor(selectedColor === color.id ? 'all' : color.id)}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Expert Rating */}
                        <div className={styles.filterGroup}>
                            <p className={styles.filterLabel}>Expert Rating</p>
                            <div className={styles.ratingChecks}>
                                <label className={styles.checkLabel}>
                                    <input
                                        type="checkbox"
                                        checked={rating5}
                                        onChange={(e) => setRating5(e.target.checked)}
                                        className={styles.checkboxInput}
                                    />
                                    <div className={styles.stars}>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                </label>
                                <label className={styles.checkLabel}>
                                    <input
                                        type="checkbox"
                                        checked={rating4}
                                        onChange={(e) => setRating4(e.target.checked)}
                                        className={styles.checkboxInput}
                                    />
                                    <div className={styles.stars}>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined">star</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* In Stock toggle */}
                        <div className={styles.toggleGroup}>
                            <span className={styles.filterLabel}>In Stock Only</span>
                            <button
                                className={`${styles.toggleSwitch} ${inStockOnly ? styles.toggleActive : ''}`}
                                onClick={() => setInStockOnly(!inStockOnly)}
                            >
                                <div className={styles.toggleKnob}></div>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <section className={styles.productsSection}>
                    <div className={styles.productsMeta}>
                        <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '400px' }}>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '20px' }}>search</span>
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', background: '#111111', border: '1px solid rgba(255,138,216,0.2)', color: '#fff', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div className={styles.metaActions}>
                            <button
                                className={styles.mobileFilterToggle}
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                            >
                                <span className="material-symbols-outlined">filter_list</span>
                                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            <div className={styles.sortWrapper}>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={styles.sortSelect}
                                >
                                    <option value="featured">Sort by: Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <p className={styles.metaCount} style={{ marginBottom: '24px' }}>Showing {filteredProducts.length} arrangements</p>

                    <div className={styles.productsGrid}>
                        {paginatedProducts.map(prod => (
                            <article
                                key={prod.id}
                                className={styles.productCard}
                                onClick={() => navigate(`/product/${prod.id}`)}
                            >
                                <div className={styles.productImageWrapper}>
                                    <img className={styles.productImage} alt={prod.name} src={prod.image} />
                                    {prod.tag && <div className={styles.productBadge}>{prod.tag}</div>}
                                    <button
                                        className={`${styles.wishlistBtn} ${favorites.includes(prod.id) ? styles.wished : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(prod.id);
                                        }}
                                    >
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>
                                    <div className={styles.productOverlay}>
                                        <button
                                            className={`${styles.viewBtn} ${clickedProductId === prod.id ? styles.viewBtnClicked : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setClickedProductId(prod.id);
                                                setTimeout(() => {
                                                    navigate(`/product/${prod.id}`);
                                                }, 500);
                                            }}
                                            disabled={clickedProductId === prod.id}
                                        >
                                            {clickedProductId === prod.id ? (
                                                <span className={styles.btnContent}>
                                                    <span className={styles.goText}>Go</span>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                                </span>
                                            ) : (
                                                "View Product"
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.productDetails}>
                                    <div className={styles.productStars}>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <span
                                                key={index}
                                                className="material-symbols-outlined"
                                                style={{
                                                    fontSize: '14px',
                                                    fontVariationSettings: index < prod.rating ? "'FILL' 1" : "'FILL' 0"
                                                }}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <h4 className={styles.productName}>{prod.name}</h4>
                                    <p className={styles.productCollection}>{prod.collection}</p>
                                </div>
                                <div className={styles.productFooter}>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.price}>${prod.price}</span>
                                        {prod.originalPrice && <span className={styles.originalPrice}>${prod.originalPrice}</span>}
                                    </div>
                                    <button
                                        className={styles.cartBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(prod);
                                        }}
                                    >
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ''}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Newsletter Section */}
            <section className={styles.newsletterSection}>
                <div className={styles.newsletterCard}>
                    <div className={styles.newsletterGlows}>
                        <div className={styles.glowTopRight}></div>
                        <div className={styles.glowBottomLeft}></div>
                    </div>
                    <div className={styles.newsletterContent}>
                        <span className={styles.newsletterTagline}>Membership</span>
                        <h2 className={styles.newsletterTitle}>Join Our Elite Circle</h2>
                        <p className={styles.newsletterSubtitle}>Be the first to access limited-edition cultivars and private workshop invitations.</p>
                        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                            <input className={styles.newsletterInput} placeholder="email@address.com" type="email" />
                            <button className={styles.btnPrimary} type="submit" style={{ padding: '16px 48px' }}>Join Now</button>
                        </form>
                    </div>
                </div>
            </section>
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
