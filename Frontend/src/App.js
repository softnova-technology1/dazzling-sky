<<<<<<< HEAD
import React from 'react';
import About from './pages/about/About';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Footer from './components/Footer';
>>>>>>> b37389720d1a9a565b8eb5dc44628bcd8175e2c0
import './App.css';

function App() {
  return (
<<<<<<< HEAD
    <div className="App">
      <About />
    </div>
=======
    <Router>
      <div className="App">
        <Navbar />
        {/* Main Content Area */}
        <main style={{ marginTop: '160px', padding: '20px', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<h1>Welcome to Dazzling Sky</h1>} />
            <Route path="/about" element={<h1>About Us</h1>} />
            <Route path="/shop" element={<h1>Shop Collection</h1>} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/blog" element={<h1>Our Blog</h1>} />
            <Route path="/faq" element={<h1>FAQ</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
>>>>>>> b37389720d1a9a565b8eb5dc44628bcd8175e2c0
  );
}

export default App;
