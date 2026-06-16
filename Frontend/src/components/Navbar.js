import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import logoImage from '../images/logo-black.png';
import AuthPopup from './AuthPopup';
import './Navbar.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
      const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(cartTotal);

      const wishlist = JSON.parse(localStorage.getItem('dazzling_sky_wishlist') || '[]');
      setWishlistCount(wishlist.length);
      
      const customerData = localStorage.getItem('customerData');
      if (customerData) {
        setUser(JSON.parse(customerData));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Error loading counts in Navbar', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    localStorage.removeItem('dazzling_sky_cart');
    setUser(null);
    window.dispatchEvent(new Event('cart_updated'));
  };

  useEffect(() => {
    updateCounts();

    window.addEventListener('cart_updated', updateCounts);
    window.addEventListener('wishlist_updated', updateCounts);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('cart_updated', updateCounts);
      window.removeEventListener('wishlist_updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-content">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Left Side Navigation Links (Desktop) */}
          <div className="nav-links">
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/contacts" className="nav-link">Contacts</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/faq" className="nav-link">Faq</Link>
          </div>

          {/* Center Logo */}
          <div className="nav-logo">
            <Link to="/">
              <img src={logoImage} alt="Dazzling Sky Logo" className="nav-logo-img" />
            </Link>
          </div>

          {/* Right Side Icons (Desktop) */}
          <div className="nav-icons">
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>Hi, {user.name.split(' ')[0]}</span>
                <button className="icon-btn" onClick={handleLogout} title="Log out" aria-label="Log out">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button className="icon-btn" onClick={() => setIsAuthPopupOpen(true)} aria-label="Profile">
                <User size={20} strokeWidth={1.5} />
              </button>
            )}

            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
          </div>

          {/* Mobile Right Icons (Cart only) */}
          <div className="mobile-nav-icons">
            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-brand">
            <img src={logoImage} alt="Dazzling Sky Logo" className="mobile-drawer-logo" />
            <span className="mobile-drawer-tagline">LUXURY FLORAL ATELIER</span>
          </div>
          
          <nav className="mobile-drawer-links">
            <Link to="/about" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-link-num">01</span> About Us
            </Link>
            <Link to="/shop" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-link-num">02</span> Shop Collections
            </Link>
            <Link to="/contacts" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-link-num">03</span> Contacts
            </Link>
            <Link to="/blog" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-link-num">04</span> Blog
            </Link>
            <Link to="/faq" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="mobile-link-num">05</span> FAQs
            </Link>
          </nav>

          <div className="mobile-drawer-footer">
            <div className="mobile-drawer-actions">
              <Link to="/wishlist" className="mobile-action-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart size={18} strokeWidth={1.5} /> Wishlist ({wishlistCount})
              </Link>
              <button 
                className="mobile-action-btn" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (user) handleLogout();
                  else setIsAuthPopupOpen(true);
                }}
              >
                {user ? <LogOut size={18} strokeWidth={1.5} /> : <User size={18} strokeWidth={1.5} />} 
                {user ? 'Log Out' : 'Profile'}
              </button>
            </div>
            <p className="mobile-footer-title">VISIT THE ATELIER</p>
            <p className="mobile-footer-text">01-019, Jalan besar, Singapore 208786</p>
          </div>
        </div>
      </div>
      
      {isAuthPopupOpen && (
        <AuthPopup 
          onClose={() => setIsAuthPopupOpen(false)} 
          onLoginSuccess={(userData) => {
            setUser(userData);
          }} 
        />
      )}
    </>
  );
};

export default Navbar;
