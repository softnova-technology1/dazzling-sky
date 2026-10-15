// Home.js — Dazzling Sky Luxury Floral Atelier
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import EnquirySuccessModal from '../../components/EnquirySuccessModal';
import styles from './home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const flowerWrapperRef = useRef(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const local = localStorage.getItem('dazzling_sky_wishlist');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Fetch real products from DB
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data.filter(prod => prod.isActive !== false));
        }
      } catch (err) {
        console.error('Error fetching homepage products from DB:', err);
      }
    };
    fetchDbProducts();
  }, []);

  const toggleWishlist = (productId) => {
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem('dazzling_sky_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist_updated'));
  };

  const handleAddToCart = (product) => {
    if (!product || (product.stock || 0) <= 0) return;
    const existingCart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === product._id);
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ id: product._id, quantity: 1 });
    }
    localStorage.setItem('dazzling_sky_cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cart_updated'));
  };

  // Enquiry form state for homepage consultation
  const [enquiryForm, setEnquiryForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const fileInputRef = useRef(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.firstName.trim() || !enquiryForm.email.trim() || !enquiryForm.message.trim()) {
      setEnquiryStatus({ loading: false, success: false, error: 'Please provide your first name, email, and message.' });
      return;
    }

    try {
      setEnquiryStatus({ loading: true, success: false, error: '' });
      const formData = new FormData();
      formData.append('firstName', enquiryForm.firstName.trim());
      formData.append('lastName', enquiryForm.lastName.trim());
      formData.append('email', enquiryForm.email.trim());
      formData.append('message', enquiryForm.message.trim());
      formData.append('source', 'homepage');
      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiryStatus({ loading: false, success: true, error: '' });
        setSuccessModalData({
          firstName: enquiryForm.firstName.trim(),
          lastName: enquiryForm.lastName.trim(),
          email: enquiryForm.email.trim(),
          attachmentName: attachmentFile ? attachmentFile.name : null,
          source: 'homepage'
        });
        setIsSuccessModalOpen(true);
        setEnquiryForm({ firstName: '', lastName: '', email: '', message: '' });
        setAttachmentFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setEnquiryStatus({ loading: false, success: false, error: data.message || 'Failed to submit enquiry' });
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setEnquiryStatus({ loading: false, success: false, error: 'Unable to connect to the server. Please try again.' });
    }
  };

  // Derive real DB products
  const featured = dbProducts.slice(0, 3);
  const catalogItems = dbProducts.length >= 8 
    ? dbProducts.slice(3, 8) 
    : (dbProducts.length > 0 ? dbProducts.slice(0, 5) : []);

  // Track scrollOffset on scroll for page effects via direct DOM modification for performance
  useEffect(() => {
    const flowerWrapper = flowerWrapperRef.current;
    const handleScroll = () => {
      const sy = window.scrollY;
      if (sy < 1000 && flowerWrapper) {
        flowerWrapper.style.transform = `translate3d(0, ${sy * 0.35}px, 0) scale(${Math.max(0.7, 1 - sy * 0.0006)})`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(`.${styles.revealElement}`);
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [dbProducts]);

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgWrapper}>
          <img
            className={styles.heroBgImage}
            alt="Artisanal luxury floral studio background in moody lavender tones"
            src="/hero_bg.png"
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* Floating Petals */}
        <svg className={`${styles.floatingPetal} ${styles.floatingPetal1}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C18 6, 22 14, 12 22 C6 14, 6 6, 12 2" fill="url(#petalGrad1)" />
          <defs>
            <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffffff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#4eff08ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal2}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 C16 8, 20 15, 12 21 C8 15, 4 8, 12 3" fill="url(#petalGrad2)" />
          <defs>
            <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e1bee7" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1874fdff" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal3}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C17 7, 21 13, 12 22 C7 13, 3 7, 12 2" fill="url(#petalGrad3)" />
          <defs>
            <linearGradient id="petalGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1c4e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9575cd" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal4}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4 C18 9, 19 16, 12 20 C5 16, 6 9, 12 4" fill="url(#petalGrad4)" />
          <defs>
            <linearGradient id="petalGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b39ddb" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ff0505e7" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal5}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C18 6, 22 14, 12 22 C6 14, 6 6, 12 2" fill="url(#petalGrad5)" />
          <defs>
            <linearGradient id="petalGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1c4e9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7e57c2" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal6}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 C16 8, 20 15, 12 21 C8 15, 4 8, 12 3" fill="url(#petalGrad6)" />
          <defs>
            <linearGradient id="petalGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e1bee7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#b39ddb" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal7}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C17 7, 21 13, 12 22 C7 13, 3 7, 12 2" fill="url(#petalGrad7)" />
          <defs>
            <linearGradient id="petalGrad7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1c4e9" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#9575cd" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal8}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4 C18 9, 19 16, 12 20 C5 16, 6 9, 12 4" fill="url(#petalGrad8)" />
          <defs>
            <linearGradient id="petalGrad8" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b39ddb" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#512da8" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Flower Objects */}
        <img
          className={`${styles.floatingObj} ${styles.floatingObj1}`}
          src="/part4.png"
          alt="Floating elegant rose bloom"
          aria-hidden="true"
        />
        <img
          className={`${styles.floatingObj} ${styles.floatingObj2}`}
          src="/part1.png"
          alt="Floating premium flower bouquet accent"
          aria-hidden="true"
        />
        <img
          className={`${styles.floatingObj} ${styles.floatingObj3}`}
          src="/part2.png"
          alt="Floating soft rose flower"
          aria-hidden="true"
        />
        <img
          className={`${styles.floatingObj} ${styles.floatingObj4}`}
          src="/part3.png"
          alt="Floating deluxe blossom petal"
          aria-hidden="true"
        />

        {/* Inner Container */}
        <div className={styles.heroContainer}>
          {/* Left Content Column */}
          <div className={`${styles.heroContent} ${styles.revealElement}`}>
            <h1 className={styles.heroHeading}>
              Providing joy, one flower at a time — <span className={styles.italicPrimary}>transforming petals</span> into perfect moments
            </h1>
            <p className={styles.heroSubtitle}>
              Experience a refined online destination for fresh, artistically handcrafted flower bouquets.
              Each arrangement is thoughtfully created with love, creativity, and the finest premium blooms.
              Share happiness, express heartfelt emotions, and mark life’s special moments with flowers that truly speak for you.
            </p>
            <div className={styles.heroButtonContainer}>
              <button className={styles.btnShopUnique} onClick={() => navigate('/shop')}>
                SHOP COLLECTION
              </button>
              <button className={styles.btnStory} onClick={() => navigate('/about')}>
                OUR STORY
              </button>
            </div>
          </div>

          {/* Right Floating Flower Column */}
          <div className={styles.heroRight}>
            <div
              ref={flowerWrapperRef}
              className={styles.flowerWrapper}
            >
              <div className={styles.flowerFloatContainer}>
                <img
                  className={styles.heroSingleFlower}
                  alt="Floating premium cluster of lavender roses"
                  src="/hero_single_flower.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.heroScrollIndicator}>
          <span className={styles.scrollLabel}>SCROLL</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* Featured Collection (Asymmetrical Bento) */}
      <section className={`${styles.featuredSection} ${styles.firstSectionAfterHero}`}>
        <div className={`${styles.featuredHeader} ${styles.revealElement}`}>
          <div className={styles.featuredHeaderLeft}>
            <span className={styles.featuredLabel}>EXQUISITE SELECTION</span>
            <h2 className={styles.sectionTitle}>Unveiling Our Popular Bouquet Collection</h2>
          </div>
          <Link to="/shop" className={styles.viewAllLink}>VIEW ALL SERIES</Link>
        </div>
        <div className={styles.accordionGrid}>
          {/* Card 1 */}
          <div 
            className={`${styles.accordionCard} ${styles.revealElement}`}
            onClick={() => featured[0] && navigate(`/product/${featured[0]._id}`)}
          >
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt={featured[0]?.name || "Whispering Blooms"}
                src={featured[0]?.imageUrl || "/home-1.png"}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>{featured[0]?.name || "Whispering Blooms"}</h3>
                <p className={styles.accordionSubtitle}>
                  {featured[0]?.description || "At Our Store, we take pride in offering a stunning selection of the most popular flowers that capture hearts and inspire joy."}
                </p>
                <Link 
                  to={featured[0] ? `/product/${featured[0]._id}` : "/shop"} 
                  className={styles.seeCatalogBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  See Catalog &rarr;
                </Link>
              </div>
              <span className={styles.accordionPrice}>
                from {featured[0]?.price ?? 50} SGD
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className={`${styles.accordionCard} ${styles.revealElement}`}
            onClick={() => featured[1] && navigate(`/product/${featured[1]._id}`)}
          >
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt={featured[1]?.name || "Enchanted Petals"}
                src={featured[1]?.imageUrl || "/home-2.png"}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>{featured[1]?.name || "Enchanted Petals"}</h3>
              </div>
              <span className={styles.accordionPrice}>
                from {featured[1]?.price ?? 70} SGD
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className={`${styles.accordionCard} ${styles.revealElement}`}
            onClick={() => featured[2] && navigate(`/product/${featured[2]._id}`)}
          >
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt={featured[2]?.name || "Harmony Bouquet"}
                src={featured[2]?.imageUrl || "/home-3.png"}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>{featured[2]?.name || "Harmony Bouquet"}</h3>
              </div>
              <span className={styles.accordionPrice}>
                from {featured[2]?.price ?? 40} SGD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.brandStorySection}>
        <div className={`${styles.storyContainer} ${styles.revealElement}`}>
          <div className={styles.storyGrid}>
            {/* Left Column: Overlapping Collage */}
            <div className={styles.collageContainer}>
              <div className={styles.collageBackdropWrapper}>
                <img
                  className={styles.collageBackdrop}
                  alt="Blossomia Flower Store window display and interior shop front"
                  src="/floral_inspirations.png"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.collageForegroundWrapper}>
                <img
                  className={styles.collageForeground}
                  alt="Florist working with green and white flowers"
                  src="/home-4.png"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right Column: Editorial Narrative */}
            <div className={styles.storyRightCol}>
              <span className={styles.featuredLabel}>OUR PHILOSOPHY</span>
              <h2 className={styles.storyTitle}>
                A Fragrant Tale:<br />Weaving Memories with Flowers
              </h2>
              <div className={styles.storyTextContent}>
                <p>
                  <span className={styles.dropCap}>B</span>lossomia Flower Store sprouted from a passion for nature's exquisite blooms, cultivating a haven where the beauty of flowers could inspire and uplift. Each flower that graces our store is carefully selected, ensuring that only the freshest and most vibrant petals find their way into our arrangements.
                </p>
                <p>
                  With meticulous attention to detail, our skilled florists handpick the freshest blossoms, crafting enchanting arrangements that become symbols of love, joy, and beauty in life's precious moments. Whether you want to surprise a loved one or decorate an event, Blossomia Flower Store is the perfect choice.
                </p>
                <Link to="/about" className={styles.storyReadMoreBtn}>
                  Read More &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className={styles.catalogSection}>
        <div className={styles.catalogSectionInner}>
          <div className={`${styles.catalogHeader} ${styles.revealElement}`}>
            <span className={styles.catalogHeaderLabel}>CURATED FOR EVERY OCCASION</span>
            <h2 className={styles.sectionTitle}>Catalog of Floral Delights</h2>
          </div>
          <div className={styles.catalogGrid}>
            {/* Product Item 1 */}
            <div 
              className={`${styles.catalogCard} ${styles.revealElement}`}
              onClick={() => catalogItems[0] && navigate(`/product/${catalogItems[0]._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catalogCardImgBox}>
                <img 
                  alt={catalogItems[0]?.name || "Enchanted Petals"} 
                  src={catalogItems[0]?.imageUrl || "/home-1.png"} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>{catalogItems[0]?.name || "Enchanted Petals"}</h3>
                  <p className={styles.catalogPrice}>{catalogItems[0]?.price ?? 70} SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[0]) toggleWishlist(catalogItems[0]._id);
                    }}
                    style={catalogItems[0] && wishlist.includes(catalogItems[0]._id) ? { color: '#ff8ad8' } : {}}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={catalogItems[0] && wishlist.includes(catalogItems[0]._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {catalogItems[0] && wishlist.includes(catalogItems[0]._id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[0]) handleAddToCart(catalogItems[0]);
                    }}
                    disabled={catalogItems[0] && (catalogItems[0].stock || 0) <= 0}
                    style={catalogItems[0] && (catalogItems[0].stock || 0) <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                    title={catalogItems[0] && (catalogItems[0].stock || 0) <= 0 ? 'Out of stock' : 'Add to cart'}
                  >
                    <span className="material-symbols-outlined">
                      {catalogItems[0] && (catalogItems[0].stock || 0) <= 0 ? 'block' : 'shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 2 */}
            <div 
              className={`${styles.catalogCard} ${styles.revealElement}`}
              onClick={() => catalogItems[1] && navigate(`/product/${catalogItems[1]._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catalogCardImgBox}>
                <img 
                  alt={catalogItems[1]?.name || "Serene Bliss"} 
                  src={catalogItems[1]?.imageUrl || "/home-3.png"} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>{catalogItems[1]?.name || "Serene Bliss"}</h3>
                  <p className={styles.catalogPrice}>{catalogItems[1]?.price ?? 60} SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[1]) toggleWishlist(catalogItems[1]._id);
                    }}
                    style={catalogItems[1] && wishlist.includes(catalogItems[1]._id) ? { color: '#ff8ad8' } : {}}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={catalogItems[1] && wishlist.includes(catalogItems[1]._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {catalogItems[1] && wishlist.includes(catalogItems[1]._id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[1]) handleAddToCart(catalogItems[1]);
                    }}
                    disabled={catalogItems[1] && (catalogItems[1].stock || 0) <= 0}
                    style={catalogItems[1] && (catalogItems[1].stock || 0) <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                    title={catalogItems[1] && (catalogItems[1].stock || 0) <= 0 ? 'Out of stock' : 'Add to cart'}
                  >
                    <span className="material-symbols-outlined">
                      {catalogItems[1] && (catalogItems[1].stock || 0) <= 0 ? 'block' : 'shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Button Card (3rd slot) */}
            <div className={`${styles.openMoreCard} ${styles.revealElement}`}>
              <div className={styles.flower3DContainer}>
                <img
                  className={styles.flowerMainImage}
                  src="/open more.png"
                  alt="3D Flower Bouquet"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className={`${styles.flowerPetal} ${styles.petal1}`}
                  src="/part2.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className={`${styles.flowerPetal} ${styles.petal2}`}
                  src="/part3.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className={`${styles.flowerPetal} ${styles.petal3}`}
                  src="/part4.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className={`${styles.flowerPetal} ${styles.petal4}`}
                  src="/part3.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <Link to="/shop" className={styles.openMoreBtn}>
                Open More &rarr;
              </Link>
            </div>

            {/* Product Item 4 */}
            <div 
              className={`${styles.catalogCard} ${styles.revealElement}`}
              onClick={() => catalogItems[2] && navigate(`/product/${catalogItems[2]._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catalogCardImgBox}>
                <img 
                  alt={catalogItems[2]?.name || "Whispering Meadows"} 
                  src={catalogItems[2]?.imageUrl || "/home-2.png"} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>{catalogItems[2]?.name || "Whispering Meadows"}</h3>
                  <p className={styles.catalogPrice}>{catalogItems[2]?.price ?? 45} SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[2]) toggleWishlist(catalogItems[2]._id);
                    }}
                    style={catalogItems[2] && wishlist.includes(catalogItems[2]._id) ? { color: '#ff8ad8' } : {}}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={catalogItems[2] && wishlist.includes(catalogItems[2]._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {catalogItems[2] && wishlist.includes(catalogItems[2]._id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[2]) handleAddToCart(catalogItems[2]);
                    }}
                    disabled={catalogItems[2] && (catalogItems[2].stock || 0) <= 0}
                    style={catalogItems[2] && (catalogItems[2].stock || 0) <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                    title={catalogItems[2] && (catalogItems[2].stock || 0) <= 0 ? 'Out of stock' : 'Add to cart'}
                  >
                    <span className="material-symbols-outlined">
                      {catalogItems[2] && (catalogItems[2].stock || 0) <= 0 ? 'block' : 'shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 5 */}
            <div 
              className={`${styles.catalogCard} ${styles.revealElement}`}
              onClick={() => catalogItems[3] && navigate(`/product/${catalogItems[3]._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catalogCardImgBox}>
                <img 
                  alt={catalogItems[3]?.name || "Floral Harmony"} 
                  src={catalogItems[3]?.imageUrl || "/home-4.png"} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>{catalogItems[3]?.name || "Floral Harmony"}</h3>
                  <p className={styles.catalogPrice}>{catalogItems[3]?.price ?? 80} SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[3]) toggleWishlist(catalogItems[3]._id);
                    }}
                    style={catalogItems[3] && wishlist.includes(catalogItems[3]._id) ? { color: '#ff8ad8' } : {}}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={catalogItems[3] && wishlist.includes(catalogItems[3]._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {catalogItems[3] && wishlist.includes(catalogItems[3]._id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[3]) handleAddToCart(catalogItems[3]);
                    }}
                    disabled={catalogItems[3] && (catalogItems[3].stock || 0) <= 0}
                    style={catalogItems[3] && (catalogItems[3].stock || 0) <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                    title={catalogItems[3] && (catalogItems[3].stock || 0) <= 0 ? 'Out of stock' : 'Add to cart'}
                  >
                    <span className="material-symbols-outlined">
                      {catalogItems[3] && (catalogItems[3].stock || 0) <= 0 ? 'block' : 'shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 6 */}
            <div 
              className={`${styles.catalogCard} ${styles.revealElement}`}
              onClick={() => catalogItems[4] && navigate(`/product/${catalogItems[4]._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.catalogCardImgBox}>
                <img 
                  alt={catalogItems[4]?.name || "Springtime Serenade"} 
                  src={catalogItems[4]?.imageUrl || "/home-5.png"} 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>{catalogItems[4]?.name || "Springtime Serenade"}</h3>
                  <p className={styles.catalogPrice}>{catalogItems[4]?.price ?? 65} SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[4]) toggleWishlist(catalogItems[4]._id);
                    }}
                    style={catalogItems[4] && wishlist.includes(catalogItems[4]._id) ? { color: '#ff8ad8' } : {}}
                  >
                    <span 
                      className="material-symbols-outlined"
                      style={catalogItems[4] && wishlist.includes(catalogItems[4]._id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {catalogItems[4] && wishlist.includes(catalogItems[4]._id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <button 
                    className={styles.catalogIconBtn} 
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (catalogItems[4]) handleAddToCart(catalogItems[4]);
                    }}
                    disabled={catalogItems[4] && (catalogItems[4].stock || 0) <= 0}
                    style={catalogItems[4] && (catalogItems[4].stock || 0) <= 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                    title={catalogItems[4] && (catalogItems[4].stock || 0) <= 0 ? 'Out of stock' : 'Add to cart'}
                  >
                    <span className="material-symbols-outlined">
                      {catalogItems[4] && (catalogItems[4].stock || 0) <= 0 ? 'block' : 'shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Gallery */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>STAY CONNECTED</span>
            <h2 className={styles.sectionTitleElegant}>
              Follow Our <span className={styles.italicGradient}>Floral Journey</span>
            </h2>
            <div className={styles.headerLine} />
          </div>

          <div className={styles.premiumGalleryGrid}>
            {/* Card 3: Vertical Portrait Showcase Card */}
            <div className={`${styles.premiumCardPortrait} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Minimalist Vase Floral Detail"
                  src="/floral_collections.png"
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.imageOverlayGradient} />
                <div className={styles.premiumCardTag}>
                  <span>BOUQUETS</span>
                </div>
              </div>
              <div className={styles.premiumCardContentOverlay}>
                {/* <h3>Botanical Wonders</h3> */}
                {/* <p>Follow us today and embark on a blooming journey that will ignite your passion for all things floral.</p> */}
              </div>
            </div>

            {/* Card 2: Medium Detail Card */}
            <div className={`${styles.premiumCardMedium} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Floral Bouquet Close-up Detail"
                  src="/flr2.png"
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.imageOverlayGradient} />
              </div>
              <div className={styles.premiumCardTag}>
                <span>BOUQUETS</span>
              </div>
            </div>

            {/* Card 1: Large Featured Card */}
            <div className={`${styles.premiumCardLarge} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Premium Floral Arrangement Showcase"
                  src="/int.png"
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.imageOverlayGradient} />
              </div>
              <div className={styles.premiumCardContent}>
                <p className={styles.premiumDesc}>
                  Be the first to know about our exciting events, exclusive offers, and new arrivals. Join our floral community and let us fill your feed with beauty and botanical wonders. Follow us today and embark on a blooming journey that will ignite your passion for all things floral.
                </p>
                <div className={styles.premiumBtnWrapper}>
                  <button
                    className={styles.premiumContactBtn}
                    onClick={() => navigate('/contacts')}
                  >
                    <span>Contact Us</span>
                    <span className={styles.btnArrow}>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className={styles.contactSection}>
        {/* Decorative background orbs */}
        <div className={styles.contactOrbTL} />
        <div className={styles.contactOrbBR} />
        <div className={styles.contactOrbCenter} />

        <div className={styles.contactInner}>
          {/* ---- LEFT PANEL ---- */}
          <div className={`${styles.contactLeftPanel} ${styles.revealElement}`}>
            {/* Giant watermark text */}
            <span className={styles.contactWatermark} aria-hidden="true">CONTACT</span>

            {/* Tag */}
            <span className={styles.contactTag}>GET IN TOUCH</span>

            {/* Headline */}
            <h2 className={styles.contactHeading}>
              Get in <span className={styles.contactHeadingAccent}>Touch</span>
            </h2>

            {/* Description */}
            <p className={styles.contactDesc}>
              Reach out, and let's create a universe of possibilities together! Whether for a bespoke wedding or a simple gesture of love.
            </p>

            {/* Divider line */}
            <div className={styles.contactDivider} />

            {/* Accent image showcase */}
            <div className={styles.contactAccentWrapper}>
              <img
                src="/contact.png"
                alt="Luxury Floral Arrangement Atelier"
                className={styles.contactAccentImg}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.contactAccentOverlay}>
                <div className={styles.contactAccentQuoteContainer}>
                  <p className={styles.contactAccentQuote}>
                    “Two lunar months revealed Earth’s fragile beauty against vast silence, transforming my view of our place in the universe.”
                  </p>
                  <p className={styles.contactAccentAuthor}>— Irinel Traista</p>
                </div>
              </div>
            </div>

            {/* Contact Info Items */}
            <div className={styles.contactInfoList}>
              <div className={styles.contactInfoCard}>
                <div className={styles.contactIconRing}>
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className={styles.contactInfoText}>
                  <p className={styles.contactItemLabel}>OUR ATELIER</p>
                  <p className={styles.contactItemValue}>01-019, Jalan besar, Singapore 208786</p>
                </div>
              </div>

              <div className={styles.contactInfoCard}>
                <div className={styles.contactIconRing}>
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div className={styles.contactInfoText}>
                  <p className={styles.contactItemLabel}>CALL US</p>
                  <p className={styles.contactItemValue}>+65 8814 4043</p>
                </div>
              </div>

              <div className={styles.contactInfoCard}>
                <div className={styles.contactIconRing}>
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className={styles.contactInfoText}>
                  <p className={styles.contactItemLabel}>EMAIL</p>
                  <p className={styles.contactItemValue}>info@dazzlingsky.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---- RIGHT PANEL: Glassmorphic Form Card ---- */}
          <div className={`${styles.contactRightPanel} ${styles.revealElement}`}>
            <div className={styles.glassFormCard}>
              {/* Card header accent */}
              <div className={styles.formCardHeader}>
                <div className={styles.formCardHeaderDot} />
                <div className={styles.formCardHeaderDot} />
                <div className={styles.formCardHeaderDot} />
              </div>

              <div className={styles.formContentHeader}>
                <h3 className={styles.formTitle}>Let’s connect constellations</h3>
                <p className={styles.formSubtitle}>
                  Let's align our constellations! Reach out and let the magic of collaboration illuminate our skies.
                </p>
              </div>

              <form className={styles.contactForm} onSubmit={handleEnquirySubmit}>
                {enquiryStatus.success && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#4ade80',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    ✨ <strong>Consultation Request Received!</strong> Our master floral atelier will be in touch with you shortly.
                  </div>
                )}

                {enquiryStatus.error && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    ⚠️ {enquiryStatus.error}
                  </div>
                )}

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>First Name *</label>
                    <input
                      id="firstName"
                      className={styles.inputField}
                      placeholder="Julian"
                      type="text"
                      required
                      value={enquiryForm.firstName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, firstName: e.target.value })}
                      disabled={enquiryStatus.loading}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
                    <input
                      id="lastName"
                      className={styles.inputField}
                      placeholder="Davenport"
                      type="text"
                      value={enquiryForm.lastName}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, lastName: e.target.value })}
                      disabled={enquiryStatus.loading}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
                  <input
                    id="email"
                    className={styles.inputField}
                    placeholder="julian@example.com"
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    disabled={enquiryStatus.loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message *</label>
                  <textarea
                    id="message"
                    className={styles.inputField}
                    placeholder="Tell us about your floral dreams..."
                    rows="4"
                    required
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    disabled={enquiryStatus.loading}
                  />
                </div>

                {/* File Attachment Option */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Attachment / Inspiration <span style={{ opacity: 0.6, fontSize: '11px', fontWeight: 400 }}>(Optional - Image or PDF)</span>
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setAttachmentFile(e.target.files[0] || null)}
                    accept="image/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="homeAttachmentInput"
                    disabled={enquiryStatus.loading}
                  />

                  {!attachmentFile ? (
                    <label
                      htmlFor="homeAttachmentInput"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px dashed rgba(255, 138, 216, 0.4)',
                        background: 'rgba(255, 138, 216, 0.05)',
                        color: '#ff8ad8',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      <span>📎 Attach Photo / Moodboard / File</span>
                    </label>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 138, 216, 0.12)',
                      border: '1px solid rgba(255, 138, 216, 0.4)',
                      color: '#ffffff',
                      fontSize: '13px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <span style={{ color: '#ff8ad8' }}>📎</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {attachmentFile.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#a3a3a3' }}>
                          ({(attachmentFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '0 4px'
                        }}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  className={styles.btnSubmit} 
                  type="submit" 
                  disabled={enquiryStatus.loading}
                  style={{ opacity: enquiryStatus.loading ? 0.7 : 1, cursor: enquiryStatus.loading ? 'not-allowed' : 'pointer' }}
                >
                  {enquiryStatus.loading ? 'TRANSMITTING...' : 'SEND IT TO FLOOR'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Thank You Success Modal */}
      <EnquirySuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        enquiryData={successModalData}
      />
    </div>
  );
}
