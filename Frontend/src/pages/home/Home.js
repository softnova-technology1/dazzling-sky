// Home.js — Dazzling Sky Luxury Floral Atelier
import React, { useState, useEffect } from 'react';
import styles from './home.module.css';

export default function Home() {
  const [scrollOffset, setScrollOffset] = useState(0);

  // Track scrollOffset on scroll for page effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
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
  }, []);

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
              Experience a refined online destination for fresh, artistically handcrafted flower bouquets. Each arrangement is thoughtfully created with love, creativity, and the finest premium blooms.
            </p>
            <div className={styles.heroButtonContainer}>
              <button className={styles.btnShopUnique}>
                SHOP COLLECTION
              </button>
              <button className={styles.btnStory}>
                OUR STORY
              </button>
            </div>
          </div>

          {/* Right Floating Flower Column */}
          <div className={styles.heroRight}>
            <div
              className={styles.flowerWrapper}
              style={{ transform: `translate3d(0, ${scrollOffset * 0.35}px, 0) scale(${Math.max(0.7, 1 - scrollOffset * 0.0006)})` }}
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
          <a className={styles.viewAllLink} href="#">VIEW ALL SERIES</a>
        </div>
        <div className={styles.accordionGrid}>
          {/* Card 1: Whispering Blooms */}
          <div className={`${styles.accordionCard} ${styles.revealElement}`}>
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt="Whispering Blooms bouquet with hydrangeas, anemones, and lilies in a ceramic vase"
                src="/home-1.png"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>Whispering Blooms</h3>
                <p className={styles.accordionSubtitle}>At Our Store, we take pride in offering a stunning selection of the most popular flowers that capture hearts and inspire joy.</p>
                <a href="/shop" className={styles.seeCatalogBtn}>See Catalog &rarr;</a>
              </div>
              <span className={styles.accordionPrice}>from 50 SGD</span>
            </div>
          </div>

          {/* Card 2: Enchanted Petals */}
          <div className={`${styles.accordionCard} ${styles.revealElement}`}>
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt="Enchanted Petals elegant peach and rose bouquet"
                src="/home-2.png"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>Enchanted Petals</h3>
              </div>
              <span className={styles.accordionPrice}>from 70 SGD</span>
            </div>
          </div>

          {/* Card 3: Harmony Bouquet */}
          <div className={`${styles.accordionCard} ${styles.revealElement}`}>
            <div className={styles.accordionImgWrapper}>
              <img
                className={styles.accordionImage}
                alt="Harmony Bouquet arrangement in a silver vase"
                src=" /home-3.png"
              />
            </div>
            <div className={styles.accordionOverlay} />
            <div className={styles.accordionDetails}>
              <div className={styles.accordionTitleGroup}>
                <h3>Harmony Bouquet</h3>
              </div>
              <span className={styles.accordionPrice}>from 40 SGD</span>
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
                />
              </div>
              <div className={styles.collageForegroundWrapper}>
                <img
                  className={styles.collageForeground}
                  alt="Florist working with green and white flowers"
                  src="/home-4.png"
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
                <a href="/about" className={styles.storyReadMoreBtn}>
                  Read More &rarr;
                </a>
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
            <div className={`${styles.catalogCard} ${styles.revealElement}`}>
              <div className={styles.catalogCardImgBox}>
                <img alt="Enchanted Petals" src="/home-1.png" />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>Enchanted Petals</h3>
                  <p className={styles.catalogPrice}>70 SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button className={styles.catalogIconBtn} aria-label="Add to favorites">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                  <button className={styles.catalogIconBtn} aria-label="Add to cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 2 */}
            <div className={`${styles.catalogCard} ${styles.revealElement}`}>
              <div className={styles.catalogCardImgBox}>
                <img alt="Serene Bliss" src="/home-3.png" />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>Serene Bliss</h3>
                  <p className={styles.catalogPrice}>60 SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button className={styles.catalogIconBtn} aria-label="Add to favorites">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                  <button className={styles.catalogIconBtn} aria-label="Add to cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Button Card (3rd slot) */}
            <div className={`${styles.openMoreCard} ${styles.revealElement}`}>
              <a href="#catalog" className={styles.openMoreBtn}>
                Open More &rarr;
              </a>
            </div>

            {/* Product Item 4 */}
            <div className={`${styles.catalogCard} ${styles.revealElement}`}>
              <div className={styles.catalogCardImgBox}>
                <img alt="Whispering Meadows" src="/home-2.png" />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>Whispering Meadows</h3>
                  <p className={styles.catalogPrice}>45 SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button className={styles.catalogIconBtn} aria-label="Add to favorites">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                  <button className={styles.catalogIconBtn} aria-label="Add to cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 5 */}
            <div className={`${styles.catalogCard} ${styles.revealElement}`}>
              <div className={styles.catalogCardImgBox}>
                <img alt="Floral Harmony" src="/home-4.png" />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>Floral Harmony</h3>
                  <p className={styles.catalogPrice}>80 SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button className={styles.catalogIconBtn} aria-label="Add to favorites">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                  <button className={styles.catalogIconBtn} aria-label="Add to cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Item 6 */}
            <div className={`${styles.catalogCard} ${styles.revealElement}`}>
              <div className={styles.catalogCardImgBox}>
                <img alt="Springtime Serenade" src="/home-5.png" />
              </div>
              <div className={styles.catalogCardFooter}>
                <div className={styles.catalogCardDetails}>
                  <h3>Springtime Serenade</h3>
                  <p className={styles.catalogPrice}>65 SGD</p>
                </div>
                <div className={styles.catalogIcons}>
                  <button className={styles.catalogIconBtn} aria-label="Add to favorites">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                  <button className={styles.catalogIconBtn} aria-label="Add to cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
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
            {/* Card 1: Large Featured Card */}
            <div className={`${styles.premiumCardLarge} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Premium Floral Arrangement Showcase"
                  src="/int.png"
                />
                <div className={styles.imageOverlayGradient} />
              </div>
              <div className={styles.premiumCardContent}>
                <p className={styles.premiumDesc}>
                  Be the first to know about our exciting events, exclusive offers, and new arrivals. Join our floral community and let us fill your feed with beauty and botanical wonders.
                </p>
                <div className={styles.premiumBtnWrapper}>
                  <button
                    className={styles.premiumContactBtn}
                    onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>Contact Us</span>
                    <span className={styles.btnArrow}>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Medium Detail Card */}
            <div className={`${styles.premiumCardMedium} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Floral Bouquet Close-up Detail"
                  src="/flr2.jpg"
                />
                <div className={styles.imageOverlayGradient} />
              </div>
              <div className={styles.premiumCardTag}>
                <span>BOUQUETS</span>
              </div>
            </div>

            {/* Card 3: Vertical Portrait Showcase Card */}
            <div className={`${styles.premiumCardPortrait} ${styles.revealElement}`}>
              <div className={styles.premiumImgWrapper}>
                <img
                  className={styles.premiumImage}
                  alt="Minimalist Vase Floral Detail"
                  src="/floral_collections.png"
                />
                <div className={styles.imageOverlayGradient} />
              </div>
              <div className={styles.premiumCardContentOverlay}>
                <h3>Botanical Wonders</h3>
                <p>Follow us today and embark on a blooming journey that will ignite your passion for all things floral.</p>
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
                src="/contact_accent.png"
                alt="Luxury Floral Arrangement Atelier"
                className={styles.contactAccentImg}
              />
              <div className={styles.contactAccentOverlay} />
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

              <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
                    <input
                      id="firstName"
                      className={styles.inputField}
                      placeholder="Julian"
                      type="text"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
                    <input
                      id="lastName"
                      className={styles.inputField}
                      placeholder="Davenport"
                      type="text"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                  <input
                    id="email"
                    className={styles.inputField}
                    placeholder="julian@example.com"
                    type="email"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message</label>
                  <textarea
                    id="message"
                    className={styles.inputField}
                    placeholder="Tell us about your floral dreams..."
                    rows="4"
                  />
                </div>
                <button className={styles.btnSubmit} type="submit">
                  SEND IT TO FLOOR
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
