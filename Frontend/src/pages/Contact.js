import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* High-End Hero Section (Kept as requested) */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="premium-badge">PREMIUM FLORAL BOUTIQUE</div>
          <h1 className="gradient-text">Make Your Home as Comfortable as Possible</h1>
          <p className="hero-description">
            Curated with the natural charm of premium fresh flowers. Add unparalleled comfort and elegance to your living space with our beautifully crafted, artisanal bouquets.
          </p>
        </div>
      </section>

      {/* Floating Glass & Glowing Orbs Section */}
      <section className="premium-orb-section">
        
        {/* Background Glowing Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        
        <div className="premium-glass-container">
          
          {/* Left Side: Info */}
          <div className="glass-info-side">
            <h2 className="glass-title">Get in Touch</h2>
            <p className="glass-subtitle">We would love to hear from you. Our team is always ready to bring your floral visions to life.</p>
            
            <div className="glass-info-list">
              <div className="glass-info-item">
                <div className="icon-badge">
                  <Mail size={18} />
                </div>
                <div className="info-text">
                  <span>Email Us</span>
                  <p>info@dazzlingsky.sg</p>
                </div>
              </div>
              
              <div className="glass-info-item">
                <div className="icon-badge">
                  <Phone size={18} />
                </div>
                <div className="info-text">
                  <span>Call Us</span>
                  <p>+65 85512 8540</p>
                </div>
              </div>
              
              <div className="glass-info-item">
                <div className="icon-badge">
                  <MapPin size={18} />
                </div>
                <div className="info-text">
                  <span>Visit Us</span>
                  <p>Orchard Road, ION Orchard<br/>Level 4, Singapore 238801</p>
                </div>
              </div>
            </div>

            {/* <div className="glass-socials">
              <span className="social-label">Follow Us</span>
              <div className="social-pill-group">
                <a href="#" className="social-pill">FB</a>
                <a href="#" className="social-pill">IG</a>
                <a href="#" className="social-pill">YT</a>
              </div>
            </div> */}
          </div>

          {/* Vertical Divider */}
          <div className="glass-divider"></div>

          {/* Right Side: Sleek Form */}
          <div className="glass-form-side">
            <form className="glass-form" onSubmit={(e) => e.preventDefault()}>
              <div className="glass-input-row">
                <div className="glass-input-group">
                  <label>First Name</label>
                  <input type="text" placeholder="John" required />
                </div>
                <div className="glass-input-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="glass-input-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              
              <div className="glass-input-group">
                <label>Message</label>
                <textarea placeholder="Tell us how we can help..." rows="4" required></textarea>
              </div>

              <button type="submit" className="glass-submit-btn">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Full-Width Map Section */}
      <section className="map-section">
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
