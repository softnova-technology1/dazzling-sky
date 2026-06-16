import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';


const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock
      });
      setImagePreview(product.imageUrl);
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', stock: '' });
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImagePreview('');
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `http://localhost:5000/api/products/${editingProduct._id}` 
      : 'http://localhost:5000/api/products';
      
    const method = editingProduct ? 'PUT' : 'POST';

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('description', formData.description);
    uploadData.append('price', formData.price);
    uploadData.append('category', formData.category);
    uploadData.append('stock', formData.stock);
    if (imageFile) {
      uploadData.append('image', imageFile);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: uploadData,
      });

      if (response.ok) {
        fetchProducts();
        closeModal();
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div style={{ color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontWeight: '400', fontSize: '18px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Products Management</h2>
        <button 
          onClick={() => openModal()}
          style={{ background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '12px', letterSpacing: '1px' }}
        >
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      <div style={{ background: '#111111', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,138,216,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'rgba(255,138,216,0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255,138,216,0.2)' }}>
            <tr>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Image</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Stock</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No products found. Add some to your catalog!</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid rgba(255,138,216,0.1)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '16px 24px', color: '#a3a3a3' }}>{product.category}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '400' }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', background: product.stock > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: product.stock > 0 ? '#4ade80' : '#f87171' }}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => openModal(product)} style={{ background: 'none', border: 'none', color: '#ff8ad8', cursor: 'pointer', marginRight: '16px' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(20px)', width: '100%', maxWidth: '540px', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,138,216,0.3)', boxShadow: '0 25px 50px -12px rgba(255,138,216,0.15), inset 0 0 20px rgba(255,138,216,0.05)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', background: 'linear-gradient(90deg, #ff8ad8, #883c8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a3a3a3', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,138,216,0.3)', color: '#ffffff', outline: 'none', fontSize: '15px', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '1px solid #ff8ad8'} onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,138,216,0.3)'} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,138,216,0.3)', color: '#ffffff', outline: 'none', resize: 'none', fontSize: '14px', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '1px solid #ff8ad8'} onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,138,216,0.3)'}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Price ($)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,138,216,0.3)', color: '#ffffff', outline: 'none', fontSize: '15px', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '1px solid #ff8ad8'} onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,138,216,0.3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Stock</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,138,216,0.3)', color: '#ffffff', outline: 'none', fontSize: '15px', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '1px solid #ff8ad8'} onBlur={(e) => e.target.style.borderBottom = '1px solid rgba(255,138,216,0.3)'} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '32px' }}>
                 <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Category</label>
                  <select required name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,138,216,0.05)', border: '1px solid rgba(255,138,216,0.2)', color: '#ffffff', outline: 'none', fontSize: '14px', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select a category</option>
                    <option value="Bouquets" style={{ background: '#111' }}>Bouquets</option>
                    <option value="Vases" style={{ background: '#111' }}>Vases</option>
                    <option value="Wedding" style={{ background: '#111' }}>Wedding</option>
                    <option value="Gifts" style={{ background: '#111' }}>Gifts</option>
                    <option value="Potted Plants" style={{ background: '#111' }}>Potted Plants</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Product Image</label>
                <div style={{ position: 'relative', width: '100%', padding: '32px', borderRadius: '12px', background: 'rgba(255,138,216,0.03)', border: '1px dashed rgba(255,138,216,0.4)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <span style={{ fontSize: '12px', color: '#ff8ad8', letterSpacing: '1px' }}>{imageFile ? imageFile.name : 'CLICK TO BROWSE IMAGE'}</span>
                </div>
                {imagePreview && (
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: '120px', borderRadius: '8px', border: '1px solid rgba(255,138,216,0.3)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
                  </div>
                )}
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s' }}>CANCEL</button>
                <button type="submit" style={{ padding: '14px 28px', background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,138,216,0.3)', transition: 'all 0.2s' }}>
                  {editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
