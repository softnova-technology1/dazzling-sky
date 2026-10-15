import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  DollarSign, 
  Search,
  Layers,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    longDescription: '',
    careInstructions: '',
    price: '',
    category: '',
    stock: ''
  });
  const [skuLoading, setSkuLoading] = useState(false);

  // Auto-generate SKU from Backend API based on Category
  const fetchAutoSku = async (categoryName) => {
    try {
      setSkuLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products/sku/generate?category=${encodeURIComponent(categoryName || 'Bouquets')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.sku) {
          setFormData(prev => ({ ...prev, sku: data.sku }));
        }
      }
    } catch (err) {
      console.error('Error auto-generating SKU:', err);
    } finally {
      setSkuLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setFormData(prev => ({ ...prev, category: newCategory }));
    if (!editingProduct) {
      fetchAutoSku(newCategory);
    }
  };
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch Products & Categories
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Compute Real-time Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.stock > 0).length;
    const lowStock = products.filter(p => (p.stock || 0) < 5).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const catalogValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

    return { total, inStock, lowStock, outOfStock, totalUnits, catalogValue };
  }, [products]);

  // Filter Products by Search Query and Category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        return nameMatch || catMatch || descMatch;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Pagination State (Maximum 15 products per page)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Reset to page 1 whenever category or search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        careInstructions: product.careInstructions || '',
        price: product.price,
        category: product.category,
        stock: product.stock
      });
      setImagePreview(product.imageUrl);
      setImageFile(null);
    } else {
      const defaultCat = categories.length > 0 ? categories[0].name : 'Bouquets';
      setEditingProduct(null);
      setFormData({ 
        name: '', 
        sku: '',
        description: '', 
        longDescription: '', 
        careInstructions: '', 
        price: '', 
        category: defaultCat, 
        stock: '25' 
      });
      setImagePreview('');
      setImageFile(null);
      fetchAutoSku(defaultCat);
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
    const actionText = editingProduct 
      ? `save changes to "${editingProduct.name}"` 
      : `create new product "${formData.name}"`;
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    const url = editingProduct 
      ? `${API_BASE_URL}/api/products/${editingProduct._id}` 
      : `${API_BASE_URL}/api/products`;
      
    const method = editingProduct ? 'PUT' : 'POST';

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('sku', formData.sku);
    uploadData.append('description', formData.description);
    uploadData.append('longDescription', formData.longDescription);
    uploadData.append('careInstructions', formData.careInstructions);
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
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#ffffff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '300', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            margin: 0,
            background: 'linear-gradient(90deg, #ffffff, #ff8ad8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Products Management
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '14px', marginTop: '8px' }}>
            Curate luxury botanical arrangements, maintain catalog pricing, and review stock availability in real time.
          </p>
        </div>

        <button 
          onClick={() => openModal()}
          style={{ 
            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', 
            color: '#fff', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontWeight: '600', 
            fontSize: '12px', 
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(255,138,216,0.3)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      {/* Real-time Stat Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', 
        gap: '18px', 
        marginBottom: '36px' 
      }}>
        {/* Card 1: Total SKUs */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(136, 60, 138, 0.26) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(255, 138, 216, 0.22)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255, 138, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} color="#ff8ad8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Total Products</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{stats.total}</div>
          </div>
        </div>

        {/* Card 2: Active In-Stock */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(74, 222, 128, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#4ade80" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>In-Stock (Active)</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80', marginTop: '4px' }}>{stats.inStock}</div>
          </div>
        </div>

        {/* Card 3: Low Stock (< 5) */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(234, 179, 8, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} color="#facc15" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Low Stock (&lt; 5)</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#facc15', marginTop: '4px' }}>{stats.lowStock}</div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(239, 68, 68, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={22} color="#f87171" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Out of Stock</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f87171', marginTop: '4px' }}>{stats.outOfStock}</div>
          </div>
        </div>

        {/* Card 5: Total Stem Units */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(56, 189, 248, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={22} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Total Stock Units</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>{stats.totalUnits}</div>
          </div>
        </div>

        {/* Card 6: Inventory Valuation */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(136, 60, 138, 0.26) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(255, 138, 216, 0.22)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255, 138, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#ff8ad8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Catalog Valuation</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              ${stats.catalogValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: selectedCategory === 'ALL' ? '1px solid #ff8ad8' : '1px solid rgba(255,255,255,0.08)',
              background: selectedCategory === 'ALL' ? 'rgba(255, 138, 216, 0.15)' : 'rgba(255,255,255,0.02)',
              color: selectedCategory === 'ALL' ? '#ff8ad8' : '#a3a3a3',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            All Items
            <span style={{ 
              background: selectedCategory === 'ALL' ? '#ff8ad8' : 'rgba(255,255,255,0.1)', 
              color: selectedCategory === 'ALL' ? '#000' : '#a3a3a3',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '700'
            }}>
              {products.length}
            </span>
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <button
                key={cat._id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: selectedCategory === cat.name ? '1px solid #ff8ad8' : '1px solid rgba(255,255,255,0.08)',
                  background: selectedCategory === cat.name ? 'rgba(255, 138, 216, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: selectedCategory === cat.name ? '#ff8ad8' : '#a3a3a3',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat.name}
                <span style={{ 
                  background: selectedCategory === cat.name ? '#ff8ad8' : 'rgba(255,255,255,0.1)', 
                  color: selectedCategory === cat.name ? '#000' : '#a3a3a3',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#a3a3a3" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by bouquet name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 138, 216, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              outline: 'none',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div style={{ 
        background: '#0e0e0e', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255,138,216,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,138,216,0.05)', borderBottom: '1px solid rgba(255,138,216,0.15)' }}>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Image</th>
                <th style={{ padding: '18px 20px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Bouquet Name</th>
                <th style={{ padding: '18px 20px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product SKU</th>
                <th style={{ padding: '18px 20px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                <th style={{ padding: '18px 20px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Unit Price</th>
                <th style={{ padding: '18px 20px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Inventory Status</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#a3a3a3' }}>
                    No products match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr 
                    key={product._id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,138,216,0.08)', 
                      color: '#ffffff',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,138,216,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,138,216,0.2)' }} 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'} 
                      />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>{product.name}</div>
                      <div style={{ color: '#888', fontSize: '11px', marginTop: '3px', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description || 'Luxury atelier arrangement'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#ff8ad8',
                        background: 'rgba(255, 138, 216, 0.12)',
                        border: '1px solid rgba(255, 138, 216, 0.35)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        letterSpacing: '1px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff8ad8', display: 'inline-block' }}></span>
                        {product.sku || 'DZ-GEN-00'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        background: 'rgba(255, 138, 216, 0.1)',
                        color: '#ff8ad8',
                        border: '1px solid rgba(255, 138, 216, 0.25)'
                      }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', fontSize: '14px', color: '#fff' }}>
                      ${(product.price || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px', 
                        background: product.stock >= 5 ? 'rgba(34, 197, 94, 0.15)' : product.stock > 0 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                        color: product.stock >= 5 ? '#4ade80' : product.stock > 0 ? '#facc15' : '#f87171',
                        border: product.stock >= 5 ? '1px solid rgba(34, 197, 94, 0.3)' : product.stock > 0 ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '10px' }}>
                        <button 
                          onClick={() => openModal(product)} 
                          title="Edit Product"
                          style={{ 
                            background: 'rgba(255, 138, 216, 0.1)', 
                            border: '1px solid rgba(255, 138, 216, 0.25)', 
                            color: '#ff8ad8', 
                            padding: '8px', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          title="Delete Product"
                          style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.25)', 
                            color: '#f87171', 
                            padding: '8px', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Bar */}
        {filteredProducts.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 138, 216, 0.15)',
            background: 'rgba(255, 255, 255, 0.01)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Range & Total Info */}
            <div style={{ fontSize: '12px', color: '#a3a3a3' }}>
              Showing <span style={{ color: '#ffffff', fontWeight: '600' }}>{(currentPage - 1) * productsPerPage + 1}</span> to <span style={{ color: '#ffffff', fontWeight: '600' }}>{Math.min(currentPage * productsPerPage, filteredProducts.length)}</span> of <span style={{ color: '#ff8ad8', fontWeight: '600' }}>{filteredProducts.length}</span> products <span style={{ opacity: 0.7 }}>(Max 15 per page)</span>
            </div>

            {/* Pagination Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentPage === 1 ? '#555555' : '#ffffff',
                  background: currentPage === 1 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 138, 216, 0.1)',
                  border: currentPage === 1 ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 138, 216, 0.25)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ChevronLeft size={15} /> Prev
              </button>

              {/* Page Number Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: currentPage === pageNumber ? '#ffffff' : '#a3a3a3',
                      background: currentPage === pageNumber 
                        ? 'linear-gradient(135deg, #883c8a, #ff8ad8)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: currentPage === pageNumber 
                        ? '1px solid #ff8ad8' 
                        : '1px solid rgba(255, 138, 216, 0.15)',
                      boxShadow: currentPage === pageNumber ? '0 0 12px rgba(255, 138, 216, 0.4)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentPage === totalPages ? '#555555' : '#ffffff',
                  background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 138, 216, 0.1)',
                  border: currentPage === totalPages ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 138, 216, 0.25)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 3, 9, 0.82)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #130a1a 0%, #0a060e 100%)',
            width: '100%',
            maxWidth: '960px',
            borderRadius: '18px',
            padding: '32px 36px',
            border: '1px solid rgba(255, 138, 216, 0.28)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.85), 0 0 50px rgba(255,138,216,0.1)',
            position: 'relative',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(255, 138, 216, 0.18)',
              paddingBottom: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(255, 138, 216, 0.15)',
                    color: '#ff8ad8'
                  }}>
                    <Sparkles size={16} />
                  </span>
                  <h3 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#ffffff'
                  }}>
                    {editingProduct ? 'Edit Product Details' : 'Add New Bouquet Product'}
                  </h3>
                </div>
                <p style={{ margin: '4px 0 0 40px', fontSize: '12px', color: '#a89bbd', letterSpacing: '0.5px' }}>
                  {editingProduct ? `Refining botanical specs for ${editingProduct.name}` : 'Curate and publish a handcrafted botanical arrangement'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#d4d4d4',
                  width: '34px',
                  height: '34px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 138, 216, 0.2)';
                  e.currentTarget.style.color = '#ff8ad8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#d4d4d4';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Horizontal 2-Column Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '28px',
                alignItems: 'start'
              }}>
                {/* LEFT COLUMN: Narrative Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Product Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Pure White Tulip Harmony"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Short Description
                    </label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Brief summary displayed under product title..."
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Long Description (Bespoke Curation Story)
                    </label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Artisan curation story displayed in the Description tab..."
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Care Instructions (Care Ritual Guide)
                    </label>
                    <textarea
                      name="careInstructions"
                      value={formData.careInstructions}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="01. Keep in cool location...&#10;02. Refresh cold water every 48 hours...&#10;03. Trim stems at 45° angle..."
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Commercial Specs & Media */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Price ($)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 138, 216, 0.22)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          outline: 'none',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Stock Units
                      </label>
                      <input
                        required
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 138, 216, 0.22)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          outline: 'none',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Category / Collection
                    </label>
                    <select
                      required
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        background: '#160c23',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="" style={{ background: '#120b18' }}>Select a category</option>
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat._id} value={cat.name} style={{ background: '#120b18' }}>{cat.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="Bouquets" style={{ background: '#120b18' }}>Bouquets</option>
                          <option value="Vases" style={{ background: '#120b18' }}>Vases</option>
                          <option value="Wedding" style={{ background: '#120b18' }}>Wedding</option>
                          <option value="Gifts" style={{ background: '#120b18' }}>Gifts</option>
                          <option value="Seasonal Limited" style={{ background: '#120b18' }}>Seasonal Limited</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Product SKU with Auto-Generation Action */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Product SKU Code
                      </label>
                      <button
                        type="button"
                        onClick={() => fetchAutoSku(formData.category || 'Bouquets')}
                        disabled={skuLoading}
                        style={{
                          background: 'rgba(255, 138, 216, 0.12)',
                          border: '1px solid rgba(255, 138, 216, 0.35)',
                          color: '#ff8ad8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        title="Click to recalculate next sequential SKU for this category"
                      >
                        <Sparkles size={11} /> {skuLoading ? 'GENERATING...' : 'AUTO-GENERATE SKU'}
                      </button>
                    </div>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g. DZ-SL-01"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 138, 216, 0.22)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        fontSize: '13px',
                        letterSpacing: '1px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#a89bbd' }}>
                        Format: <strong style={{ color: '#ff8ad8' }}>DZ-[CAT]-[NUM]</strong> (e.g. DZ-SL-01 = Dazzling Sky Seasonal Limited 01)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Product Image
                    </label>
                    
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      padding: imagePreview ? '14px' : '26px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 138, 216, 0.03)',
                      border: '1px dashed rgba(255, 138, 216, 0.35)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      transition: 'all 0.25s ease'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                      />

                      {imagePreview ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '100%',
                            maxHeight: '160px',
                            height: '160px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#0a0610',
                            border: '1px solid rgba(255, 138, 216, 0.25)',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              background: 'rgba(10, 5, 15, 0.85)',
                              backdropFilter: 'blur(6px)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '10px',
                              color: '#ff8ad8',
                              border: '1px solid rgba(255, 138, 216, 0.3)',
                              letterSpacing: '0.5px'
                            }}>
                              CLICK TO CHANGE
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', color: '#a89bbd', wordBreak: 'break-all' }}>
                            {imageFile ? imageFile.name : 'Current product artwork linked'}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <UploadCloud size={28} color="#ff8ad8" strokeWidth={1.5} />
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff8ad8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Click to Browse Image File
                          </span>
                          <span style={{ fontSize: '11px', color: '#716287' }}>
                            PNG, JPG, or WEBP (luxury floral photography)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '14px',
                borderTop: '1px solid rgba(255, 138, 216, 0.15)',
                paddingTop: '20px'
              }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '11px 22px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#e5e5e5',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '11px 26px',
                    background: 'linear-gradient(90deg, #883c8a 0%, #be185d 50%, #ff8ad8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 18px rgba(190, 24, 93, 0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
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
