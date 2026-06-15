import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Shield, Truck, Headphones, Leaf, Gift, Star } from 'lucide-react';
import styles from './about.module.css';
import darkFloralPattern from '../../images/dark_floral_pattern.png';

const About = () => {
  const navigate = useNavigate();
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
        {/* Layer 1: Fixed background image (no filter — required for fixed attachment to work) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/flower_shop_exterior.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            zIndex: 0,
          }}
        />
        {/* Layer 2: Blur overlay using backdrop-filter */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 1,
          }}
        />
        {/* Layer 3: Black overlay for darkness */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.60)',
            zIndex: 2,
          }}
        />
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
            
            <button className={styles.shopButton} onClick={() => navigate('/shop')}>
              Shop <span className={styles.arrow}>→</span>
            </button>
          </div>

          {/* Right Column: Peonies Showcase Image */}
          <div className={styles.imageColumn}>
            <img 
              src="/purple_pink_bouquet_main.png" 
              alt="Beautiful custom purple and pink flower bouquet" 
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
              src="/int.png" 
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
          {/* Panel 1: Collections */}
          <div className={styles.exploreCard} onClick={() => navigate('/shop')}>
            <img 
              src="/floral_collections.png" 
              alt="Exquisite range of flower collections" 
              className={styles.cardBgImage}
            />
            <div className={styles.cardOverlay}></div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Flower Collections</h3>
              <p className={styles.cardDesc}>
                Discover our exquisite range of handcrafted bouquets, 
                designed for every mood, moment, and occasion.
              </p>
              <button className={styles.cardBtn} onClick={(e) => { e.stopPropagation(); navigate('/shop'); }}>
                View Collections <span className={styles.btnArrow}>→</span>
              </button>
            </div>
          </div>

          {/* Panel 2: Inspirations */}
          <div className={styles.exploreCard} onClick={() => navigate('/blog')}>
            <img 
              src="/floral_inspirations.png" 
              alt="Fresh floral ideas and inspirations blog" 
              className={styles.cardBgImage}
            />
            <div className={styles.cardOverlay}></div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Floral Inspirations</h3>
              <p className={styles.cardDesc}>
                Dive into our blog for fresh floral ideas, styling tips, 
                bouquet inspiration, trends, and expert flower care guidance.
              </p>
              <button className={styles.cardBtn} onClick={(e) => { e.stopPropagation(); navigate('/blog'); }}>
                Read Our Blog <span className={styles.btnArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE DAZZLING SKY */}
      <section className={styles.chooseSection}>
        {/* Glow Effects */}
        <div className={styles.chooseGlows}>
          <div className={styles.chooseGlowLeft}></div>
          <div className={styles.chooseGlowRight}></div>
        </div>

        <div className={styles.chooseHeader}>
          <div className={styles.chooseSubtitle}>Our Commitment</div>
          <h2 className={styles.chooseTitle}>Why Choose Dazzling Sky?</h2>
          <div className={styles.chooseDivider}></div>
        </div>

        <div className={styles.chooseGrid}>
          {/* Card 1: Safety Packing */}
          <div className={styles.chooseCard}>
            <div className={styles.chooseIconWrapper}>
              <Package size={28} className={styles.chooseIcon} />
            </div>
            <h3 className={styles.chooseCardTitle}>Safety Packing</h3>
            <p className={styles.chooseCardDesc}>
              Every bouquet is safely packed to protect freshness and deliver your flowers in perfect condition, ensuring they arrive just as vibrant as they left.
            </p>
            <div className={styles.cardHoverBorder}></div>
          </div>

          {/* Card 2: Original Product */}
          <div className={styles.chooseCard}>
            <div className={styles.chooseIconWrapper}>
              <Shield size={28} className={styles.chooseIcon} />
            </div>
            <h3 className={styles.chooseCardTitle}>Original Product</h3>
            <p className={styles.chooseCardDesc}>
              Original floral creations crafted with fresh blooms and pure artistry. We guarantee the authenticity and unique design of every single arrangement.
            </p>
            <div className={styles.cardHoverBorder}></div>
          </div>

          {/* Card 3: Free Shipping */}
          <div className={styles.chooseCard}>
            <div className={styles.chooseIconWrapper}>
              <Truck size={28} className={styles.chooseIcon} />
            </div>
            <h3 className={styles.chooseCardTitle}>Free Shipping</h3>
            <p className={styles.chooseCardDesc}>
              Enjoy free shipping on all fresh flower bouquets, delivered with care directly to your doorstep, making your experience effortless.
            </p>
            <div className={styles.cardHoverBorder}></div>
          </div>

          {/* Card 4: Support 24/7 */}
          <div className={styles.chooseCard}>
            <div className={styles.chooseIconWrapper}>
              <Headphones size={28} className={styles.chooseIcon} />
            </div>
            <h3 className={styles.chooseCardTitle}>Support 24/7</h3>
            <p className={styles.chooseCardDesc}>
              Enjoy 100% original products backed by friendly 24/7 customer support. Our dedicated team is always ready to assist you with any query.
            </p>
            <div className={styles.cardHoverBorder}></div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OUR CORE VALUES */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesHeader}>
          <div className={styles.valuesSubtitle}>Our Philosophy</div>
          <h2 className={styles.valuesTitle}>Our Core Values</h2>
          <div className={styles.valuesDivider}></div>
        </div>

        <div className={styles.editorialGrid}>
          {/* Item 1: Sustainable Sourcing */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>01</span>
              <div className={styles.itemIconWrapper}>
                <Leaf size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Sustainable Sourcing</h3>
            <p className={styles.itemDesc}>
              Committed to ethically sourcing the freshest flowers from trusted growers, ensuring beauty and environmental responsibility.
            </p>
          </div>

          {/* Item 2: Artisanal Craftsmanship */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>02</span>
              <div className={styles.itemIconWrapper}>
                <Gift size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Artisanal Craftsmanship</h3>
            <p className={styles.itemDesc}>
              Each bouquet is meticulously hand-crafted by skilled florists, blending creativity with timeless elegance for unique designs.
            </p>
          </div>

          {/* Item 3: Customer Delight */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>03</span>
              <div className={styles.itemIconWrapper}>
                <Star size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Customer Delight</h3>
            <p className={styles.itemDesc}>
              We prioritize your satisfaction, offering personalized service and ensuring every floral experience is exceptional and memorable.
            </p>
          </div>

          {/* Item 4: Guaranteed Freshness */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>04</span>
              <div className={styles.itemIconWrapper}>
                <Shield size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Guaranteed Freshness</h3>
            <p className={styles.itemDesc}>
              Our strict quality control ensures that every bloom arrives vibrant, fresh, and ready to bring joy to your space.
            </p>
          </div>

          {/* Item 5: Seamless Delivery */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>05</span>
              <div className={styles.itemIconWrapper}>
                <Truck size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Seamless Delivery</h3>
            <p className={styles.itemDesc}>
              Enjoy prompt and careful delivery, ensuring your beautiful arrangements arrive in perfect condition, every time.
            </p>
          </div>

          {/* Item 6: Dedicated Support */}
          <div className={styles.editorialItem}>
            <div className={styles.itemHeader}>
              <span className={styles.itemNum}>06</span>
              <div className={styles.itemIconWrapper}>
                <Headphones size={24} />
              </div>
            </div>
            <div className={styles.itemDivider}></div>
            <h3 className={styles.itemTitle}>Dedicated Support</h3>
            <p className={styles.itemDesc}>
              Our friendly team is always ready to assist you, providing expert advice and support for all your floral needs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT US CTA BANNER */}
      <section 
        className={styles.contactCtaSection}
        style={{ backgroundImage: `url(${darkFloralPattern})` }}
      >
        <div className={styles.contactCtaOverlay}></div>
        <div className={styles.contactCtaContent}>
          <h2 className={styles.contactCtaTitle}>Don't Hesitate to Contact Us</h2>
          <p className={styles.contactCtaDesc}>
            Don't hesitate to contact us—we're here to help. Send us your message, and our team will get back to you shortly.
          </p>
          <button 
            className={styles.contactCtaBtn} 
            onClick={() => navigate('/contacts')}
          >
            Contact Us <span className={styles.btnArrow}>→</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;
