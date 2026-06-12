import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Contact.module.css';
import darkBouquet from '../../images/dark_floral_bouquet.png';
import floralDecor from '../../images/dark_floral_decor.png';

const Contact = () => {
  return (
    <div className={styles['contact-page']}>
      {/* Light Editorial Contact Hero */}
      <section className={styles['editorial-contact-hero']}>
        <div className={styles['editorial-hero-container']}>
          
          {/* Left Side: Typography */}
          <div className={styles['editorial-content-side']}>
            <div className={styles['title-group']}>
              <h1 className={styles['editorial-title']}>
                CONTACT US
              </h1>
              <span className={styles['editorial-subtitle']}>we'd love to hear from you</span>
            </div>
            
            <p className={styles['editorial-description']}>
              Have a question about our flowers or a custom order? Reach out to us below and our floral artisans will be delighted to assist you.
            </p>
            
            <div className={styles['editorial-details']}>
              <p>+65 85512 8540</p>
              <p>info@dazzlingsky.sg</p>
            </div>
            
            <div className={styles['editorial-socials']}>
              <a href="#" className={styles['social-icon-btn']}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className={styles['social-icon-btn']}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className={styles['social-icon-btn']}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
            
            <a href="/" className={styles['editorial-website']}>www.dazzlingsky.sg</a>
          </div>

          {/* Right Side: Circular Image */}
          <div className={styles['editorial-image-wrapper']}>
            <div className={styles['editorial-image-mask']}>
              <img src={darkBouquet} alt="Floral Bouquet" />
            </div>
            {/* Generated decorative floral elements blending via CSS screen */}
            <img src={floralDecor} className={styles['generated-floral-decor']} alt="Floral Decor" />
          </div>

        </div>
      </section>

      {/* Floating Glass & Glowing Orbs Section */}
      <section className={styles['premium-orb-section']}>
        
        {/* Background Glowing Orbs */}
        <div className={`${styles['orb']} ${styles['orb-1']}`}></div>
        <div className={`${styles['orb']} ${styles['orb-2']}`}></div>
        
        <div className={styles['premium-glass-container']}>
          
          {/* Left Side: Info */}
          <div className={styles['glass-info-side']}>
            <h2 className={styles['glass-title']}>Get in Touch</h2>
            <p className={styles['glass-subtitle']}>We would love to hear from you. Our team is always ready to bring your floral visions to life.</p>
            
            <div className={styles['glass-info-list']}>
              <div className={styles['glass-info-item']}>
                <div className={styles['icon-badge']}>
                  <Mail size={18} />
                </div>
                <div className={styles['info-text']}>
                  <span>Email Us</span>
                  <p>info@dazzlingsky.sg</p>
                </div>
              </div>
              
              <div className={styles['glass-info-item']}>
                <div className={styles['icon-badge']}>
                  <Phone size={18} />
                </div>
                <div className={styles['info-text']}>
                  <span>Call Us</span>
                  <p>+65 85512 8540</p>
                </div>
              </div>
              
              <div className={styles['glass-info-item']}>
                <div className={styles['icon-badge']}>
                  <MapPin size={18} />
                </div>
                <div className={styles['info-text']}>
                  <span>Visit Us</span>
                  <p>Orchard Road, ION Orchard<br/>Level 4, Singapore 238801</p>
                </div>
              </div>
            </div>

            {/* <div className={styles['glass-socials']}>
              <span className={styles['social-label']}>Follow Us</span>
              <div className={styles['social-pill-group']}>
                <a href="#" className={styles['social-pill']}>FB</a>
                <a href="#" className={styles['social-pill']}>IG</a>
                <a href="#" className={styles['social-pill']}>YT</a>
              </div>
            </div> */}
          </div>

          {/* Vertical Divider */}
          <div className={styles['glass-divider']}></div>

          {/* Right Side: Sleek Form */}
          <div className={styles['glass-form-side']}>
            <form className={styles['glass-form']} onSubmit={(e) => e.preventDefault()}>
              <div className={styles['glass-input-row']}>
                <div className={styles['glass-input-group']}>
                  <label>First Name</label>
                  <input type="text" placeholder="John" required />
                </div>
                <div className={styles['glass-input-group']}>
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" required />
                </div>
              </div>
              
              <div className={styles['glass-input-group']}>
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              
              <div className={styles['glass-input-group']}>
                <label>Message</label>
                <textarea placeholder="Tell us how we can help..." rows="4" required></textarea>
              </div>

              <button type="submit" className={styles['glass-submit-btn']}>
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Full-Width Map Section */}
      <section className={styles['map-section']}>
        <iframe
          title="Dazzling Sky Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7906185859187!2d103.82956271533036!3d1.303603499066601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1994e01dfdbf%3A0xc3b86940d9b1db14!2sION%20Orchard!5e0!3m2!1sen!2ssg!4v1689255013083!5m2!1sen!2ssg"
          width="100%"
          height="450"
          style={{ border: 0, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
