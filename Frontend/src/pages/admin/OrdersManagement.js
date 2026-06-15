import React, { useState, useEffect } from 'react';


export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Email', 'Date', 'Total ($)', 'Status'];
    const csvRows = [headers.join(',')];
    
    orders.forEach(order => {
      const row = [
        `"${order._id}"`,
        `"${order.shippingAddress.fullName}"`,
        `"${order.user ? order.user.email : 'Guest'}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${order.totalPrice.toFixed(2)}"`,
        `"${order.status}"`
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state to reflect change
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15' };
      case 'Processing': return { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8' };
      case 'Shipped': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#d8b4fe' };
      case 'Delivered': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80' };
      case 'Cancelled': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', text: '#a3a3a3' };
    }
  };

  if (loading) return <div style={{ color: '#ffffff' }}>Loading orders...</div>;
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: '#ffffff', fontWeight: '400', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Orders Management</h2>
        <button 
          onClick={exportToCSV}
          disabled={orders.length === 0}
          style={{
            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: orders.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: orders.length === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          Export to CSV
        </button>
      </div>

      <div style={{ background: '#111111', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,138,216,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,138,216,0.05)', borderBottom: '1px solid rgba(255,138,216,0.2)' }}>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#a3a3a3' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,138,216,0.1)', color: '#ffffff' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontFamily: 'monospace' }}>
                      {order._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{order.shippingAddress.fullName}</div>
                      <div style={{ color: '#a3a3a3', fontSize: '12px', marginTop: '4px' }}>
                        {order.user ? order.user.email : 'Guest'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '400' }}>
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: statusStyle.bg, 
                        color: statusStyle.text, 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          background: '#050505',
                          border: '1px solid rgba(255,138,216,0.2)',
                          color: '#ffffff',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          outline: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
