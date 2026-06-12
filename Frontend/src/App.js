import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import FAQ from './pages/faq/Faq';
import Footer from './components/Footer';
import About from './pages/about/About';
import Shop from './pages/shop/Shop';
import ProductDetails from './pages/shop/ProductDetails';
import Blog from './pages/blog/Blog';
import BlogDetails from './pages/blog/BlogDetails';
import './App.css';

function App() {
  const [selectedFlower, setSelectedFlower] = useState(null);

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
    </Router>
  );
}

export default App;
