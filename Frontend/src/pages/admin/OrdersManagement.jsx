import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Edit2, 
  Trash2, 
  Search, 
  Download, 
  X, 
  Save, 
  AlertTriangle,
  Package,
  Truck
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function OrdersManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Toast Notification
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });
  
  // Edit Order Modal State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: 'Pending',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'Credit Card'
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Confirmation Modal State
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Compute Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const processing = orders.filter(o => o.status === 'Processing').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const revenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return { total, delivered, pending, processing, cancelled, revenue };
  }, [orders]);

  // Filter & Search Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = order._id.toLowerCase().includes(q);
        const nameMatch = order.shippingAddress?.fullName?.toLowerCase().includes(q);
        const emailMatch = order.user?.email?.toLowerCase().includes(q);
        const cityMatch = order.shippingAddress?.city?.toLowerCase().includes(q);
        return idMatch || nameMatch || emailMatch || cityMatch;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    const shortId = orderId.substring(orderId.length - 8).toUpperCase();
    if (!window.confirm(`Are you sure you want to change order #${shortId} status to "${newStatus}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        showToast(`Order status updated to "${newStatus}"!`);
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Error communicating with server', 'error');
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditFormData({
      status: order.status || 'Pending',
      fullName: order.shippingAddress?.fullName || '',
      address: order.shippingAddress?.address || '',
      city: order.shippingAddress?.city || '',
      postalCode: order.shippingAddress?.postalCode || '',
      phone: order.shippingAddress?.phone || '',
      paymentMethod: order.paymentMethod || 'Credit Card'
    });
  };

  const closeEditModal = () => {
    setEditingOrder(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const shortId = editingOrder._id.substring(editingOrder._id.length - 8).toUpperCase();
    if (!window.confirm(`Are you sure you want to save changes to order #${shortId}?`)) {
      return;
    }

    try {
      setIsSavingEdit(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editFormData.status,
          paymentMethod: editFormData.paymentMethod,
          shippingAddress: {
            fullName: editFormData.fullName,
            address: editFormData.address,
            city: editFormData.city,
            postalCode: editFormData.postalCode,
            phone: editFormData.phone
          }
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setOrders(prev => prev.map(o => o._id === editingOrder._id ? updated : o));
        showToast('Order details updated successfully!');
        closeEditModal();
      } else {
        const err = await response.json();
        showToast(err.message || 'Failed to update order', 'error');
      }
    } catch (err) {
      showToast('Network error updating order', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));
        showToast('Order deleted successfully!');
        setOrderToDelete(null);
      } else {
        const err = await response.json();
        showToast(err.message || 'Failed to delete order', 'error');
      }
    } catch (err) {
      showToast('Error deleting order', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Address', 'City', 'Date', 'Total ($)', 'Status', 'Payment'];
    const csvRows = [headers.join(',')];
    
    filteredOrders.forEach(order => {
      const row = [
        `"${order._id}"`,
        `"${order.shippingAddress?.fullName || 'N/A'}"`,
        `"${order.user ? order.user.email : 'Guest'}"`,
        `"${order.shippingAddress?.phone || 'N/A'}"`,
        `"${order.shippingAddress?.address || 'N/A'}"`,
        `"${order.shippingAddress?.city || 'N/A'}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${(order.totalPrice || 0).toFixed(2)}"`,
        `"${order.status}"`,
        `"${order.paymentMethod || 'Credit Card'}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders_dazzling_sky.csv');
    a.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15', border: 'rgba(234, 179, 8, 0.3)' };
      case 'Processing': return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'Shipped': return { bg: 'rgba(168, 85, 247, 0.15)', text: '#d8b4fe', border: 'rgba(168, 85, 247, 0.3)' };
      case 'Delivered': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Cancelled': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', text: '#a3a3a3', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  if (loading) return <div style={{ color: '#ffffff', padding: '24px' }}>Loading orders...</div>;
  if (error) return <div style={{ color: '#f87171', padding: '24px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#ffffff' }}>
      {/* Toast Alert */}
      {toastMessage.text && (
        <div style={{
          position: 'fixed',
          top: '32px',
          right: '32px',
          zIndex: 9999,
          background: toastMessage.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '500',
          backdropFilter: 'blur(8px)'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {toastMessage.text}
        </div>
      )}

      {/* Page Header */}
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
            Orders Management
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '14px', marginTop: '8px' }}>
            Track client commissions, fulfill floral deliveries, manage cancelled orders, and modify order details.
          </p>
        </div>

        <button 
          onClick={exportToCSV}
          disabled={orders.length === 0}
          style={{
            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: orders.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: orders.length === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(255,138,216,0.3)',
            transition: 'all 0.2s'
          }}
        >
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Stat Cards Grid (Total, Delivered, Pending/Processing, Total Cancelled, Total Revenue) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '36px' 
      }}>
        {/* Card 1: Total Orders */}
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
            <ShoppingBag size={24} color="#ff8ad8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Total Orders</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{stats.total}</div>
          </div>
        </div>

        {/* Card 2: Delivered */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(74, 222, 128, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} color="#4ade80" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Delivered</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#4ade80', marginTop: '4px' }}>{stats.delivered}</div>
          </div>
        </div>

        {/* Card 3: Pending & Processing */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(234, 179, 8, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} color="#facc15" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Pending / In-Prep</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#facc15', marginTop: '4px' }}>{stats.pending + stats.processing}</div>
          </div>
        </div>

        {/* Card 4: Total Cancelled */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(239, 68, 68, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={24} color="#f87171" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Total Cancelled</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#f87171', marginTop: '4px' }}>{stats.cancelled}</div>
          </div>
        </div>

        {/* Card 5: Atelier Sales */}
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
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Active Revenue</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'All Orders', count: stats.total },
            { key: 'Pending', label: 'Pending', count: stats.pending },
            { key: 'Processing', label: 'Processing', count: stats.processing },
            { key: 'Shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
            { key: 'Delivered', label: 'Delivered', count: stats.delivered },
            { key: 'Cancelled', label: 'Cancelled', count: stats.cancelled }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: statusFilter === f.key ? '1px solid #ff8ad8' : '1px solid rgba(255,255,255,0.08)',
                background: statusFilter === f.key ? 'rgba(255, 138, 216, 0.15)' : 'rgba(255,255,255,0.02)',
                color: statusFilter === f.key ? '#ff8ad8' : '#a3a3a3',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {f.label}
              <span style={{ 
                background: statusFilter === f.key ? '#ff8ad8' : 'rgba(255,255,255,0.1)', 
                color: statusFilter === f.key ? '#000' : '#a3a3a3',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '700'
              }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#a3a3a3" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Order ID, customer, city..."
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

      {/* Orders Table */}
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
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recipient & Client</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Destination</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#a3a3a3' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr 
                      key={order._id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255,138,216,0.08)', 
                        color: '#ffffff',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,138,216,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '13px', fontFamily: 'monospace', color: '#ff8ad8' }}>
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>

                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>
                          {order.shippingAddress?.fullName || 'N/A'}
                        </div>
                        <div style={{ color: '#a3a3a3', fontSize: '12px', marginTop: '2px' }}>
                          {order.user?.email || 'Guest Client'}
                        </div>
                      </td>

                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#d4d4d4' }}>
                        <div>{order.shippingAddress?.address || 'N/A'}</div>
                        <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>
                          {order.shippingAddress?.city} {order.shippingAddress?.postalCode ? `(${order.shippingAddress.postalCode})` : ''}
                        </div>
                      </td>

                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a3a3a3' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        ${(order.totalPrice || 0).toFixed(2)}
                      </td>

                      <td style={{ padding: '16px 24px' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            background: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            color: statusStyle.text,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            outline: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <option value="Pending" style={{ background: '#111', color: '#facc15' }}>Pending</option>
                          <option value="Processing" style={{ background: '#111', color: '#38bdf8' }}>Processing</option>
                          <option value="Shipped" style={{ background: '#111', color: '#d8b4fe' }}>Shipped</option>
                          <option value="Delivered" style={{ background: '#111', color: '#4ade80' }}>Delivered</option>
                          <option value="Cancelled" style={{ background: '#111', color: '#f87171' }}>Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '10px' }}>
                          <button
                            onClick={() => openEditModal(order)}
                            title="Edit Order"
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
                            onClick={() => confirmDeleteOrder(order)}
                            title="Delete Order"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0c0c0c',
            border: '1px solid rgba(255, 138, 216, 0.3)',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            padding: '36px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,138,216,0.15)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#fff' }}>
                  Edit Order Details
                </h3>
                <span style={{ fontSize: '12px', color: '#ff8ad8', fontFamily: 'monospace' }}>
                  #{editingOrder._id}
                </span>
              </div>
              <button 
                onClick={closeEditModal} 
                style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                    Order Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 138, 216, 0.2)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                  >
                    <option value="Pending" style={{ background: '#111' }}>Pending</option>
                    <option value="Processing" style={{ background: '#111' }}>Processing</option>
                    <option value="Shipped" style={{ background: '#111' }}>Shipped</option>
                    <option value="Delivered" style={{ background: '#111' }}>Delivered</option>
                    <option value="Cancelled" style={{ background: '#111' }}>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={editFormData.paymentMethod}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                    City / Area
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
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

                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.postalCode}
                    onChange={(e) => setEditFormData({ ...editFormData, postalCode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: '12px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#a3a3a3',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: isSavingEdit ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Save size={16} /> {isSavingEdit ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0e0e0e',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '440px',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            textAlign: 'center'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={26} color="#f87171" />
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: '600', color: '#fff' }}>
              Delete Order Record?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6' }}>
              Are you sure you want to permanently delete order <strong>#{orderToDelete._id.substring(orderToDelete._id.length - 8).toUpperCase()}</strong> for {orderToDelete.shippingAddress?.fullName}? This cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setOrderToDelete(null)}
                style={{
                  padding: '12px 22px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                style={{
                  padding: '12px 24px',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? 'DELETING...' : 'YES, DELETE ORDER'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
