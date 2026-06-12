import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, ShoppingCart } from 'lucide-react';
import logoImage from '../images/logo-black.png';
import './Navbar.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('dazzling_sky_cart') || '[]');
      const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(cartTotal);

      const wishlist = JSON.parse(localStorage.getItem('dazzling_sky_wishlist') || '[]');
      setWishlistCount(wishlist.length);
    } catch (e) {
      console.error('Error loading counts in Navbar', e);
    }
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
    <nav className="navbar-container">
      <div className="navbar-content">
        
        {/* Left Side Navigation Links */}
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

        {/* Right Side Icons */}
        <div className="nav-icons">
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <button className="icon-btn" aria-label="Profile">
            <User size={20} strokeWidth={1.5} />
          </button>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
