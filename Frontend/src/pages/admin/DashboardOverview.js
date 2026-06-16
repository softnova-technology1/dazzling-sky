import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueData: [],
    ordersData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  // Colors ordered percentage wise: Brightest (Highest) to Darkest (Lowest)
  const COLORS = ['#ff8ad8', '#c084fc', '#8b5cf6', '#4c1d95'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ color: '#ffffff' }}>Loading overview...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '32px', color: '#ffffff', fontWeight: '400', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '18px' }}>Dashboard Overview</h2>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: '#111111', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(255,138,216,0.05)', border: '1px solid #ff8ad8' }}>
          <h3 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Total Revenue</h3>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 0 0', color: '#ffffff' }}>
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ background: '#111111', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(255,138,216,0.05)', border: '1px solid #ff8ad8' }}>
          <h3 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Total Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 0 0', color: '#ffffff' }}>
            {stats.totalOrders}
          </p>
        </div>
        <div style={{ background: '#111111', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(255,138,216,0.05)', border: '1px solid #ff8ad8' }}>
          <h3 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Active Customers</h3>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 0 0', color: '#ffffff' }}>
            {stats.totalCustomers}
          </p>
        </div>
        <div style={{ background: '#111111', padding: '32px 24px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(255,138,216,0.05)', border: '1px solid #ff8ad8' }}>
          <h3 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Products</h3>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 0 0', color: '#ffffff' }}>
            {stats.totalProducts}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        
        {/* Revenue Chart */}
        <div style={{ background: '#111111', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,138,216,0.2)' }}>
          <h3 style={{ color: '#ff8ad8', fontSize: '14px', fontWeight: '600', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue Trend (Last 6 Months)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8ad8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff8ad8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ff8ad8', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ color: '#ff8ad8' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ff8ad8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div style={{ background: '#111111', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,138,216,0.2)' }}>
          <h3 style={{ color: '#ff8ad8', fontSize: '14px', fontWeight: '600', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Orders Summary</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #883c8a', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ color: '#883c8a' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="orders" fill="#883c8a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Donut Chart */}
        <div style={{ background: '#111111', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,138,216,0.2)', gridColumn: '1 / -1' }}>
          <h3 style={{ color: '#ff8ad8', fontSize: '14px', fontWeight: '600', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sales by Category</h3>
          <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
                        {value}
                      </text>
                    );
                  }}
                >
                  {(stats.categoryData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ff8ad8', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ color: '#ff8ad8' }}
                  formatter={(value) => [`${value}`, 'Items']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '40px' }}>
              {(stats.categoryData || []).map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>{entry.name}</span>
                  <span style={{ color: '#a3a3a3', fontSize: '14px', marginLeft: 'auto', fontWeight: '600' }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
