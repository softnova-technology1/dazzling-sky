import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  Phone, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  X,
  MessageCircle,
  FileText,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function CustomizationsManagement() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inReview: 0, contacted: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Active / Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });
  const [previewImage, setPreviewImage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  const fetchRequests = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: statusFilter,
        search: searchQuery
      });

      const res = await fetch(`${API_BASE_URL}/api/customizations?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast(data.message || 'Failed to load custom bouquet requests', 'error');
      }
    } catch (err) {
      console.error('Error fetching custom bouquet requests:', err);
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery, navigate]);

  useEffect(() => {
    fetchRequests(currentPage);
  }, [fetchRequests, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests(1);
  };

  const handleViewDetails = (item) => {
    setSelectedRequest(item);
    setAdminNotes(item.adminNotes || '');
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/customizations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Request marked as ${newStatus.replace('_', ' ')}`);
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
        fetchRequests(currentPage);
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Network error while updating status', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    try {
      setIsSavingNotes(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/customizations/${selectedRequest._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Internal note saved successfully');
        setSelectedRequest(prev => ({ ...prev, adminNotes }));
        setRequests(prev => prev.map(r => r._id === selectedRequest._id ? { ...r, adminNotes } : r));
      } else {
        showToast(data.message || 'Failed to save note', 'error');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      showToast('Network error saving note', 'error');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/customizations/${requestToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        showToast('Custom bouquet request deleted');
        setRequestToDelete(null);
        if (selectedRequest?._id === requestToDelete._id) {
          setSelectedRequest(null);
        }
        fetchRequests(currentPage);
      } else {
        showToast(data.message || 'Failed to delete request', 'error');
      }
    } catch (err) {
      console.error('Error deleting request:', err);
      showToast('Network error deleting request', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCleanWhatsAppLink = (phone, name) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${name}, thank you for requesting a bespoke bouquet at Dazzling Sky Atelier! We are reviewing your design details.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Toast Alert */}
      {toastMessage.text && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(22, 11, 36, 0.95)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 138, 216, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} color="#ff8ad8" />}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '26px' }}>🌸</span>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '400', letterSpacing: '1px', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            Custom Bouquet Requests
          </h1>
        </div>
        <p style={{ margin: 0, color: '#a3a3a3', fontSize: '14px' }}>
          Real-time bespoke floral customization inquiries submitted via the "Customize Bouquet" feature on the shop page.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(136, 60, 138, 0.26) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(255, 138, 216, 0.22)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#d8b4fe', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Total Requests</span>
            <div style={{ background: 'rgba(136, 60, 138, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <Sparkles size={18} color="#ff8ad8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>Bespoke inquiries</div>
        </div>

        {/* Pending Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(255, 138, 216, 0.22) 78%, rgba(255, 138, 216, 0.25) 100%)',
          border: '1px solid rgba(255, 138, 216, 0.35)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#ff8ad8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Pending Action</span>
            <div style={{ background: 'rgba(255, 138, 216, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <Clock size={18} color="#ff8ad8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff8ad8', fontFamily: 'Georgia, serif' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '12px', color: '#ff8ad8', opacity: 0.85, marginTop: '4px' }}>Awaiting WhatsApp contact</div>
        </div>

        {/* In Review Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(192, 132, 252, 0.22) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(192, 132, 252, 0.25)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#c084fc', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>In Review</span>
            <div style={{ background: 'rgba(192, 132, 252, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <Eye size={18} color="#c084fc" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.inReview}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>Drafting proposal</div>
        </div>

        {/* Contacted Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(168, 85, 247, 0.22) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#d8b4fe', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Contacted</span>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <MessageCircle size={18} color="#d8b4fe" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.contacted}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>Communicating via WhatsApp</div>
        </div>

        {/* Completed Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(74, 222, 128, 0.15) 78%, rgba(216, 180, 254, 0.20) 100%)',
          border: '1px solid rgba(216, 180, 254, 0.25)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#e9d5ff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Completed</span>
            <div style={{ background: 'rgba(216, 180, 254, 0.15)', padding: '8px', borderRadius: '8px' }}>
              <CheckCircle2 size={18} color="#e9d5ff" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>Bouquet delivered</div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div style={{
        background: '#0e0818',
        border: '1px solid rgba(192, 132, 252, 0.25)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'All', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'In Review', value: 'in_review' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              style={{
                background: statusFilter === tab.value 
                  ? 'linear-gradient(135deg, #883c8a, #c084fc)' 
                  : 'rgba(255,255,255,0.05)',
                color: statusFilter === tab.value ? '#ffffff' : '#a3a3a3',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: statusFilter === tab.value ? '700' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search name, WhatsApp, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#150c22',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                color: '#ffffff',
                padding: '9px 38px 9px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                width: '260px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search size={16} />
            </button>
          </form>

          <button
            onClick={() => fetchRequests(currentPage)}
            title="Refresh List"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              color: '#c084fc',
              padding: '9px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div style={{
        background: '#0e0818',
        border: '1px solid rgba(192, 132, 252, 0.25)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
      }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#a3a3a3' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(192,132,252,0.3)', borderTopColor: '#ff8ad8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: '16px', fontSize: '14px' }}>Loading custom bouquet requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#737373' }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '14px' }}>🌸</span>
            <h3 style={{ margin: '0 0 8px', color: '#ffffff', fontSize: '18px', fontWeight: '500' }}>No Custom Requests Found</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#a3a3a3' }}>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Customer submissions from the "Customize Bouquet" feature will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#160a27', borderBottom: '1px solid rgba(192, 132, 252, 0.3)' }}>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>CLIENT</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>WHATSAPP</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>CUSTOMIZATION DETAILS</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>REFERENCE</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>RECEIVED</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '16px 20px', color: '#d8b4fe', fontWeight: '600', letterSpacing: '0.5px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: item.status === 'pending' ? 'rgba(136, 60, 138, 0.08)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Client Name */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px' }}>
                        {item.name}
                      </div>
                    </td>

                    {/* WhatsApp */}
                    <td style={{ padding: '18px 20px', whiteSpace: 'nowrap' }}>
                      <a
                        href={getCleanWhatsAppLink(item.whatsapp, item.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#25D366',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '13px',
                          background: 'rgba(37, 211, 102, 0.12)',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(37, 211, 102, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                        title="Click to chat with client on WhatsApp"
                      >
                        <MessageCircle size={14} />
                        <span>{item.whatsapp}</span>
                      </a>
                    </td>

                    {/* Details Snippet */}
                    <td style={{ padding: '18px 20px', maxWidth: '300px' }}>
                      <div style={{
                        color: '#d4d4d4',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.details}
                      </div>
                      {item.adminNotes && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d8b4fe', fontSize: '11px', marginTop: '4px' }}>
                          <FileText size={11} /> Note attached
                        </div>
                      )}
                    </td>

                    {/* Reference Image Thumbnail */}
                    <td style={{ padding: '18px 20px', whiteSpace: 'nowrap' }}>
                      {item.referenceImage?.url ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.referenceImage.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(item.referenceImage.url) ? (
                            <img
                              src={`${API_BASE_URL}${item.referenceImage.url}`}
                              alt="Thumbnail"
                              onClick={() => setPreviewImage(`${API_BASE_URL}${item.referenceImage.url}`)}
                              style={{
                                width: '42px',
                                height: '42px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid rgba(192, 132, 252, 0.4)',
                                cursor: 'pointer'
                              }}
                              title="Click to preview full image"
                            />
                          ) : (
                            <a
                              href={`${API_BASE_URL}${item.referenceImage.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#c084fc', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ImageIcon size={14} /> Doc
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>None</span>
                      )}
                    </td>

                    {/* Received Date */}
                    <td style={{ padding: '18px 20px', color: '#a3a3a3', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#737373" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '18px 20px', whiteSpace: 'nowrap' }}>
                      {item.status === 'pending' && (
                        <span style={{
                          background: 'rgba(255, 138, 216, 0.15)',
                          color: '#ff8ad8',
                          border: '1px solid rgba(255, 138, 216, 0.35)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Pending
                        </span>
                      )}
                      {item.status === 'in_review' && (
                        <span style={{
                          background: 'rgba(192, 132, 252, 0.15)',
                          color: '#c084fc',
                          border: '1px solid rgba(192, 132, 252, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          In Review
                        </span>
                      )}
                      {item.status === 'contacted' && (
                        <span style={{
                          background: 'rgba(168, 85, 247, 0.18)',
                          color: '#d8b4fe',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Contacted
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span style={{
                          background: 'rgba(216, 180, 254, 0.2)',
                          color: '#e9d5ff',
                          border: '1px solid rgba(216, 180, 254, 0.45)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Completed
                        </span>
                      )}
                      {item.status === 'cancelled' && (
                        <span style={{
                          background: 'rgba(107, 114, 128, 0.15)',
                          color: '#9ca3af',
                          border: '1px solid rgba(107, 114, 128, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '18px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* View Button */}
                        <button
                          onClick={() => handleViewDetails(item)}
                          style={{
                            background: 'linear-gradient(135deg, #883c8a, #c084fc)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Eye size={13} /> View
                        </button>

                        {/* Status Quick Changer */}
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                          style={{
                            background: '#150c22',
                            color: '#ffffff',
                            border: '1px solid rgba(192, 132, 252, 0.3)',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => setRequestToDelete(item)}
                          title="Delete Request"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#ef4444',
                            padding: '6px 9px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{
          padding: '16px 20px',
          background: '#090510',
          borderTop: '1px solid rgba(192, 132, 252, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ color: '#a3a3a3', fontSize: '13px' }}>
            Showing <strong style={{ color: '#ffffff' }}>{requests.length}</strong> of{' '}
            <strong style={{ color: '#ffffff' }}>{totalCount}</strong> requests
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || loading}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                color: currentPage <= 1 ? '#525252' : '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span style={{ color: '#a3a3a3', fontSize: '12px', margin: '0 8px' }}>
              Page <strong style={{ color: '#ff8ad8' }}>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages || loading}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                color: currentPage >= totalPages ? '#525252' : '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 2, 10, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(136, 60, 138, 0.25) 0%, #150b26 65%, #0a0512 100%)',
            border: '1px solid rgba(192, 132, 252, 0.35)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            padding: '32px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(192,132,252,0.2)', paddingBottom: '18px', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff8ad8', fontWeight: 'bold' }}>
                  ✦ Bespoke Bouquet Customization Details ✦
                </span>
                <h2 style={{ margin: '6px 0 0', color: '#ffffff', fontSize: '24px', fontFamily: 'Georgia, serif', fontWeight: '500' }}>
                  {selectedRequest.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c084fc',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Client Info & WhatsApp Action */}
            <div style={{
              background: 'rgba(15, 7, 26, 0.5)',
              border: '1px solid rgba(192,132,252,0.2)',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ color: '#25D366', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>WhatsApp Number</div>
                <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366', display: 'inline-block', boxShadow: '0 0 6px #25D366' }}></span>
                  {selectedRequest.whatsapp}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
                  Received: {formatDate(selectedRequest.createdAt)}
                </div>
              </div>

              <a
                href={getCleanWhatsAppLink(selectedRequest.whatsapp, selectedRequest.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleUpdateStatus(selectedRequest._id, 'contacted')}
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(37, 211, 102, 0.45)',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageCircle size={16} /> Open WhatsApp Chat
              </a>
            </div>

            {/* Customization Details */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ color: '#ff8ad8', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Client Customization Requirements:
              </div>
              <div style={{
                background: '#0d0618',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                borderLeft: '4px solid #ff8ad8',
                borderRadius: '8px',
                padding: '18px',
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                "{selectedRequest.details}"
              </div>
            </div>

            {/* Reference Image Preview */}
            {selectedRequest.referenceImage?.url && (
              <div style={{
                background: 'rgba(15, 7, 26, 0.5)',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                borderRadius: '10px',
                padding: '18px',
                marginBottom: '22px'
              }}>
                <div style={{ color: '#d8b4fe', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px' }}>
                  📎 Client Reference Image / Document:
                </div>

                {selectedRequest.referenceImage.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(selectedRequest.referenceImage.url) ? (
                  <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <img
                      src={`${API_BASE_URL}${selectedRequest.referenceImage.url}`}
                      alt="Reference"
                      style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                ) : null}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#e5e7eb' }}>
                    {selectedRequest.referenceImage.originalName || selectedRequest.referenceImage.filename}
                  </span>
                  <a
                    href={`${API_BASE_URL}${selectedRequest.referenceImage.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      background: 'rgba(136, 60, 138, 0.25)',
                      border: '1px solid rgba(192, 132, 252, 0.4)',
                      color: '#ff8ad8',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={13} /> Download File
                  </a>
                </div>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>Internal Atelier Notes</span>
                <span style={{ color: '#737373', fontSize: '11px' }}>Only visible to administrators</span>
              </div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Quoted $140 for 20 stem roses with lavender wrapping, delivery on 25th..."
                rows="3"
                style={{
                  width: '100%',
                  background: '#0d0618',
                  border: '1px solid rgba(192, 132, 252, 0.25)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                style={{
                  marginTop: '10px',
                  background: 'rgba(136, 60, 138, 0.25)',
                  border: '1px solid rgba(192, 132, 252, 0.4)',
                  color: '#ff8ad8',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Save size={13} /> {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Status Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(192, 132, 252, 0.2)',
              paddingTop: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#a3a3a3', fontSize: '13px' }}>Status:</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateStatus(selectedRequest._id, e.target.value)}
                  style={{
                    background: '#0d0618',
                    color: '#ffffff',
                    border: '1px solid rgba(192, 132, 252, 0.35)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {requestToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#120d0d',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ margin: '0 0 10px', color: '#ffffff', fontSize: '18px' }}>
              Delete Custom Request?
            </h3>
            <p style={{ color: '#a3a3a3', fontSize: '13px', lineHeight: '1.6', margin: '0 0 24px' }}>
              Are you sure you want to permanently delete the custom bouquet request from{' '}
              <strong style={{ color: '#ffffff' }}>{requestToDelete.name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setRequestToDelete(null)}
                disabled={isDeleting}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            cursor: 'zoom-out'
          }}
        >
          <img 
            src={previewImage} 
            alt="Reference Preview" 
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '10px', border: '1px solid rgba(192, 132, 252, 0.4)' }} 
          />
        </div>
      )}
    </div>
  );
}
