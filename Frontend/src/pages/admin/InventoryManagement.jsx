import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  PackageX, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  X, 
  Plus, 
  Minus,
  PackageCheck,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function InventoryManagement() {
  const [inventoryData, setInventoryData] = useState({
    summary: { totalSkus: 0, healthyStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0 },
    products: []
  });
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Edit Stock Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editStockQty, setEditStockQty] = useState(0);
  const [isSavingStock, setIsSavingStock] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/products/inventory/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInventoryData(data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleActive = async (prod) => {
    const previousActive = prod.isActive !== false;
    const nextActive = !previousActive;

    // 1. Optimistic instant UI update
    setInventoryData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p._id === prod._id ? { ...p, isActive: nextActive } : p
      )
    }));

    try {
      setActionLoadingId(prod._id);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/products/toggle-status/${prod._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: nextActive })
      });

      if (res.ok) {
        showToast(`"${prod.name}" is now ${nextActive ? 'visible' : 'hidden'} in storefront!`);
      } else {
        // Revert on API failure
        setInventoryData(prev => ({
          ...prev,
          products: prev.products.map(p => 
            p._id === prod._id ? { ...p, isActive: previousActive } : p
          )
        }));
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Failed to update visibility status');
      }
    } catch (err) {
      console.error('Error toggling product status:', err);
      // Revert on network error
      setInventoryData(prev => ({
        ...prev,
        products: prev.products.map(p => 
          p._id === prod._id ? { ...p, isActive: previousActive } : p
        )
      }));
      alert('Network error while updating visibility status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prod.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoadingId(prod._id);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/products/${prod._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast(`Product "${prod.name}" deleted successfully!`);
        fetchInventory();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Network error deleting product');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Edit Stock Modal Handlers
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditStockQty(prod.stock || 0);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditStockQty(0);
    setIsSavingStock(false);
  };

  const incrementStock = (amount = 1) => {
    setEditStockQty(prev => Math.max(0, (Number(prev) || 0) + amount));
  };

  const decrementStock = (amount = 1) => {
    setEditStockQty(prev => Math.max(0, (Number(prev) || 0) - amount));
  };

  const handleStockInputChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setEditStockQty('');
    } else {
      const num = parseInt(val, 10);
      setEditStockQty(isNaN(num) ? 0 : Math.max(0, num));
    }
  };

  const handleSaveStock = async (e) => {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    const finalStock = editStockQty === '' ? 0 : Math.max(0, Number(editStockQty));

    try {
      setIsSavingStock(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/products/inventory/quick-update/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock: finalStock })
      });

      if (res.ok) {
        showToast(`Stock updated to ${finalStock} units for "${editingProduct.name}"!`);
        closeEditModal();
        fetchInventory();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to update stock quantity');
      }
    } catch (err) {
      console.error('Error updating stock quantity:', err);
      alert('Network error while updating stock quantity');
    } finally {
      setIsSavingStock(false);
    }
  };

  const filteredProducts = inventoryData.products.filter(p => {
    if (filter === 'low') return p.stock > 0 && p.stock < 5;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  // Pagination State (Default 10 per page, configurable)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  if (loading) return <div style={{ color: '#ffffff', padding: '24px' }}>Loading inventory...</div>;

  const { summary } = inventoryData;

  // Compute preview health status for modal
  const numericEditStock = editStockQty === '' ? 0 : Number(editStockQty);
  const isModalOutOfStock = numericEditStock === 0;
  const isModalLowStock = numericEditStock > 0 && numericEditStock < 5;
  const isModalHealthy = numericEditStock >= 5;

  return (
    <div style={{ color: '#ffffff', position: 'relative' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', color: '#fff', padding: '14px 24px', borderRadius: '8px', zIndex: 3000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontWeight: '600', fontSize: '13px' }}>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontWeight: '400', fontSize: '18px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Inventory &amp; Low Stock Alerts
          </h2>
          <p style={{ margin: '8px 0 0', color: '#a3a3a3', fontSize: '13px' }}>
            Monitor real-time floral supplies, track stock levels, and manage product catalog status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchInventory}
            style={{ 
              background: '#181818', 
              border: '1px solid rgba(255,138,216,0.2)', 
              color: '#fff', 
              padding: '10px 18px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} /> REFRESH
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(136, 60, 138, 0.26) 78%, rgba(255, 138, 216, 0.18) 100%)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255,138,216,0.22)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)'
        }}>
          <span style={{ fontSize: '11px', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Floral SKUs</span>
          <p style={{ fontSize: '28px', fontWeight: '700', margin: '12px 0 0', color: '#fff' }}>{summary.totalSkus}</p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(74, 222, 128, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: '1px solid rgba(74,222,128,0.25)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>Healthy Stock (&gt;= 5)</span>
            <CheckCircle size={16} color="#4ade80" />
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', margin: '12px 0 0', color: '#4ade80' }}>{summary.healthyStock}</p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(250, 204, 21, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: summary.lowStock > 0 ? '1px solid #facc15' : '1px solid rgba(255,138,216,0.22)', 
          boxShadow: summary.lowStock > 0 ? '0 0 20px rgba(250,204,21,0.1)' : '0 8px 30px rgba(0,0,0,0.45)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#facc15', textTransform: 'uppercase', letterSpacing: '1px' }}>Low Stock Alert (&lt; 5)</span>
            <AlertTriangle size={16} color="#facc15" />
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', margin: '12px 0 0', color: '#facc15' }}>{summary.lowStock}</p>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(248, 113, 113, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)', 
          padding: '24px', 
          borderRadius: '12px', 
          border: summary.outOfStock > 0 ? '1px solid #f87171' : '1px solid rgba(255,138,216,0.22)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#f87171', textTransform: 'uppercase', letterSpacing: '1px' }}>Out of Stock</span>
            <PackageX size={16} color="#f87171" />
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', margin: '12px 0 0', color: '#f87171' }}>{summary.outOfStock}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: `All Products (${summary.totalSkus})` },
          { id: 'low', label: `Low Stock Alerts (${summary.lowStock})` },
          { id: 'out', label: `Out of Stock (${summary.outOfStock})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: filter === t.id ? '1px solid #ff8ad8' : '1px solid rgba(255,255,255,0.1)',
              background: filter === t.id ? 'linear-gradient(90deg, rgba(136,60,138,0.3), rgba(255,138,216,0.15))' : '#111111',
              color: filter === t.id ? '#ff8ad8' : '#a3a3a3',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div style={{ background: '#111111', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,138,216,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,138,216,0.05)', borderBottom: '1px solid rgba(255,138,216,0.2)' }}>
            <tr>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</th>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</th>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Inventory</th>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Status</th>
              <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#a3a3a3' }}>
                  No products match the selected filter.
                </td>
              </tr>
            ) : (
              paginatedProducts.map(prod => {
                const isOutOfStock = prod.stock === 0;
                const isLowStock = prod.stock > 0 && prod.stock < 5;
                const isHealthy = prod.stock >= 5;
                const isActive = prod.isActive !== false;

                return (
                  <tr 
                    key={prod._id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,138,216,0.1)', 
                      background: isOutOfStock ? 'rgba(239,68,68,0.03)' : (isLowStock ? 'rgba(250,204,21,0.03)' : 'transparent'),
                      opacity: isActive ? 1 : 0.72,
                      transition: 'opacity 0.2s, background 0.2s'
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,138,216,0.2)' }} 
                          onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {prod.name}
                            {!isActive && (
                              <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', letterSpacing: '0.5px' }}>
                                HIDDEN
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '2px', fontFamily: 'monospace' }}>
                            SKU: {prod.sku || prod._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px', color: '#a3a3a3', fontSize: '13px' }}>
                      {prod.category}
                    </td>

                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>
                      ${(prod.price || 0).toFixed(2)}
                    </td>

                    <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '700' }}>
                      {prod.stock} units
                    </td>

                    <td style={{ padding: '16px 24px' }}>
                      {isOutOfStock && (
                        <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                          OUT OF STOCK
                        </span>
                      )}
                      {isLowStock && (
                        <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'rgba(250,204,21,0.15)', color: '#facc15', border: '1px solid rgba(250,204,21,0.3)' }}>
                          LOW STOCK ({prod.stock})
                        </span>
                      )}
                      {isHealthy && (
                        <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                          HEALTHY
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* 1. View / Hide Visibility Toggle with Eye / EyeOff Icon */}
                        <button
                          type="button"
                          id={`toggle-visibility-${prod._id}`}
                          data-testid={`toggle-visibility-${prod._id}`}
                          onClick={() => handleToggleActive(prod)}
                          disabled={actionLoadingId === prod._id}
                          title={isActive ? 'Visible in store — Click to hide' : 'Hidden from store — Click to show'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '0.8px',
                            cursor: actionLoadingId === prod._id ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            background: isActive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: isActive ? '#4ade80' : '#f87171',
                            border: isActive ? '1px solid rgba(74, 222, 128, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
                            boxShadow: isActive ? '0 2px 8px rgba(74, 222, 128, 0.15)' : '0 2px 8px rgba(239, 68, 68, 0.15)'
                          }}
                        >
                          {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                          <span>{isActive ? 'VIEW' : 'HIDE'}</span>
                        </button>

                        {/* 2. Middle EDIT Option: Opens stock popup modal */}
                        <button
                          type="button"
                          id={`edit-stock-${prod._id}`}
                          data-testid={`edit-stock-${prod._id}`}
                          onClick={() => openEditModal(prod)}
                          title="Edit Stock Quantity"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: 'rgba(255, 138, 216, 0.12)',
                            color: '#ff8ad8',
                            border: '1px solid rgba(255, 138, 216, 0.35)',
                            boxShadow: '0 2px 8px rgba(255, 138, 216, 0.1)'
                          }}
                        >
                          <Edit3 size={13} />
                          EDIT
                        </button>

                        {/* 3. Delete Product button */}
                        <button
                          type="button"
                          id={`delete-prod-${prod._id}`}
                          data-testid={`delete-prod-${prod._id}`}
                          onClick={() => handleDeleteProduct(prod)}
                          disabled={actionLoadingId === prod._id}
                          title="Delete product permanently"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            cursor: actionLoadingId === prod._id ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          <Trash2 size={13} />
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
            {/* Range & Total Info with Per Page Selector */}
            <div style={{ fontSize: '12px', color: '#a3a3a3', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                Showing <span style={{ color: '#ffffff', fontWeight: '600' }}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span style={{ color: '#ffffff', fontWeight: '600' }}>{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span style={{ color: '#ff8ad8', fontWeight: '600' }}>{filteredProducts.length}</span> SKUs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#666' }}>Per page:</span>
                <select
                  value={itemsPerPage}
                  id="inv-items-per-page"
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255, 138, 216, 0.25)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>

            {/* Pagination Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                id="inv-pagination-prev"
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
                    id={`inv-page-${pageNumber}`}
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
                id="inv-pagination-next"
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

      {/* Edit Quantity Popup Modal */}
      {editingProduct && (
        <div 
          onClick={closeEditModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#121212',
              borderRadius: '14px',
              border: '1px solid rgba(255, 138, 216, 0.35)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 138, 216, 0.15)',
              padding: '28px',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff' }}>
                  Update Stock Quantity
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#a3a3a3' }}>
                  Adjust the live botanical inventory for this product.
                </p>
              </div>
              <button 
                onClick={closeEditModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#a3a3a3',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Snapshot Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px',
              background: 'rgba(255, 138, 216, 0.05)',
              border: '1px solid rgba(255, 138, 216, 0.15)',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <img 
                src={editingProduct.imageUrl} 
                alt={editingProduct.name}
                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255, 138, 216, 0.25)' }}
                onError={(e) => e.target.src = 'https://via.placeholder.com/52'}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {editingProduct.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#ff8ad8', fontFamily: 'monospace', fontWeight: '700' }}>
                    {editingProduct.sku || editingProduct._id.slice(-6).toUpperCase()}
                  </span>
                  <span style={{ fontSize: '11px', color: '#666' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#a3a3a3' }}>
                    {editingProduct.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Quantity Controls */}
            <form onSubmit={handleSaveStock}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#ff8ad8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Set Inventory Units
                  </label>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    Current in DB: <strong style={{ color: '#fff' }}>{editingProduct.stock} units</strong>
                  </span>
                </div>

                {/* Primary Stepper & Direct Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#181818',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 138, 216, 0.3)',
                  padding: '6px',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                }}>
                  <button
                    type="button"
                    onClick={() => decrementStock(1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Minus size={18} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={editStockQty}
                    onChange={handleStockInputChange}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '28px',
                      fontWeight: '800',
                      textAlign: 'center',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => incrementStock(1)}
                    style={{
                      background: 'rgba(255, 138, 216, 0.15)',
                      border: '1px solid rgba(255, 138, 216, 0.3)',
                      color: '#ff8ad8',
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Quick Increment Shortcuts */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {[
                    { label: '+5', val: 5 },
                    { label: '+10', val: 10 },
                    { label: '+25', val: 25 },
                    { label: '+50', val: 50 },
                    { label: 'Set to 0', val: 0, isSet: true }
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => btn.isSet ? setEditStockQty(0) : incrementStock(btn.val)}
                      style={{
                        flex: 1,
                        padding: '8px 4px',
                        background: '#1c1c1c',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: btn.isSet ? '#f87171' : '#ff8ad8',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Preview Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: '#181818',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '11px', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Status Preview
                </span>
                {isModalOutOfStock && (
                  <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                    OUT OF STOCK
                  </span>
                )}
                {isModalLowStock && (
                  <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', background: 'rgba(250,204,21,0.15)', color: '#facc15', border: '1px solid rgba(250,204,21,0.3)' }}>
                    LOW STOCK ALERT ({numericEditStock})
                  </span>
                )}
                {isModalHealthy && (
                  <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                    HEALTHY STOCK ({numericEditStock})
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingStock}
                  style={{
                    padding: '12px 26px',
                    background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: isSavingStock ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(255, 138, 216, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <PackageCheck size={14} />
                  {isSavingStock ? 'Saving...' : 'Save Quantity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
