import React, { useEffect, useRef } from 'react';
import styles from './BlogDetails.module.css';
import { flowersData, getCardImage } from './Blog';
import detailBg from '../../images/lavender_details.jpg';
import floatingBouquet from '../../images/floating_bouquet_ai.png';

const BlogDetails = ({ flower, onBack, onSelectFlower }) => {
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.detailsPage}>
      {/* Hero Section */}
      <div className={styles.heroContainer} onMouseMove={handleMouseMove}>
        {/* Background Aurora Effect */}
        <div className={styles.blur1}></div>
        <div className={styles.blur2}></div>

        {/* Separated Image for Parallax and Bloom */}
        <div 
          ref={imageRef} 
          className={styles.heroImage} 
          style={{ backgroundImage: `url(${detailBg})` }}
        ></div>

        <div className={styles.overlay}></div>

        {/* Floating Flowers Animation */}
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f1}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f2}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f3}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f4}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f5}`} alt="Floating Bouquet" />

        <div className={styles.contentWrapper}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back to Collection
          </button>

          <h1 className={`${styles.headline} ${styles.heroTitle}`}>
            Make Your Home as
            <span className={styles.italicHighlight}> Comfortable</span> as Possible
          </h1>

          <div className={styles.descriptionBlock}>
            <p className={styles.description}>
              Make your home as comfortable as possible with the natural charm of fresh flowers.
            </p>
            <p className={styles.description}>
              Add comfort and elegance to your home with beautifully crafted fresh flower bouquets.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIcon}>↓</div>
        </div>
      </div>

      {/* Detailed Body Section */}
      <div className={styles.contentGrid}>
        
        {/* Left Column: Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.flowerImageWrapper}>
            <img 
              src={getCardImage(flower.id)} 
              alt={flower.title} 
              className={styles.mainImage}
            />
          </div>
          
          <h2 className={styles.flowerTitle}>{flower.title}</h2>
          <p className={styles.flowerDesc}>{flower.desc}</p>
          
          <p className={styles.flowerPara}>
            {flower.maintain && flower.maintain[0]}
          </p>

          <div className={styles.quoteBox}>
            <p>
              {flower.note}
            </p>
          </div>

          <p className={styles.flowerPara}>
            {flower.origin}
          </p>

          <p className={styles.flowerPara}>
            {flower.symbolic && flower.symbolic[0]}
          </p>

          <h2 className={styles.sectionTitle}>Care Tips For {flower.title.split('(')[0].trim()}</h2>
          <p className={styles.flowerPara}>
            {flower.careContent}
          </p>
          <ul className={styles.careList}>
            {flower.CareTips && flower.CareTips.map((tip, index) => (
              <li key={index}>{tip.Tip}</li>
            ))}
          </ul>

          <h2 className={styles.sectionTitle}>Cultural Significance</h2>
          <p className={styles.flowerPara}>
            {flower.Culture}
          </p>
        </div>

        {/* Right Column: Sidebar */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Recent Post</h3>
          <div className={styles.recentPostsContainer}>
            <div className={styles.recentPostsList}>
              {[...flowersData.slice(15, 21), ...flowersData.slice(15, 21)].map((recentFlower, index) => (
                <div 
                  key={`${recentFlower.id}-${index}`} 
                  className={styles.recentPostItem}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    onSelectFlower(recentFlower);
                  }}
                >
                  <div 
                    className={styles.recentPostImage} 
                    style={{ backgroundImage: `url(${getCardImage(recentFlower.id)})` }}
                  ></div>
                  <div className={styles.recentPostInfo}>
                    <h4 className={styles.recentPostTitle}>{recentFlower.title}</h4>
                    <span className={styles.recentPostMeta}>- No Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetails;
