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
              <stop offset="0%" stopColor="#d1c4e9" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#7e57c2" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`${styles.floatingPetal} ${styles.floatingPetal2}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 C16 8, 20 15, 12 21 C8 15, 4 8, 12 3" fill="url(#petalGrad2)" />
          <defs>
            <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e1bee7" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#b39ddb" stopOpacity="0.15" />
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
              <stop offset="100%" stopColor="#512da8" stopOpacity="0.25" />
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
          src="/hero.png"
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
        <div className={styles.bentoGrid}>
          {/* Large Focus Card */}
          <div className={`${styles.bentoLargeCard} ${styles.revealElement}`}>
            <div className={styles.bentoImgWrapper}>
              <img
                className={styles.cardImage}
                alt="Whispering Blooms bouquet with hydrangeas, anemones, and lilies in a ceramic vase"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZOejvcF2mPBAqxzYIqIokg4WyyNQFCEHGVh2BefEi0DiAPEcyHwJPmQxf9X-dpAAkMnspYvs4DjI8ABHwnPSBChVCFxEmwK0vToxrPSZ9UVq_MaXVbcODDjXqCKWlCSanbySsZfohBzNAQKLwdBwmy9cWPZqjznZ2upPk_xCyBnQNoyjgGO0BHT34DOVOMEnqy4IFBQsXAmSbrxPYWrRG37XhPtVEYzlWnSnmALgvRvmX40GbRs5qwD_StGOGv1Y1zzByrRSr0TV"
              />
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.cardTitleGroup}>
                <h3>Whispering Blooms</h3>
                <p className={styles.cardSubtitle}>LIMITED ATELIER EDITION</p>
              </div>
              <span className={styles.cardPrice}>FROM 120 SGD</span>
            </div>
          </div>

          {/* Smaller Stacked Cards */}
          <div className={styles.bentoSmallCol}>
            <div className={`${styles.bentoSmallCard} ${styles.revealElement}`}>
              <div className={styles.aspectSquare}>
                <img
                  className={styles.cardImage}
                  alt="Harmony Bouquet featuring yellow ranunculus, wild greenery, and soft pink carnations"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEM13vzM4qwQRK7YqQezsDJ6Y5hgIT1i-Ti9LBH3go5v2trPAappJF8zKlk3I2UR3jbx9pdu7vi-9oKzARduxgOO-vMFT7lTOTsEcv3AgfPNbS81Bc4z9lBZ1Kj9qnMdIh06lVvVwjkU0PMh02K8J5FMEA6ugA4lX73FZ2wDZAJuMdGPsSna5PP3Lj5LB5bGME7jYZdbMPImFC0emPOJXdK_fI_TYoMo7K9BRE45x0ppSDI7qYXGk73KYIANEoSTgoyJc2zIZfsn8H"
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardTitleGroup}>
                  <h3>Harmony Bouquet</h3>
                </div>
                <span className={styles.cardPrice}>95 SGD</span>
              </div>
            </div>

            <div className={`${styles.bentoSmallCard} ${styles.mt12} ${styles.revealElement}`}>
              <div className={styles.aspectTall}>
                <img
                  className={styles.cardImage}
                  alt="Nocturnal Petals moody bouquet showcasing deep crimson roses and dried elements"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByvAa_L3gUok_kEP8aItLNRvGY0nsqWoNX8u_sGOqheDktQqqZrBZ_ZISB2paBd3jBA2RxhR-w7VtxMKzPQ8jtzKD-iE91IhbD6K0pkz4-uLO2kOBe6b1U_N9tQ8dnEGnUqmZNU3nCiaTRkUrsOhYevCFWTMMlSQ3kqtF3r1wy4QXr9gdiwJCC1iqVskh6soH2w-5xeCwbvqMMMbJxiLOIWgg7Ve_BaAEqxEXwPBymw4z9gTHXxrFcgEb8lrcHp-M9djIQl9KXMz3t"
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardTitleGroup}>
                  <h3>Nocturnal Petals</h3>
                </div>
                <span className={styles.cardPrice}>150 SGD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.brandStorySection}>
        <div className={`${styles.storyContainer} ${styles.revealElement}`}>
          <div className={styles.storyGrid}>
            <div className={styles.storyImgCol}>
              <div className={styles.storyImgWrapper}>
                <img
                  className={styles.storyImg}
                  alt="Master florist working in a dimly lit studio selecting a single white lily"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmratpgzSMQY0kPrAasoBNA4E3lYRsOcI92CBHwUKnuTeEev603XWVA1QiVr2_nh4TvsY6Io1TkQ2IM4JV1o1fU6I-8o4r39XxDJbYBYyw2Tfi48-Hg9j4MOkQ6wLGHifOwEGmrZiV6AfyeHRr3VDTVISIMwDQU1mt_pTd9d43Xz6RoiTWW0G6W9htBKgdS4YaxFpk8CvB7h1yvG3VXeuRW-TWQb4Gou01Y6_xgM4LlHBU-9fIEog4VqT0TwDwtr-oF4JdzBd2RN7u"
                />
              </div>
              <div className={styles.decorativeBorder} />
            </div>
            <div className={styles.storyTextCol}>
              <span className={styles.featuredLabel}>OUR PHILOSOPHY</span>
              <h2 className={styles.sectionTitle} style={{ marginBottom: '2rem' }}>
                A Fragrant Tale: Weaving Memories with Flowers
              </h2>
              <div className={styles.charcoalDivider} style={{ marginBottom: '2.5rem', width: '6rem' }} />
              <p className={styles.bodyLg}>
                At Dazzling Sky, we believe every flower tells a story. Our journey began with a simple passion for nature's quiet elegance—capturing the ephemeral beauty of a bloom and preserving it in a moment of pure artistry.
              </p>
              <p className={styles.blockquoteText}>
                "We don't just sell bouquets; we curate emotions. From the first sketch of an arrangement to the final delicate ribbon, our atelier is a sanctuary for those who appreciate the finer details of botanical design."
              </p>
              <button className={styles.btnReadStory}>
                READ OUR FULL STORY
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className={styles.catalogSection}>
        <div className={`${styles.catalogHeader} ${styles.revealElement}`}>
          <h2 className={styles.sectionTitle}>Catalog of Floral Delights</h2>
          <span className={styles.catalogHeaderLabel}>CURATED FOR EVERY OCCASION</span>
        </div>
        <div className={styles.catalogGrid}>
          {/* Product Item 1 */}
          <div className={`${styles.catalogCard} ${styles.revealElement}`}>
            <div className={styles.catalogCardImgBox}>
              <img
                alt="Enchanted Petals elegant bouquet with roses and eucalyptus"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFTEQQTYRfpvAIENYhxb4VS2dPvEKWRa2pq_2NzLfUTd0VCVqvJEiSbr-UE-C5aDfN4YpmyETiACI-3G1DlzN6ykpQEYveqiufbjM29ELExPezXZ0XiKJuqxtc3UkO40JESOWiQUQefvYkGugdOIesOp2Sv8wkLUSOfHOkMn5Q1CzGoSgqm3LotUsPvPH80dukkHbBHlvV3iNHoBgvCtny9Bc7VIEgmWDink-ztzgksv9Xf66rbl-Tcq2xFdDhtqXyFKFkjtNnqX-B"
              />
              <div className={styles.catalogCardHoverOverlay}>
                <button className={styles.hoverBtn} aria-label="Add to cart">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </button>
                <button className={styles.hoverBtn} aria-label="Add to favorites">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
            </div>
            <div className={styles.catalogCardFooter}>
              <div>
                <h3>Enchanted Petals</h3>
                <p className={styles.catalogCardCategory}>WEDDING &amp; CELEBRATION</p>
              </div>
              <p className={styles.catalogPrice}>70 SGD</p>
            </div>
          </div>

          {/* Product Item 2 */}
          <div className={`${styles.catalogCard} ${styles.revealElement}`}>
            <div className={styles.catalogCardImgBox}>
              <img
                alt="Whispering Meadows rustic wild flower bouquet"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuzLxsZzxoPvf04G5wYoPRhdQ9G4SQMJZTeWZIJEvB_7qN_mL4sJcwBIbjqO1TBxc_rt0SOKluMxKELiGlwLkIguHvBLFGkkVzU83z3zTO53TmHTWxY6p6xQbQv-kizw8siQs0rBPn1763OwPdojdkn5ZXyjaTUwI2eqocU-YNOCTt47h9yzL-mHHwo04-Oih1ng14FXjwTwL6bMUyfkxtdAvPafcMb4QA_sONxRHzAt2_gzJh46KPTq0fMmKH2YS0OT87gh5mNmQk"
              />
              <div className={styles.catalogCardHoverOverlay}>
                <button className={styles.hoverBtn} aria-label="Add to cart">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </button>
              </div>
            </div>
            <div className={styles.catalogCardFooter}>
              <div>
                <h3>Whispering Meadows</h3>
                <p className={styles.catalogCardCategory}>WILD AT HEART</p>
              </div>
              <p className={styles.catalogPrice}>45 SGD</p>
            </div>
          </div>

          {/* Product Item 3 */}
          <div className={`${styles.catalogCard} ${styles.revealElement}`}>
            <div className={styles.catalogCardImgBox}>
              <img
                alt="Serene Bliss classic white roses and lilies"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY9RIaASspQO3B5_9rPfTumSa9LfBZ8wUTmK_YZVBsLKTwpNW86NAahJaD6pc98-uvWrSNAwcXyAr7N9AALYnzJDdEfG82pJjtQOJVtcuTcIpOgNo4wY4IM8D3eJlzAiUt3HHygjH1mJloHEob8ykUC2EQ0uT4QhYel3kH5G_zXV703RT4h12n-eJoAjjpApcsSLsEQnrXbYyGn2h-pE-ye1Xb4QOOuil4aJDYzruNvucZVsoxW2n2UKR-17sSmETmKAf4Kor400wf"
              />
              <div className={styles.catalogCardHoverOverlay}>
                <button className={styles.hoverBtn} aria-label="Add to cart">
                  <span className="material-symbols-outlined">shopping_cart</span>
                </button>
              </div>
            </div>
            <div className={styles.catalogCardFooter}>
              <div>
                <h3>Serene Bliss</h3>
                <p className={styles.catalogCardCategory}>MINIMALIST ELEGANCE</p>
              </div>
              <p className={styles.catalogPrice}>60 SGD</p>
            </div>
          </div>
        </div>
        <div className={styles.catalogCtaContainer}>
          <button className={styles.btnExploreAll}>
            EXPLORE ALL COLLECTIONS
          </button>
        </div>
      </section>

      {/* Social Gallery */}
      <section className={styles.gallerySection}>
        <div className={styles.featuredSection} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className={`${styles.galleryHeader} ${styles.revealElement}`}>
            <h2>Follow Our Floral Journey</h2>
            <a href="#">@DAZZLINGSKY_ATELIER</a>
          </div>
          <div className={styles.galleryGrid}>
            <div className={`${styles.galleryItem} ${styles.revealElement}`}>
              <img
                alt="Individual flower stems laid on workspace"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUXNwugkFErK2uDILnh7ASHOA8QzK8_JOItSRILrmdqj_WC8ZjIyiTGXrs1Bdt2HwG0Qo581K94Q1Wp8rqgFdsup3BazuETj3a1N4I5Uvqrcwm4xNnnCyl5ZKKS8TaamCQY_DEX-ZEmRiR812ECFbl79YTE4XWQJKN3dWVqduf19lr4bMW5rQpXNWUXe8dGByd7UhZlWOboLNNYg6RhfxUl7lldNkTZiRdTzcq6bUE4UGhSiyJJlMuJyqdlJxOGECYjngbpaK5g6pV"
              />
            </div>
            <div className={`${styles.galleryItem} ${styles.offsetGalleryItem} ${styles.revealElement}`}>
              <img
                alt="Heart shaped arrangement of red roses in a luxury box"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFVYpzHs5udQRsz4nBvTA7hQbfQdDvjpFD7Cav1h3yuU8er9So0UE8_D_gMzVjJAH0O1c3g9_wKw9LMZTXt_NK6ZOrQjS0CUEELiqfM52tEJUmc-Tm-Imb1P_yDEuX_hvRCnokSRK8ozVv-5Yc15LksVd9tKqs1SqA_URX4pDD1-iLpL25NR3f7O3CNczAS5yAT204l1o-51624_bxYR0jt5Lavo1LMG6COrEbuppP10c5ss4H2YeGYwUq3g_Hw6odxB1S4cZ1C7EU"
              />
            </div>
            <div className={`${styles.galleryItem} ${styles.revealElement}`}>
              <img
                alt="Atelier workshop interior view"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZThbvygTjabsKocnwZGwnqS2SZpJzO-K6DfaEJtdGqQWVuAs0Lr7_DUre3CG75Zv2Q4By2PGfVAstw4zHgL7npxLNEPQI8zufV-UrxoAZkCz_4vSsfW9K_ZVTp9ro9wwCO1OBn61vHpSPjClAP-UHdwEVG4p3xUKpwcNX4mpl-0Pu8_Li1kRo-_fpITW4hgj_V-7V16uawjUAIeAHN5OGUWJNtIo343jUcjKKmrivT9hYN5XNO2WyBEH66rNf0bxcccGjHc9HEgpp"
              />
            </div>
            <div className={`${styles.galleryItem} ${styles.offsetGalleryItem} ${styles.revealElement}`}>
              <img
                alt="Dew on deep burgundy orchid petals close up"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXMlciUtP0o8E1nq8Upw9g_Kduomu3ERe4SOAvxQ3_bVH5pjXO6IwzknPhgH6T4meGJiHTOCHs-LpNW41qiDnpRXyF0rEC3E6aRQlD6ClmoS_f_L4NPWlKoL7hZAMKhGUERCqz_0YqvxqaVj5YqP5dpmJQkuz1CqR9X3ZPWp-o2Bg0zt3XUfZ04xkCZ5QSaD14dWNi2Rc2Q2bDoGCLpcOJbudR9OXbV8J-SF6S63bh-gd4Qh7XRjAAJQqEjFrr-LNy0mUiAhaR_Qwj"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactGrid}>
          <div className={styles.revealElement}>
            <h2 className={styles.contactInfoTitle}>
              Get in <span className={styles.italicPrimary}>Touch</span>
            </h2>
            <p className={styles.contactInfoDesc}>
              Reach out, and let's create a universe of possibilities together! Whether for a bespoke wedding or a simple gesture of love.
            </p>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <span className={`${styles.contactItemIcon} material-symbols-outlined`}>location_on</span>
                <div>
                  <p className={styles.contactItemLabel}>OUR ATELIER</p>
                  <p className={styles.contactItemValue}>01-019, Jalan besar, Singapore 208786</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={`${styles.contactItemIcon} material-symbols-outlined`}>call</span>
                <div>
                  <p className={styles.contactItemLabel}>CALL US</p>
                  <p className={styles.contactItemValue}>+65 8814 4043</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={`${styles.contactItemIcon} material-symbols-outlined`}>mail</span>
                <div>
                  <p className={styles.contactItemLabel}>EMAIL</p>
                  <p className={styles.contactItemValue}>info@dazzlingsky.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.formContainer} ${styles.revealElement}`}>
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
                SEND TO THE ATELIER
              </button>
            </form>
          </div>
        </div>
        <div className={styles.glowCircle} />
      </section>

      {/* Footer Component */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <div className={styles.footerBrand}>Dazzling Sky</div>
            <div className={styles.footerSocials}>
              <a className={`${styles.footerSocialIcon} material-symbols-outlined`} href="#">public</a>
              <a className={`${styles.footerSocialIcon} material-symbols-outlined`} href="#">share</a>
              <a className={`${styles.footerSocialIcon} material-symbols-outlined`} href="#">alternate_email</a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColLabel}>Categories</span>
            <a className={styles.footerLink} href="#">About Us</a>
            <a className={styles.footerLink} href="#">Shop</a>
            <a className={styles.footerLink} href="#">Contact</a>
            <a className={styles.footerLink} href="#">Blog</a>
            <a className={styles.footerLink} href="#">FAQ</a>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColLabel}>Support</span>
            <a className={styles.footerLink} href="#">Terms &amp; Condition</a>
            <a className={styles.footerLink} href="#">Privacy Policy</a>
            <a className={styles.footerLink} href="#">24/7 Chat</a>
            <a className={styles.footerLink} href="#">Wishlist</a>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColLabel}>Contact</span>
            <p className={styles.footerText}>+65 8814 4043</p>
            <p className={styles.footerText}>info@dazzlingsky.com</p>
            <p className={styles.footerText}>01-019, Jalan besar, Singapore 208786</p>
            <p className={styles.footerText}>9:00 - 7:00</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>Dazzling Sky © Copyright 2024. All rights reserved.</p>
          <div className={styles.footerCredits}>
            <span className={styles.footerCreditLabel}>Crafted for Perfection</span>
            <span className={styles.footerCreditLabel}>Botanical Noir Atelier</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a className={styles.whatsappFloat} href="#" aria-label="Contact via WhatsApp">
        <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.001 0-3.96-.507-5.7-1.467l-6.305 1.685zm6.3-2.335l.453.271c1.411.84 3.063 1.285 4.751 1.285 5.176 0 9.391-4.217 9.391-9.391 0-2.507-.975-4.865-2.748-6.637-1.773-1.773-4.13-2.748-6.637-2.748-5.176 0-9.391 4.217-9.391 9.391 0 1.83.533 3.614 1.542 5.158l.297.452-.997 3.645 3.735-.985zm11.367-12.374c-.301-.15-1.781-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775 1.05-.95 1.25-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.491-.892-.796-1.494-1.78-1.669-2.079-.175-.3-.019-.463.131-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.588-.491-.508-.675-.518-.174-.01-.374-.012-.574-.012-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.125 4.529.716.309 1.275.494 1.71.633.721.229 1.375.197 1.892.12.575-.085 1.781-.728 2.031-1.428.25-.7.25-1.3.175-1.428-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>
    </div>
  );
}
