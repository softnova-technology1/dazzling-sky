import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Filter, 
  Sparkles, 
  Send, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  X,
  FileText,
  Save,
  Globe,
  Phone,
  Paperclip,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function EnquiriesManagement() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, replied: 0, homepage: 0, contactPage: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Active state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  const fetchEnquiries = useCallback(async (page = currentPage) => {
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
        source: sourceFilter,
        search: searchQuery
      });

      const res = await fetch(`${API_BASE_URL}/api/enquiries?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast(data.message || 'Failed to load enquiries', 'error');
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      showToast('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, sourceFilter, searchQuery, navigate]);

  useEffect(() => {
    fetchEnquiries(currentPage);
  }, [fetchEnquiries, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEnquiries(1);
  };

  const handleViewDetails = async (item) => {
    setSelectedEnquiry(item);

    // If new, it gets marked as read on server
    if (item.status === 'new') {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_BASE_URL}/api/enquiries/${item._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setSelectedEnquiry(data.data);
          // Refresh list to reflect 'read' status
          setEnquiries(prev => prev.map(e => e._id === item._id ? { ...e, status: 'read' } : e));
          setStats(prev => ({ ...prev, new: Math.max(0, prev.new - 1) }));
        }
      } catch (err) {
        console.error('Error updating read status:', err);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Enquiry marked as ${newStatus}`);
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
        }
        // Refresh stats
        fetchEnquiries(currentPage);
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating enquiry status:', err);
      showToast('Network error while updating status', 'error');
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${enquiryToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        showToast('Enquiry record deleted successfully');
        setEnquiryToDelete(null);
        if (selectedEnquiry?._id === enquiryToDelete._id) {
          setSelectedEnquiry(null);
        }
        fetchEnquiries(currentPage);
      } else {
        showToast(data.message || 'Failed to delete enquiry', 'error');
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      showToast('Network error deleting enquiry', 'error');
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Toast Alert Notification */}
      {toastMessage.text && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(136, 60, 138, 0.95)',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <MessageSquare size={24} color="#ff8ad8" />
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '400', letterSpacing: '1px', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            Customer Enquiries & Consultations
          </h1>
        </div>
        <p style={{ margin: 0, color: '#a3a3a3', fontSize: '14px' }}>
          Real-time customer inquiries from both the homepage atelier consultation form and the contact page.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#a3a3a3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Total Inquiries</span>
            <div style={{ background: 'rgba(255,138,216,0.1)', padding: '8px', borderRadius: '8px' }}>
              <Mail size={18} color="#ff8ad8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '6px' }}>All-time submissions</div>
        </div>

        {/* New / Action Required Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(255, 138, 216, 0.22) 78%, rgba(255, 138, 216, 0.25) 100%)',
          border: '1px solid rgba(255, 138, 216, 0.35)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#ff8ad8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>New / Unread</span>
            <div style={{ background: 'rgba(255, 138, 216, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <Sparkles size={18} color="#ff8ad8" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff8ad8', fontFamily: 'Georgia, serif' }}>
            {stats.new}
          </div>
          <div style={{ fontSize: '12px', color: '#ff8ad8', opacity: 0.8, marginTop: '6px' }}>Requires atelier response</div>
        </div>

        {/* Replied Card */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(74, 222, 128, 0.15) 78%, rgba(255, 138, 216, 0.18) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#4ade80', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Replied</span>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <CheckCircle2 size={18} color="#4ade80" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Georgia, serif' }}>
            {stats.replied}
          </div>
          <div style={{ fontSize: '12px', color: '#737373', marginTop: '6px' }}>Client contacted</div>
        </div>

        {/* Channel Sources Split */}
        <div style={{
          background: 'linear-gradient(135deg, #050508 0%, #0c0814 42%, rgba(136, 60, 138, 0.26) 78%, rgba(192, 132, 252, 0.20) 100%)',
          border: '1px solid rgba(192, 132, 252, 0.25)',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#a3a3a3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Sources</span>
            <div style={{ background: 'rgba(136,60,138,0.2)', padding: '8px', borderRadius: '8px' }}>
              <Globe size={18} color="#c084fc" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{stats.homepage}</span>
              <div style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '2px' }}>Homepage Form</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{stats.contactPage}</span>
              <div style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '2px' }}>Contact Page</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div style={{
        background: '#121212',
        border: '1px solid rgba(255, 138, 216, 0.2)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'All', value: 'all' },
            { label: 'New', value: 'new' },
            { label: 'Read', value: 'read' },
            { label: 'Replied', value: 'replied' },
            { label: 'Archived', value: 'archived' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              style={{
                background: statusFilter === tab.value ? 'linear-gradient(90deg, #883c8a, #ff8ad8)' : 'rgba(255,255,255,0.05)',
                color: statusFilter === tab.value ? '#ffffff' : '#a3a3a3',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: statusFilter === tab.value ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Source Dropdown & Search Form */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid rgba(255,138,216,0.2)',
              borderRadius: '6px',
              padding: '9px 14px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Sources</option>
            <option value="homepage">Homepage Form</option>
            <option value="contact_page">Contact Page Form</option>
          </select>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search client or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255, 138, 216, 0.2)',
                color: '#ffffff',
                padding: '9px 38px 9px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                width: '240px',
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
                color: '#ff8ad8',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search size={16} />
            </button>
          </form>

          {/* Refresh Button */}
          <button
            onClick={() => fetchEnquiries(currentPage)}
            title="Refresh List"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,138,216,0.2)',
              color: '#ff8ad8',
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

      {/* Enquiries Data Table */}
      <div style={{
        background: '#121212',
        border: '1px solid rgba(255, 138, 216, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
      }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#a3a3a3' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(255,138,216,0.3)', borderTopColor: '#ff8ad8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: '16px', fontSize: '14px' }}>Loading atelier enquiries...</div>
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#737373' }}>
            <MessageSquare size={48} color="#333333" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#ffffff', fontSize: '18px', fontWeight: '500' }}>No Enquiries Found</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#a3a3a3' }}>
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' 
                ? 'Try adjusting your search query or filters.'
                : 'Customer submissions from the homepage and contact page will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255, 138, 216, 0.2)' }}>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px' }}>CLIENT</th>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px' }}>SOURCE</th>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px' }}>MESSAGE PREVIEW</th>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px' }}>RECEIVED</th>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '16px 20px', color: '#ff8ad8', fontWeight: '600', letterSpacing: '0.5px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((item) => (
                  <tr 
                    key={item._id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: item.status === 'new' ? 'rgba(255, 138, 216, 0.04)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Client Name & Contact */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>
                        {item.firstName} {item.lastName || ''}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff8ad8', fontSize: '12px' }}>
                        <Mail size={12} />
                        <a href={`mailto:${item.email}`} style={{ color: '#ff8ad8', textDecoration: 'none' }}>
                          {item.email}
                        </a>
                      </div>
                      {item.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a3a3a3', fontSize: '11px', marginTop: '2px' }}>
                          <Phone size={11} /> {item.phone}
                        </div>
                      )}
                    </td>

                    {/* Source */}
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500',
                        background: item.source === 'homepage' ? 'rgba(136, 60, 138, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        color: item.source === 'homepage' ? '#ff8ad8' : '#60a5fa',
                        border: item.source === 'homepage' ? '1px solid rgba(255, 138, 216, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        <Globe size={11} />
                        {item.source === 'homepage' ? 'Homepage Form' : 'Contact Page'}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td style={{ padding: '18px 20px', maxWidth: '320px' }}>
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
                        {item.message}
                      </div>
                      {item.attachment && item.attachment.url && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#ff8ad8',
                          fontSize: '11px',
                          marginTop: '6px',
                          background: 'rgba(255, 138, 216, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 138, 216, 0.25)'
                        }}>
                          <Paperclip size={11} /> {item.attachment.originalName || 'Attachment'}
                        </div>
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
                      {item.status === 'new' && (
                        <span style={{
                          background: 'rgba(255, 138, 216, 0.2)',
                          color: '#ff8ad8',
                          border: '1px solid rgba(255, 138, 216, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff8ad8', display: 'inline-block' }} />
                          NEW
                        </span>
                      )}
                      {item.status === 'read' && (
                        <span style={{
                          background: 'rgba(96, 165, 250, 0.15)',
                          color: '#93c5fd',
                          border: '1px solid rgba(96, 165, 250, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Read
                        </span>
                      )}
                      {item.status === 'replied' && (
                        <span style={{
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#4ade80',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} />
                          Replied
                        </span>
                      )}
                      {item.status === 'archived' && (
                        <span style={{
                          background: 'rgba(115, 115, 115, 0.15)',
                          color: '#a3a3a3',
                          border: '1px solid rgba(115, 115, 115, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Archived
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '18px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* View Button */}
                        <button
                          onClick={() => handleViewDetails(item)}
                          title="View Details & Reply"
                          style={{
                            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Eye size={13} /> View
                        </button>

                        {/* Quick Status Toggle */}
                        {item.status !== 'replied' ? (
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'replied')}
                            title="Mark as Replied"
                            style={{
                              background: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              color: '#4ade80',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle2 size={13} /> Mark Replied
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(item._id, 'new')}
                            title="Mark as New"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#d4d4d4',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Mark New
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => setEnquiryToDelete(item)}
                          title="Delete Enquiry"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#ef4444',
                            padding: '6px 9px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
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

        {/* Pagination Controls */}
        <div style={{
          padding: '16px 20px',
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255, 138, 216, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ color: '#a3a3a3', fontSize: '13px' }}>
            Showing <strong style={{ color: '#ffffff' }}>{enquiries.length}</strong> of{' '}
            <strong style={{ color: '#ffffff' }}>{totalCount}</strong> enquiries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || loading}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,138,216,0.2)',
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
                border: '1px solid rgba(255,138,216,0.2)',
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

      {/* View & Reply Details Modal */}
      {selectedEnquiry && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#141414',
            border: '1px solid rgba(255, 138, 216, 0.3)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            padding: '32px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,138,216,0.2)', paddingBottom: '18px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff8ad8', fontWeight: 'bold' }}>
                  Atelier Consultation Details
                </span>
                <h2 style={{ margin: '6px 0 0', color: '#ffffff', fontSize: '22px', fontFamily: 'Georgia, serif', fontWeight: '400' }}>
                  {selectedEnquiry.firstName} {selectedEnquiry.lastName || ''}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a3a3a3',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Client Profile Row */}
            <div style={{
              background: '#1b1b1b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <div style={{ color: '#737373', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</div>
                <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#ff8ad8', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <div style={{ color: '#737373', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Lead Origin</div>
                <div style={{ color: '#ffffff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={13} color="#c084fc" />
                  {selectedEnquiry.source === 'homepage' ? 'Homepage Consultation' : 'Contact Us Page'}
                </div>
              </div>
              <div>
                <div style={{ color: '#737373', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Submission Time</div>
                <div style={{ color: '#d4d4d4', fontSize: '13px' }}>
                  {formatDate(selectedEnquiry.createdAt)}
                </div>
              </div>
            </div>

            {/* Client Message */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#ff8ad8', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Client Message
              </div>
              <div style={{
                background: '#0d0d0d',
                border: '1px solid rgba(255, 138, 216, 0.2)',
                borderLeft: '4px solid #ff8ad8',
                borderRadius: '8px',
                padding: '20px',
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                "{selectedEnquiry.message}"
              </div>
            </div>

            {/* Attached File / Reference Document */}
            {selectedEnquiry.attachment && selectedEnquiry.attachment.url ? (
              <div style={{
                background: 'rgba(255, 138, 216, 0.05)',
                border: '1px solid rgba(255, 138, 216, 0.25)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8ad8', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
                  <Paperclip size={15} /> Attached Client File / Reference
                </div>

                {/* Image Preview if applicable */}
                {(selectedEnquiry.attachment.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(selectedEnquiry.attachment.url)) && (
                  <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0a0a0a', textAlign: 'center', padding: '12px' }}>
                    <img 
                      src={`${API_BASE_URL}${selectedEnquiry.attachment.url}`} 
                      alt="Client Reference" 
                      style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto', borderRadius: '6px' }} 
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#121212', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
                      {selectedEnquiry.attachment.originalName || selectedEnquiry.attachment.filename}
                    </div>
                    {selectedEnquiry.attachment.size > 0 && (
                      <div style={{ color: '#737373', fontSize: '11px', marginTop: '2px' }}>
                        {(selectedEnquiry.attachment.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </div>

                  <a
                    href={`${API_BASE_URL}${selectedEnquiry.attachment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={13} /> View / Download File
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#737373',
                fontSize: '12px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Paperclip size={14} /> No file or reference image attached with this enquiry.
              </div>
            )}

            {/* Status Change Selector & Close */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 138, 216, 0.2)',
              paddingTop: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#a3a3a3', fontSize: '13px' }}>Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry._id, e.target.value)}
                  style={{
                    background: '#1e1e1e',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 138, 216, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
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
      {enquiryToDelete && (
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
            background: '#18141c',
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
              Delete Enquiry?
            </h3>
            <p style={{ color: '#a3a3a3', fontSize: '13px', lineHeight: '1.6', margin: '0 0 24px' }}>
              Are you sure you want to permanently delete the enquiry from{' '}
              <strong style={{ color: '#ffffff' }}>{enquiryToDelete.firstName} {enquiryToDelete.lastName || ''}</strong>? This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setEnquiryToDelete(null)}
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
                onClick={handleDeleteEnquiry}
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
    </div>
  );
}
