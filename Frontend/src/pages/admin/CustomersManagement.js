import React, { useState, useEffect } from 'react';

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
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
    fetchCustomers();
  }, []);

  const exportToCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Customer Name', 'Email Address', 'Joined Date'];
    const csvRows = [headers.join(',')];
    
    customers.forEach(customer => {
      const row = [
        `"${customer.name}"`,
        `"${customer.email}"`,
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

  if (loading) return <div style={{ color: '#ffffff' }}>Loading customers...</div>;
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: '#ffffff', fontWeight: '400', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Customers Management</h2>
        <button 
          onClick={exportToCSV}
          disabled={customers.length === 0}
          style={{
            background: 'linear-gradient(90deg, #883c8a, #ff8ad8)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: customers.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: customers.length === 0 ? 0.5 : 1,
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
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Name</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</th>
              <th style={{ padding: '20px 24px', color: '#ff8ad8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: '#a3a3a3' }}>
                  No customers registered yet.
                </td>
              </tr>
            ) : (
              customers.map(customer => (
                <tr key={customer._id} style={{ borderBottom: '1px solid rgba(255,138,216,0.1)', color: '#ffffff' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '600' }}>
                    {customer.name}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#a3a3a3' }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                    {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
