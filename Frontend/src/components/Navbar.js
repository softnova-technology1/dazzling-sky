import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, ShoppingCart } from 'lucide-react';
import logoImage from '../images/logo-black.png';
import './Navbar.css';

const Navbar = () => {
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
          <button className="icon-btn" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
          </button>
          <button className="icon-btn" aria-label="Profile">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="icon-btn" aria-label="Cart">
            <ShoppingCart size={20} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
