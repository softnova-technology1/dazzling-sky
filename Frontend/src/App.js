import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Navbar from './components/Navbar';
import Contact from './pages/contact/Contact';
import FAQ from './pages/faq/Faq';
import Footer from './components/Footer';
import About from './pages/about/About';
import Shop from './pages/shop/Shop';
import ProductDetails from './pages/shop/ProductDetails';
import Home from './pages/home/Home';
import logoImage from './images/logo-black.png';
import Cart from './pages/cart/Cart';
import Shipping from './pages/shipping/Shipping';
import Payment from './pages/payment/Payment';
import OrderConfirmed from './pages/order-confirmed/OrderConfirmed';
import Wishlist from './pages/wishlist/Wishlist';
import Blog from './pages/blog/Blog';
import BlogDetails from './pages/blog/BlogDetails';
import './App.css';

function MainLayout() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      {isHomepage ? (
        <>
          <header className="homepage-header">
            <Link to="/" className="homepage-header-logo" onClick={(e) => { e.preventDefault(); setIsOffcanvasOpen(true); }}>
              <img src={logoImage} alt="Dazzling Sky Logo" />
            </Link>
            <Link to="/cart" className="homepage-header-cart" aria-label="Cart">
              <ShoppingCart size={24} strokeWidth={1.5} />
            </Link>
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
                  <span className="link-num">04</span> Blog
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
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/blog" element={
            selectedFlower ? (
              <BlogDetails 
                flower={selectedFlower} 
                onBack={() => setSelectedFlower(null)} 
                onSelectFlower={(flower) => setSelectedFlower(flower)}
              />
            ) : (
              <Blog onReadMore={(flower) => setSelectedFlower(flower)} />
            )
          } />
          <Route path="/faq" element={<FAQ />} />
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
