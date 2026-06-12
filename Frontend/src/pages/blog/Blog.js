import React, { useEffect, useRef } from 'react';
import { blogData as flowersData } from '../../data/Blogdata';
import styles from './blog.module.css';
import bgImage from '../../images/purple_flowers_bg.png';
import card1 from '../../images/card1.jpg';
import card2 from '../../images/card2.jpg';
import card3 from '../../images/card3.jpg';
import card4 from '../../images/card4.jpg';
import card5 from '../../images/card5.jpg';
import card6 from '../../images/card6.png';
import card7 from '../../images/card7.jpg';
import card8 from '../../images/card8.jpeg';
import card9 from '../../images/card9.jpeg';
import card10 from '../../images/card10.jpeg';
import card11 from '../../images/card11.jpg';
import card12 from '../../images/card12.jpeg';
import floatingBouquet from '../../images/floating_bouquet_ai.png';
import card13 from '../../images/card13.jpg';
import card14 from '../../images/card14.jpg';
import card15 from '../../images/card15.jpg';
import card16 from '../../images/card16.jpg';
import card17 from '../../images/card17.jpeg';
import card18 from '../../images/card18.jpeg';
import card19 from '../../images/card19.jpeg';
import card20 from '../../images/card20.jpg';
import card21 from '../../images/card21.jpg';
import card22 from '../../images/card22.jpg';
import card23 from '../../images/card23.jpg';
import card24 from '../../images/card24.jpg';
import card25 from '../../images/card25.jpg';
import card26 from '../../images/card26.jpg';

export const getCardImage = (id) => {
  switch (id) {
    case 1: return card1;
    case 2: return card2;
    case 3: return card3;
    case 4: return card4;
    case 5: return card5;
    case 6: return card6;
    case 7: return card7;
    case 8: return card8;
    case 9: return card9;
    case 10: return card10;
    case 11: return card11;
    case 12: return card12;
    case 13: return card13;
    case 14: return card14;
    case 15: return card15;
    case 16: return card16;
    case 17: return card17;
    case 18: return card18;
    case 19: return card19;
    case 20: return card20;
    case 21: return card21;
    case 22: return card22;
    case 23: return card23;
    case 24: return card24;
    case 25: return card25;
    case 26: return card26;
    default: return bgImage;
  }
};
export { flowersData };



