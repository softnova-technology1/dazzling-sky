import React from 'react';
import styles from './Privacy.module.css';

const Privacy = () => {
  return (
    <div className={styles.privacyContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Privacy Policy</h1>
        <p className={styles.heroSubtitle}>
          Dazzling Sky (“we,” “our,” or “us”) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
        </p>
      </div>

      <div className={styles.privacyContent}>
        {/* Section 1 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>1</span>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
          </div>
          <div className={styles.sectionBody}>
            <h3 className={styles.subsectionTitle}>Personal Information</h3>
            <p>When you contact us through forms or email, we may collect:</p>
            <ul>
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Service-related enquiry details</li>
            </ul>

            <h3 className={styles.subsectionTitle}>Non-Personal Information</h3>
            <p>We may collect basic technical data such as:</p>
            <ul>
              <li>Browser type</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited</li>
            </ul>
            <p>This data is used only for website performance and security purposes.</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>2</span>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
          </div>
          <div className={styles.sectionBody}>
            <ul>
              <li>Respond to enquiries and service requests</li>
              <li>Provide garden maintenance and landscaping consultations</li>
              <li>Improve our services and website experience</li>
              <li>Communicate important updates related to our services</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>3</span>
            <h2 className={styles.sectionTitle}>Cookies</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              Our website may use basic cookies to enhance user experience and monitor website traffic. You can disable cookies in your browser settings at any time.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>4</span>
            <h2 className={styles.sectionTitle}>Data Security</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, misuse, or disclosure. However, no online platform can guarantee 100% security.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>5</span>
            <h2 className={styles.sectionTitle}>Third-Party Links</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              Our website may contain links to third-party websites. Dazzling Sky is not responsible for the privacy practices or content of those external sites.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>6</span>
            <h2 className={styles.sectionTitle}>Children’s Privacy</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              Our services are not directed toward children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>7</span>
            <h2 className={styles.sectionTitle}>Changes to This Privacy Policy</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              Dazzling Sky reserves the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div className={styles.privacySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>8</span>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>
              If you have any questions about this Privacy Policy or how we handle your information, please contact us at info@dazzlingsky.sg or through our contact page.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Privacy;
