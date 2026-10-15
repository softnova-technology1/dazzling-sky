import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import logoImage from './images/logo-black.png';
import './App.css';

// Lazy-loaded routes for optimal initial bundle size and near-instant page transitions
const Shop = lazy(() => import('./pages/shop/Shop'));
const ProductDetails = lazy(() => import('./pages/shop/ProductDetails'));
const About = lazy(() => import('./pages/about/About'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const FAQ = lazy(() => import('./pages/faq/Faq'));
const Cart = lazy(() => import('./pages/cart/Cart'));
const Wishlist = lazy(() => import('./pages/wishlist/Wishlist'));
const Shipping = lazy(() => import('./pages/shipping/Shipping'));
const Payment = lazy(() => import('./pages/payment/Payment'));
const OrderConfirmed = lazy(() => import('./pages/order-confirmed/OrderConfirmed'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const BlogDetails = lazy(() => import('./pages/blog/BlogDetails'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Terms = lazy(() => import('./pages/terms/Terms'));
const Privacy = lazy(() => import('./pages/privacy/Privacy'));

const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: 'transparent'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      border: '2px solid rgba(192, 132, 252, 0.2)',
      borderTopColor: '#c084fc',
      borderRadius: '50%',
      animation: 'dsSpin 0.75s linear infinite'
    }} />
    <span style={{ color: '#a89bbd', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
      Loading Atelier...
    </span>
    <style>{`@keyframes dsSpin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Atelier Render Error Boundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070709',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 138, 216, 0.1)',
            border: '1px solid rgba(255, 138, 216, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: '#ff8ad8'
          }}>
            ✦
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#ff8ad8' }}>
            Atelier Command Recovered
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '13px', maxWidth: '420px', marginBottom: '20px', lineHeight: '1.5' }}>
            A temporary display sync occurred. Click below to refresh your session.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #883c8a 0%, #ff8ad8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Reload Atelier
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Shipping />} />
            <Route path="/shipping" element={<Shipping />} />
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
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Suspense>
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
