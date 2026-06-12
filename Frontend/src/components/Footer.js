import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '../images/logo-black.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="premium-footer">
      {/* Background Glowing Orb */}
      <div className="footer-orb"></div>

      <div className="footer-container">
        <div className="footer-top-grid">
          
          {/* Brand & Socials Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src={logoImage} alt="Dazzling Sky" className="footer-logo-img" />
            </div>
            <div className="footer-socials">
              <a href="#" className="social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-icon"><Mail size={18} /></a>
              <a href="#" className="social-icon"><Phone size={18} /></a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="footer-links-col">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/contacts">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-links-col">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-list">
              <li><Link to="/terms">Terms & Condition</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/chat">24/7 Chat</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="footer-links-col contact-col">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-list">
              <li>+65 8814 4043</li>
              <li>info@dazzlingsky.sg</li>
              <li className="address-line">01-019, Jalan besar<br/>singapore 208785</li>
              <li>9:00 - 7:00</li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>Dazzling Sky &copy; Copyright 2026. All rights reserved. <span>Designed by Softnova Tech</span></p>
        </div>
      </div>

      {/* Massive Background Text for Luxury Aesthetic */}
      <div className="footer-massive-text">
        DAZZLING SKY
      </div>
    </footer>
  );
};

export default Footer;
