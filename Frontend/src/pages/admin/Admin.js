import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, LogOut } from 'lucide-react';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import DashboardOverview from './DashboardOverview';
import CustomersManagement from './CustomersManagement';

import logoImage from '../../images/logo-black.png';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (!isAuthenticated) return null; // Avoid flashing the dashboard before redirect

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', fontFamily: '"Inter", sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0a0a0a', color: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,138,216,0.2)', boxShadow: '2px 0 20px rgba(255,138,216,0.05)' }}>
        <div style={{ padding: '36px 24px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,138,216,0.2)' }}>
          <img src={logoImage} alt="Logo" style={{ width: '160px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ marginTop: '16px', fontSize: '10px', color: '#ff8ad8', letterSpacing: '3px', fontWeight: '600', textTransform: 'uppercase' }}>Administration</div>
        </div>
        
        <nav style={{ flex: 1, padding: '32px 0' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', color: location.pathname === '/admin' ? '#ffffff' : '#a3a3a3', textDecoration: 'none', background: location.pathname === '/admin' ? 'linear-gradient(90deg, rgba(136, 60, 138, 0.2), rgba(255, 138, 216, 0.1))' : 'transparent', borderLeft: location.pathname === '/admin' ? '4px solid #ff8ad8' : '4px solid transparent', transition: 'all 0.3s ease', fontWeight: location.pathname === '/admin' ? '600' : '400' }}>
            <LayoutDashboard size={20} style={{ marginRight: '16px', color: location.pathname === '/admin' ? '#ff8ad8' : '#a3a3a3' }} /> Dashboard
          </Link>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', color: location.pathname === '/admin/products' ? '#ffffff' : '#a3a3a3', textDecoration: 'none', background: location.pathname === '/admin/products' ? 'linear-gradient(90deg, rgba(136, 60, 138, 0.2), rgba(255, 138, 216, 0.1))' : 'transparent', transition: 'all 0.3s ease', borderLeft: location.pathname === '/admin/products' ? '4px solid #ff8ad8' : '4px solid transparent', fontWeight: location.pathname === '/admin/products' ? '600' : '400' }}>
            <ShoppingBag size={20} style={{ marginRight: '16px', color: location.pathname === '/admin/products' ? '#ff8ad8' : '#a3a3a3' }} /> Products
          </Link>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', color: location.pathname === '/admin/orders' ? '#ffffff' : '#a3a3a3', textDecoration: 'none', background: location.pathname === '/admin/orders' ? 'linear-gradient(90deg, rgba(136, 60, 138, 0.2), rgba(255, 138, 216, 0.1))' : 'transparent', transition: 'all 0.3s ease', borderLeft: location.pathname === '/admin/orders' ? '4px solid #ff8ad8' : '4px solid transparent', fontWeight: location.pathname === '/admin/orders' ? '600' : '400' }}>
            <ShoppingCart size={20} style={{ marginRight: '16px', color: location.pathname === '/admin/orders' ? '#ff8ad8' : '#a3a3a3' }} /> Orders
          </Link>
          <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', color: location.pathname === '/admin/customers' ? '#ffffff' : '#a3a3a3', textDecoration: 'none', background: location.pathname === '/admin/customers' ? 'linear-gradient(90deg, rgba(136, 60, 138, 0.2), rgba(255, 138, 216, 0.1))' : 'transparent', transition: 'all 0.3s ease', borderLeft: location.pathname === '/admin/customers' ? '4px solid #ff8ad8' : '4px solid transparent', fontWeight: location.pathname === '/admin/customers' ? '600' : '400' }}>
            <Users size={20} style={{ marginRight: '16px', color: location.pathname === '/admin/customers' ? '#ff8ad8' : '#a3a3a3' }} /> Customers
          </Link>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,138,216,0.2)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', color: '#ff8ad8', background: 'transparent', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%', transition: 'all 0.2s ease', border: '1px solid #ff8ad8', opacity: 0.9 }}>
            <LogOut size={18} style={{ marginRight: '12px' }} /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(12px)', padding: '20px 48px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid rgba(255,138,216,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', letterSpacing: '1px' }}>ADMIN CONSOLE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(90deg, #883c8a, #ff8ad8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>A</div>
          </div>
        </header>

        <div style={{ padding: '48px', overflowY: 'auto', flex: 1, color: '#ffffff' }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
