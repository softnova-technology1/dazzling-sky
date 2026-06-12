import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import About from './pages/about/About';
import Shop from './pages/shop/Shop';
import ProductDetails from './pages/shop/ProductDetails';
import Home from './pages/home/Home';
import logoImage from './images/logo-black.png';
import './App.css';

function MainLayout() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  return (
    <div className="App">
      {isHomepage ? (
        <>
          <header className="homepage-header">
            <Link to="/" className="homepage-header-logo" onClick={(e) => { e.preventDefault(); setIsOffcanvasOpen(true); }}>
              <img src={logoImage} alt="Dazzling Sky Logo" />
            </Link>
            <button className="homepage-header-cart" aria-label="Cart">
              <ShoppingCart size={24} strokeWidth={1.5} />
            </button>
          </header>

          {/* Left Offcanvas Navigation Menu */}
          <div className={`offcanvas-overlay ${isOffcanvasOpen ? 'show' : ''}`} onClick={() => setIsOffcanvasOpen(false)} />
          <div className={`homepage-offcanvas ${isOffcanvasOpen ? 'open' : ''}`}>
            <button className="offcanvas-close-btn" onClick={() => setIsOffcanvasOpen(false)} aria-label="Close menu">
              &times;
            </button>
            <div className="offcanvas-content">
              <div className="offcanvas-brand">
                <img src={logoImage} alt="Dazzling Sky Logo" className="offcanvas-brand-logo" />
                <span className="offcanvas-tagline">LUXURY FLORAL ATELIER</span>
              </div>
              <nav className="offcanvas-nav">
                <Link to="/about" className="offcanvas-link" onClick={() => setIsOffcanvasOpen(false)}>
                  <span className="link-num">01</span> About Us
                </Link>
                <Link to="/shop" className="offcanvas-link" onClick={() => setIsOffcanvasOpen(false)}>
                  <span className="link-num">02</span> Shop Collections
                </Link>
                <Link to="/contacts" className="offcanvas-link" onClick={() => setIsOffcanvasOpen(false)}>
                  <span className="link-num">03</span> Contacts
                </Link>
                <Link to="/blog" className="offcanvas-link" onClick={() => setIsOffcanvasOpen(false)}>
                  <span className="link-num">04</span> Editorial Blog
                </Link>
                <Link to="/faq" className="offcanvas-link" onClick={() => setIsOffcanvasOpen(false)}>
                  <span className="link-num">05</span> FAQs
                </Link>
              </nav>
              <div className="offcanvas-footer">
                <p className="offcanvas-footer-title">VISIT THE ATELIER</p>
                <p className="offcanvas-footer-text">01-019, Jalan besar, Singapore 208786</p>
                <p className="offcanvas-footer-email">info@dazzlingsky.com</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Navbar />
      )}
      {/* Main Content Area: remove margin and padding for homepage to align hero correctly */}
      <main style={{ 
        marginTop: isHomepage ? '0' : '86px', 
        padding: isHomepage ? '0' : '20px', 
        textAlign: isHomepage ? 'left' : 'center' 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/blog" element={<h1>Our Blog</h1>} />
          <Route path="/faq" element={<h1>FAQ</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