const Blog = ({ onReadMore }) => {
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  };

  useEffect(() => {
    // Adding Google Fonts
    if (!document.getElementById('google-fonts-blog')) {
      const link = document.createElement('link');
      link.id = 'google-fonts-blog';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <>
      <div className={styles.heroContainer} onMouseMove={handleMouseMove}>
        {/* Background Aurora Effect */}
        <div className={styles.blur1}></div>
        <div className={styles.blur2}></div>

        {/* Separated Image for Parallax and Bloom */}
        <div
          ref={imageRef}
          className={styles.heroImage}
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        <div className={styles.overlay}></div>

     
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f1}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f2}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f3}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f4}`} alt="Floating Bouquet" />
        <img src={floatingBouquet} className={`${styles.flower} ${styles.f5}`} alt="Floating Bouquet" />

        <div className={styles.contentWrapper}>
          <h1 className={`${styles.headline} ${styles.heroTitle}`}>
            Make Your Home as
            <span className={styles.italicHighlight}> Comfortable</span> as Possible
          </h1>

          <div className={styles.descriptionBlock}>
            <p className={styles.description}>
              Make your home as comfortable as possible with the natural charm of fresh flowers.
              Add comfort and elegance to your home with beautifully crafted fresh flower bouquets
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIcon}>↓</div>
        </div>
      </div>

      <div className={styles.neonGridSection}>
        {flowersData.map(flower => (
          <div className={styles.neonCardWrapper} key={flower.id}>
            <div className={styles.neonCard}>

              {/* Layer 1: Left Image Area (SVG will mask the right side) */}
              <div className={styles.imageArea} style={{ backgroundImage: `url(${getCardImage(flower.id)})` }}>
              </div>


              {/* Layer 2: Master SVG Overlay */}
              <svg className={styles.masterSvg} viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <filter id={`neon-glow-${flower.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Right Panel Dark Background (Also serves as the perfect edge for the left image) */}
                <path
                  d="M 460,0 L 960,0 A 40,40 0 0 1 1000,40 L 1000,960 A 40,40 0 0 1 960,1000 L 460,1000 C 380,750 380,650 460,500 C 540,350 540,150 460,0 Z"
                  fill="#050208"
                />

                {/* Glowing Borders (Single perfectly merged center line) */}
                <g filter={`url(#neon-glow-${flower.id})`} className={styles.neonGlowGroup}>
                  <path
                    d="M 40,0 L 460,0 C 540,150 540,350 460,500 C 380,650 380,750 460,1000 L 40,1000 A 40,40 0 0 1 0,960 L 0,40 A 40,40 0 0 1 40,0 Z"
                    fill="none" stroke="#ff8ad8" strokeWidth="6"
                  />
                  <path
                    d="M 460,0 L 960,0 A 40,40 0 0 1 1000,40 L 1000,960 A 40,40 0 0 1 960,1000 L 460,1000 C 380,750 380,650 460,500 C 540,350 540,150 460,0 Z"
                    fill="none" stroke="#ff8ad8" strokeWidth="6"
                  />
                </g>

                {/* White Core Lines */}
                <g className={styles.neonCoreGroup}>
                  <path
                    d="M 40,0 L 460,0 C 540,150 540,350 460,500 C 380,650 380,750 460,1000 L 40,1000 A 40,40 0 0 1 0,960 L 0,40 A 40,40 0 0 1 40,0 Z"
                    fill="none" stroke="#fff" strokeWidth="1.5"
                  />
                  <path
                    d="M 460,0 L 960,0 A 40,40 0 0 1 1000,40 L 1000,960 A 40,40 0 0 1 960,1000 L 460,1000 C 380,750 380,650 460,500 C 540,350 540,150 460,0 Z"
                    fill="none" stroke="#fff" strokeWidth="1.5"
                  />
                </g>
              </svg>

              {/* Layer 3: Central Gap Flares */}
              <div className={`${styles.flare} ${styles.flareTop}`}></div>
              <div className={`${styles.flare} ${styles.flareBottom}`}></div>

              {/* Layer 4: HTML Content (Right Panel) */}
              <div className={styles.rightHtmlContent}>

                <div className={styles.topTextSection}>
                  <div className={styles.topBadgeWrapper}>
                    <div className={styles.topBadge}>
                      <span className={styles.badgeIcon}>❀</span>
                      <span>FLOWER CARE</span>
                    </div>
                    <div className={`${styles.flare} ${styles.flareBadge}`}></div>
                  </div>

                  <div className={styles.cardTitle}>
                    <div className={styles.titleLight}>The Art of</div>
                    <div className={styles.titleGradient}>
                      {(() => {
                        const match = flower.title.match(/^([A-Za-z\s’'/]+)(.*)$/);
                        if (match && match[2].trim()) {
                          return (
                            <>
                              <span className={styles.mainTitle}>{match[1].trim()}</span>
                              <span className={styles.subTitle}>{match[2].trim()}</span>
                            </>
                          );
                        }
                        return <span className={styles.mainTitle}>{flower.title}</span>;
                      })()}
                    </div>
                  </div>

                  <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerIcon}>✾</div>
                    <div className={styles.dividerLine}></div>
                  </div>

                  <p className={styles.cardDesc}>{flower.desc}</p>
                </div>

                <div className={styles.bottomTextSection}>
                  <button className={styles.readMoreBtn} onClick={() => onReadMore && onReadMore(flower)}>
                    Read More <span>→</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Blog;
