import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  Edit2, 
  Trash2, 
  Search, 
  Download, 
  X, 
  Save, 
  AlertTriangle,
  CheckCircle2,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function CustomersManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'customer'
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Customer Modal State
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 3500);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/admin/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [navigate]);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // New in last 30 days
    const recent = customers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;
    // Active or wishlist active
    const active = customers.filter(c => (c.cart && c.cart.length > 0) || (c.wishlist && c.wishlist.length > 0) || c.role === 'customer').length;
    // Atelier VIP (either explicit vip role or longest standing)
    const vips = customers.filter(c => c.role === 'vip' || c.role === 'admin').length;

    return { total, recent, active, vips };
  }, [customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q) ||
      c._id?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name || '',
      email: customer.email || '',
      role: customer.role || 'customer'
    });
  };

  const closeEditModal = () => {
    setEditingCustomer(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;

    if (!window.confirm(`Are you sure you want to save changes to patron "${editingCustomer.name}"?`)) {
      return;
    }

    try {
      setIsSavingEdit(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/customers/${editingCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const updated = await response.json();
        setCustomers(prev => prev.map(c => c._id === editingCustomer._id ? { ...c, ...updated } : c));
        showToast('Client profile updated successfully!');
        closeEditModal();
      } else {
        const err = await response.json();
        showToast(err.message || 'Failed to update customer', 'error');
      }
    } catch (err) {
      showToast('Network error while updating customer', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const confirmDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setCustomers(prev => prev.filter(c => c._id !== customerToDelete._id));
        showToast('Client account deleted successfully!');
        setCustomerToDelete(null);
      } else {
        const err = await response.json();
        showToast(err.message || 'Failed to delete customer', 'error');
      }
    } catch (err) {
      showToast('Error deleting customer account', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Customer ID', 'Full Name', 'Email Address', 'Role Tier', 'Joined Date'];
    const csvRows = [headers.join(',')];
    
    filteredCustomers.forEach(customer => {
      const row = [
        `"${customer._id}"`,
        `"${customer.name}"`,
        `"${customer.email}"`,
        `"${customer.role || 'customer'}"`,
        `"${new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'customers_dazzling_sky.csv');
    a.click();
  };

  if (loading) return <div style={{ color: '#ffffff', padding: '24px' }}>Loading customers...</div>;
  if (error) return <div style={{ color: '#f87171', padding: '24px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#ffffff' }}>
      {/* Toast Notification */}
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
            Customers Management
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '14px', marginTop: '8px' }}>
            Manage client profiles, patron relationships, atelier memberships, and communication preferences.
          </p>
        </div>

        <button 
          onClick={exportToCSV}
          disabled={customers.length === 0}
          style={{
            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: customers.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: customers.length === 0 ? 0.5 : 1,
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

      {/* Customer Stat Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', 
        marginBottom: '36px' 
      }}>
        {/* Card 1: Total Registered */}
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
            <Users size={24} color="#ff8ad8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Total Patrons</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>{stats.total}</div>
          </div>
        </div>

        {/* Card 2: Active Clients */}
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
            <UserCheck size={24} color="#4ade80" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>Active Buyers</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#4ade80', marginTop: '4px' }}>{stats.active}</div>
          </div>
        </div>

        {/* Card 3: Joined Last 30 Days */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(56, 189, 248, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>New This Month</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>{stats.recent}</div>
          </div>
        </div>

        {/* Card 4: VIP Tier Patrons */}
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
            <Sparkles size={24} color="#facc15" />
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3' }}>VIP Circle Tier</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#facc15', marginTop: '4px' }}>{stats.vips > 0 ? stats.vips : 'Active'}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontSize: '14px', color: '#a3a3a3' }}>
          Showing <span style={{ color: '#fff', fontWeight: '600' }}>{filteredCustomers.length}</span> patrons
        </div>

        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} color="#a3a3a3" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
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

      {/* Customers Table */}
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
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Patron</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Email</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Client Tier</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Member Since</th>
                <th style={{ padding: '18px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#a3a3a3' }}>
                    No patrons match your search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const initials = customer.name ? customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DS';
                  return (
                    <tr 
                      key={customer._id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255,138,216,0.08)', 
                        color: '#ffffff',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,138,216,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(136, 60, 138, 0.3), rgba(255, 138, 216, 0.2))',
                            border: '1px solid rgba(255, 138, 216, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                            color: '#ff8ad8'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>
                              {customer.name}
                            </div>
                            <div style={{ color: '#888', fontSize: '11px', fontFamily: 'monospace', marginTop: '2px' }}>
                              ID: #{customer._id.substring(customer._id.length - 6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a3a3a3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={14} color="#ff8ad8" />
                          {customer.email}
                        </div>
                      </td>

                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: customer.role === 'vip' || customer.role === 'admin' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 138, 216, 0.15)',
                          color: customer.role === 'vip' || customer.role === 'admin' ? '#facc15' : '#ff8ad8',
                          border: customer.role === 'vip' || customer.role === 'admin' ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(255, 138, 216, 0.3)'
                        }}>
                          {customer.role === 'admin' ? 'ATELIER ADMIN' : customer.role === 'vip' ? 'VIP PATRON' : 'ATELIER CLIENT'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a3a3a3' }}>
                        {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '10px' }}>
                          <button
                            onClick={() => openEditModal(customer)}
                            title="Edit Patron Profile"
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
                            onClick={() => confirmDeleteCustomer(customer)}
                            title="Delete Patron"
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
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
            maxWidth: '500px',
            padding: '36px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,138,216,0.15)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#fff' }}>
                  Edit Patron Profile
                </h3>
                <span style={{ fontSize: '12px', color: '#ff8ad8', fontFamily: 'monospace' }}>
                  #{editingCustomer._id}
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
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3a3a3', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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
                  Client Membership Tier
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
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
                  <option value="customer" style={{ background: '#111' }}>Atelier Client (Standard)</option>
                  <option value="vip" style={{ background: '#111' }}>VIP Patron (Priority)</option>
                  <option value="admin" style={{ background: '#111' }}>Atelier Admin (Console Access)</option>
                </select>
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
      {customerToDelete && (
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
              Delete Patron Account?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#a3a3a3', lineHeight: '1.6' }}>
              Are you sure you want to delete patron <strong>{customerToDelete.name}</strong> ({customerToDelete.email})? This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setCustomerToDelete(null)}
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
                onClick={handleDeleteCustomer}
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
                {isDeleting ? 'DELETING...' : 'YES, DELETE PATRON'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
