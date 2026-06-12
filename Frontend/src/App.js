import React, { useState } from 'react';
import './App.css';
import Blog from './pages/blog/Blog';
import BlogDetails from './pages/blog/BlogDetails';

function App() {
  const [selectedFlower, setSelectedFlower] = useState(null);

  return (
    <>
      {selectedFlower ? (
        <BlogDetails 
          flower={selectedFlower} 
          onBack={() => setSelectedFlower(null)} 
          onSelectFlower={(flower) => setSelectedFlower(flower)}
        />
      ) : (
        <Blog onReadMore={(flower) => setSelectedFlower(flower)} />
      )}
    </>
  );
}

export default App;
