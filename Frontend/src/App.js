import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import About from './pages/about/About';
import Shop from './pages/shop/Shop';
import ProductDetails from './pages/shop/ProductDetails';
import Cart from './pages/cart/Cart';
import Shipping from './pages/shipping/Shipping';
import Payment from './pages/payment/Payment';
import OrderConfirmed from './pages/order-confirmed/OrderConfirmed';
import Wishlist from './pages/wishlist/Wishlist';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* Main Content Area */}
        <main style={{ marginTop: '86px', padding: '20px', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<h1>Welcome to Dazzling Sky</h1>} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/blog" element={<h1>Our Blog</h1>} />
            <Route path="/faq" element={<h1>FAQ</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
