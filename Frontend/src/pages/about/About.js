import React, { useState, useEffect } from 'react';
import styles from './about.module.css';

const About = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized coordinates from -0.5 to 0.5 relative to center
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      
      {/* SECTION 1: HERO SECTION */}
      <section className={styles.heroSection}>
        {/* Background massive decorative texts with parallax shift */}
        <div 
          className={styles.bgTextTop}
          style={{ transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0) translateX(-50%)` }}
        >
          DAZZLING SKY
        </div>
        <div 
          className={styles.bgTextBottom}
          style={{ transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0) translateX(-50%)` }}
        >
          DESIGN
        </div>

        {/* Floating corner flower elements with parallax drift */}
        <div 
          className={styles.flowerTopRightWrapper} 
          style={{ transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0)` }}
        >
          <img 
            src="/pink_peonies_top_right.png" 
            alt="Decorative top right pink peonies" 
            className={styles.flowerTopRight} 
          />
        </div>
        <div 
          className={styles.flowerBottomLeftWrapper} 
          style={{ transform: `translate3d(${mousePos.x * -60}px, ${mousePos.y * -60}px, 0)` }}
        >
          <img 
            src="/pink_peonies_bottom_left.png" 
            alt="Decorative bottom left pink peonies" 
            className={styles.flowerBottomLeft} 
          />
        </div>

        {/* Main Glassmorphism Hero Card */}
        <div className={styles.heroCard}>
          {/* Left Column: Text and CTA Content */}
          <div className={styles.contentColumn}>
            <div className={styles.subtitle}>
              <span className={styles.dot}>•</span> FLOWER CLUB <span className={styles.dot}>•</span> 
              <span className={styles.separator}>|</span> ONLINE FLOWER BOUTIQUE
            </div>
            
            <h1 className={styles.title}>
              Make Your Home as<br />Comfortable as Possible
            </h1>
            
            <div className={styles.description}>
              <p>Make your home as comfortable as possible with the natural charm of fresh flowers.</p>
              <p>Add comfort and elegance to your home with beautifully crafted fresh flower bouquets.</p>
            </div>
            
            <button className={styles.shopButton}>
              Shop <span className={styles.arrow}>→</span>
            </button>
          </div>

          {/* Right Column: Peonies Showcase Image */}
          <div className={styles.imageColumn}>
            <img 
              src="/pink_peonies_main.png" 
              alt="Beautiful bouquet of pink peonies" 
              className={styles.mainImage}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR STORY & PHILOSOPHY */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          
          {/* Left Column: Boutique Showcase Image */}
          <div className={styles.storyImageWrapper}>
            <img 
              src="/flower_boutique_interior.png" 
              alt="Dazzling Sky Flower Boutique interior" 
              className={styles.storyImage}
            />
          </div>

          {/* Right Column: Narrative content & signature */}
          <div className={styles.storyContent}>
            <h2 className={styles.storyTitle}>Our Story & Philosophy</h2>
            <div className={styles.storyDivider}></div>
            
            <div className={styles.storyText}>
              <p>
                At Dazzling Sky, we believe in the power of nature to transform spaces and uplift spirits. 
                Our philosophy centers on bringing the freshest, most vibrant flowers from garden to home, 
                ensuring every bouquet tells a unique story of beauty and craftsmanship.
              </p>
              <p>
                We are dedicated to sustainable practices, ethical sourcing, and creating timeless 
                floral arrangements that not only adorn your space but also reflect your personal style 
                and create lasting memories.
              </p>
            </div>

            
          </div>

        </div>
      </section>

      {/* SECTION 3: EXPLORE OUR FLORAL WORLD */}
      <section className={styles.exploreSection}>
        <div className={styles.exploreHeader}>
          <div className={styles.exploreSubtitle}>Dazzling Sky Selections</div>
          <h2 className={styles.exploreTitle}>Explore Our Floral World</h2>
          <div className={styles.exploreDivider}></div>
        </div>

        <div className={styles.exploreGrid}>
          {/* Card 1: Collections */}
          <div className={styles.exploreCard}>
            <div className={styles.cardImageWrapper}>
              <img 
                src="/floral_collections.png" 
                alt="Exquisite range of flower collections" 
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Flower Collections</h3>
              <p className={styles.cardDesc}>
                Discover our exquisite range of handcrafted bouquets, 
                designed for every mood, moment, and occasion.
              </p>
              <button className={styles.cardBtn}>
                View Collections <span className={styles.btnArrow}>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Inspirations */}
          <div className={styles.exploreCard}>
            <div className={styles.cardImageWrapper}>
              <img 
                src="/floral_inspirations.png" 
                alt="Fresh floral ideas and inspirations blog" 
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Floral Inspirations</h3>
              <p className={styles.cardDesc}>
                Dive into our blog for fresh floral ideas, styling tips, 
                bouquet inspiration, trends, and expert flower care guidance.
              </p>
              <button className={styles.cardBtn}>
                Read Our Blog <span className={styles.btnArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
