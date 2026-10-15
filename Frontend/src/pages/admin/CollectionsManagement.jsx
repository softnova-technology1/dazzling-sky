import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Layers, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function CollectionsManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    bannerImage: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const deriveCodeFromName = (name) => {
    if (!name) return '';
    const clean = name.trim();
    const defaults = {
      'seasonal limited': 'SL',
      'bouquets': 'BQ',
      'wedding': 'WD',
      'vases': 'VS',
      'gifts': 'GF',
      'private reserve': 'PR',
      'signature collection': 'SC',
      'anniversary': 'AN',
      'romance': 'RM',
      'orchids': 'OR',
      'roses': 'RS'
    };
    if (defaults[clean.toLowerCase()]) return defaults[clean.toLowerCase()];
    const words = clean.split(/[\s-_]+/).filter(Boolean);
    if (words.length >= 2) {
      return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
    }
    const word = words[0].toUpperCase();
    if (word.length <= 3) return word;
    const consonants = word.slice(1).replace(/[AEIOU]/g, '');
    if (consonants.length >= 1) {
      return (word[0] + consonants.slice(0, 2)).toUpperCase();
    }
    return word.slice(0, 2).toUpperCase();
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        code: category.code || deriveCodeFromName(category.name),
        description: category.description || '',
        bannerImage: category.bannerImage || ''
      });
      setBannerPreview(category.bannerImage || '');
      setBannerFile(null);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', code: '', description: '', bannerImage: '' });
      setBannerPreview('');
      setBannerFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setBannerPreview('');
    setBannerFile(null);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, name: newName };
      // Auto-compute code if not manually locked
      if (!editingCategory || !prev.code) {
        updated.code = deriveCodeFromName(newName);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionText = editingCategory 
      ? `save changes to collection "${editingCategory.name}"` 
      : `create new collection "${formData.name}"`;
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    const url = editingCategory
      ? `${API_BASE_URL}/api/categories/${editingCategory._id}`
      : `${API_BASE_URL}/api/categories`;
    const method = editingCategory ? 'PUT' : 'POST';

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('code', (formData.code || deriveCodeFromName(formData.name)).trim().toUpperCase());
    uploadData.append('description', formData.description);
    if (formData.bannerImage) {
      uploadData.append('bannerImage', formData.bannerImage);
    }
    if (bannerFile) {
      uploadData.append('banner', bannerFile);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      if (res.ok) {
        fetchCategories();
        closeModal();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save collection');
      }
    } catch (err) {
      console.error('Error saving collection:', err);
      alert('Error saving collection');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete collection "${name}"?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchCategories();
        } else {
          alert('Failed to delete collection');
        }
      } catch (err) {
        console.error('Error deleting collection:', err);
      }
    }
  };

  if (loading) return <div style={{ color: '#ffffff' }}>Loading collections...</div>;

  return (
    <div style={{ color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontWeight: '400', fontSize: '18px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Collections &amp; Categories
          </h2>
          <p style={{ margin: '8px 0 0', color: '#a3a3a3', fontSize: '13px' }}>
            Manage curated bouquet lines, SKU prefix codes (e.g. SL for Seasonal Limited), and storefront banner covers.
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
            boxShadow: '0 4px 15px rgba(255,138,216,0.3)'
          }}
        >
          <Plus size={16} /> ADD COLLECTION
        </button>
      </div>

      <div style={{ background: '#111111', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,138,216,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,138,216,0.05)', borderBottom: '1px solid rgba(255,138,216,0.2)' }}>
            <tr>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Banner</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Collection Name</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>SKU Prefix</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Products</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No collections created yet. Add one above!
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat._id} style={{ borderBottom: '1px solid rgba(255,138,216,0.1)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <img
                      src={cat.bannerImage || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80'}
                      alt={cat.name}
                      style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,138,216,0.3)' }}
                    />
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: '600', fontSize: '14px' }}>
                    {cat.name}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#ff8ad8',
                      background: 'rgba(255,138,216,0.12)',
                      border: '1px solid rgba(255,138,216,0.28)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      letterSpacing: '1px'
                    }}>
                      DZ-{cat.code || deriveCodeFromName(cat.name)}-XX
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#a3a3a3', fontSize: '13px', maxWidth: '260px' }}>
                    {cat.description || '—'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'rgba(255,138,216,0.15)', color: '#ff8ad8' }}>
                      {cat.itemCount || 0} Products
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => openModal(cat)}
                      style={{ background: 'none', border: 'none', color: '#ff8ad8', cursor: 'pointer', marginRight: '16px' }}
                      title="Edit Collection"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      title="Delete Collection"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#0e0e0e', width: '100%', maxWidth: '560px', borderRadius: '16px', padding: '36px', border: '1px solid rgba(255,138,216,0.3)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
                {editingCategory ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '20px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px' }}>Collection Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Seasonal Limited, Luxury Orchids"
                  value={formData.name}
                  onChange={handleNameChange}
                  style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid rgba(255,138,216,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              {/* SKU Prefix Code Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Category SKU Prefix Code
                  </label>
                  <span style={{ fontSize: '11px', color: '#a89bbd' }}>
                    Preview: <strong style={{ color: '#ff8ad8', fontFamily: 'monospace' }}>DZ-{(formData.code || 'SL')}-01</strong>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. SL, BQ, WD"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#181818',
                    border: '1px solid rgba(255,138,216,0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#716287', display: 'block', marginTop: '4px' }}>
                  Products added under this category will auto-generate SKUs as: DZ-[CODE]-01, DZ-[CODE]-02...
                </span>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief story or theme for this collection..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid rgba(255,138,216,0.2)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px' }}>Banner Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.bannerImage}
                  onChange={e => {
                    setFormData({ ...formData, bannerImage: e.target.value });
                    setBannerPreview(e.target.value);
                  }}
                  style={{ width: '100%', padding: '12px', background: '#181818', border: '1px solid rgba(255,138,216,0.2)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '10px', fontWeight: '600', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '2px' }}>Or Upload Banner File</label>
                <div style={{ position: 'relative', width: '100%', padding: '20px', borderRadius: '8px', background: '#181818', border: '1px dashed rgba(255,138,216,0.4)', textAlign: 'center', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleBannerChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <span style={{ fontSize: '12px', color: '#ff8ad8' }}>{bannerFile ? bannerFile.name : 'BROWSE BANNER IMAGE'}</span>
                </div>
                {bannerPreview && (
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <img src={bannerPreview} alt="Preview" style={{ maxHeight: '90px', borderRadius: '6px', border: '1px solid rgba(255,138,216,0.3)' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  CANCEL
                </button>
                <button type="submit" style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {editingCategory ? 'SAVE CHANGES' : 'CREATE COLLECTION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
