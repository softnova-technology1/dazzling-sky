import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Layers, 
  AlertTriangle, 
  Sliders,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  ExternalLink,
  Zap,
  CheckCheck,
  Package,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  SlidersHorizontal,
  X
} from 'lucide-react';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import DashboardOverview from './DashboardOverview';
import CustomersManagement from './CustomersManagement';
import CollectionsManagement from './CollectionsManagement';
import InventoryManagement from './InventoryManagement';
import SettingsManagement from './SettingsManagement';
import EnquiriesManagement from './EnquiriesManagement';
import CustomizationsManagement from './CustomizationsManagement';

import logoImage from '../../images/logo-black.png';
import styles from './admin.module.css';
import { API_BASE_URL } from '../../config/api';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Quick Action Dropdown State
  const [showQuickActions, setShowQuickActions] = useState(false);
  const quickActionsRef = useRef(null);

  // Notification Drawer State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState('all');
  const notifRef = useRef(null);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Dynamic Notifications List
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'order',
      title: 'New Luxury Order #1048',
      desc: 'Sophie Laurent placed an order for "Midnight Orchid Grand Luxe" ($285.00)',
      time: '12m ago',
      read: false,
      link: '/admin/orders'
    },
    {
      id: 'notif-2',
      type: 'custom',
      title: 'Bespoke Bouquet Requested',
      desc: 'David K. requested tailored peony arrangement with gold foil wrap',
      time: '34m ago',
      read: false,
      link: '/admin/customizations'
    },
    {
      id: 'notif-3',
      type: 'stock',
      title: 'Low Stock Alert: French Lavender Stems',
      desc: 'Only 3 bundles remaining in atelier cold storage',
      time: '2h ago',
      read: false,
      link: '/admin/inventory'
    }
  ]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          setShowSearchDropdown(true);
        }
      }
      if (e.key === 'Escape') {
        setShowQuickActions(false);
        setShowNotifications(false);
        setShowSearchDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target)) {
        setShowQuickActions(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    navigate(item.link);
  };

  if (!isAuthenticated) return null;

  const isRouteActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // Compute Page Title & Breadcrumb for Header
  const getHeaderContext = () => {
    const p = location.pathname;
    if (p === '/admin') return { title: 'Dashboard Overview', breadcrumb: 'Atelier Command' };
    if (p.startsWith('/admin/products')) return { title: 'Floral Products Catalog', breadcrumb: 'Catalog Management' };
    if (p.startsWith('/admin/collections')) return { title: 'Curated Collections', breadcrumb: 'Catalog Management' };
    if (p.startsWith('/admin/inventory')) return { title: 'Inventory & Fresh Stems', breadcrumb: 'Cold Storage & Stock' };
    if (p.startsWith('/admin/orders')) return { title: 'Client Orders & Express Fulfillment', breadcrumb: 'Commerce' };
    if (p.startsWith('/admin/customizations')) return { title: 'Bespoke Atelier Requests', breadcrumb: 'Artisan Craft' };
    if (p.startsWith('/admin/enquiries')) return { title: 'Client Concierge Enquiries', breadcrumb: 'Customer Relations' };
    if (p.startsWith('/admin/customers')) return { title: 'Customer Directory', breadcrumb: 'Customer Relations' };
    if (p.startsWith('/admin/settings')) return { title: 'Store Settings & Delivery Rules', breadcrumb: 'System Preferences' };
    return { title: 'Admin Administration', breadcrumb: 'Dazzling Sky' };
  };

  const headerContext = getHeaderContext();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (notifTab === 'all') return true;
    return n.type === notifTab;
  });

  // Global search quick links
  const searchQuickLinks = [
    { title: 'Products Catalog', path: '/admin/products', icon: ShoppingBag, category: 'Catalog' },
    { title: 'Inventory Stems & Stock', path: '/admin/inventory', icon: AlertTriangle, category: 'Inventory' },
    { title: 'Orders & Express Shipping', path: '/admin/orders', icon: ShoppingCart, category: 'Commerce' },
    { title: 'Custom Atelier Bouquets', path: '/admin/customizations', icon: Sparkles, category: 'Artisan' },
    { title: 'Store Settings & Tax', path: '/admin/settings', icon: Sliders, category: 'System' },
    { title: 'Client Inquiries', path: '/admin/enquiries', icon: MessageSquare, category: 'Clients' }
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar - Collapsible & Categorized (Matching Homepage Luxury Navbar Design) */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        
        {/* Brand Header */}
        <div className={styles.sidebarBrand}>
          <Link to="/admin" className={styles.brandLogoWrap}>
            <img src={logoImage} alt="Dazzling Sky" className={styles.brandLogoImg} />
            {!isCollapsed && (
              <div className={styles.brandTitles}>
                <span className={styles.sidebarTagline}>LUXURY FLORAL ATELIER</span>
                <span className={styles.brandBadge}>ADMIN COMMAND</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={styles.collapseToggleBtn}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Sections with 01-09 Editorial Luxury Numbering */}
        <nav className={styles.sidebarScroll}>
          
          {/* Section: ATELIER COMMAND */}
          <div className={styles.navSection}>
            {!isCollapsed && <div className={styles.navSectionLabel}>Atelier Command</div>}
            <Link 
              to="/admin" 
              className={`${styles.navItem} ${isRouteActive('/admin') ? styles.navItemActive : ''}`}
              title="Dashboard Overview"
            >
              <span className={styles.linkNum}>01</span>
              <div className={styles.navIconWrap}><LayoutDashboard size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Dashboard</span>}
            </Link>
          </div>

          {/* Section: CATALOG & INVENTORY */}
          <div className={styles.navSection}>
            {!isCollapsed && <div className={styles.navSectionLabel}>Catalog & Inventory</div>}
            <Link 
              to="/admin/products" 
              className={`${styles.navItem} ${isRouteActive('/admin/products') ? styles.navItemActive : ''}`}
              title="Products"
            >
              <span className={styles.linkNum}>02</span>
              <div className={styles.navIconWrap}><ShoppingBag size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Products</span>}
            </Link>
            <Link 
              to="/admin/collections" 
              className={`${styles.navItem} ${isRouteActive('/admin/collections') ? styles.navItemActive : ''}`}
              title="Collections"
            >
              <span className={styles.linkNum}>03</span>
              <div className={styles.navIconWrap}><Layers size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Collections</span>}
            </Link>
            <Link 
              to="/admin/inventory" 
              className={`${styles.navItem} ${isRouteActive('/admin/inventory') ? styles.navItemActive : ''}`}
              title="Inventory"
            >
              <span className={styles.linkNum}>04</span>
              <div className={styles.navIconWrap}><AlertTriangle size={17} /></div>
              {!isCollapsed && (
                <>
                  <span className={styles.navItemLabel}>Inventory</span>
                  <span className={`${styles.navPillBadge} ${styles.pillWarning}`}>Stock</span>
                </>
              )}
            </Link>
          </div>

          {/* Section: COMMERCE & CLIENTS */}
          <div className={styles.navSection}>
            {!isCollapsed && <div className={styles.navSectionLabel}>Commerce & Clients</div>}
            <Link 
              to="/admin/orders" 
              className={`${styles.navItem} ${isRouteActive('/admin/orders') ? styles.navItemActive : ''}`}
              title="Orders"
            >
              <span className={styles.linkNum}>05</span>
              <div className={styles.navIconWrap}><ShoppingCart size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Orders</span>}
            </Link>
            <Link 
              to="/admin/customizations" 
              className={`${styles.navItem} ${isRouteActive('/admin/customizations') ? styles.navItemActive : ''}`}
              title="Custom Bouquets"
            >
              <span className={styles.linkNum}>06</span>
              <div className={styles.navIconWrap}><Sparkles size={17} /></div>
              {!isCollapsed && (
                <>
                  <span className={styles.navItemLabel}>Custom Bouquets</span>
                  <span className={`${styles.navPillBadge} ${styles.pillNew}`}>New</span>
                </>
              )}
            </Link>
            <Link 
              to="/admin/enquiries" 
              className={`${styles.navItem} ${isRouteActive('/admin/enquiries') ? styles.navItemActive : ''}`}
              title="Enquiries"
            >
              <span className={styles.linkNum}>07</span>
              <div className={styles.navIconWrap}><MessageSquare size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Enquiries</span>}
            </Link>
            <Link 
              to="/admin/customers" 
              className={`${styles.navItem} ${isRouteActive('/admin/customers') ? styles.navItemActive : ''}`}
              title="Customers"
            >
              <span className={styles.linkNum}>08</span>
              <div className={styles.navIconWrap}><Users size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Customers</span>}
            </Link>
          </div>

          {/* Section: SYSTEM */}
          <div className={styles.navSection}>
            {!isCollapsed && <div className={styles.navSectionLabel}>System Preferences</div>}
            <Link 
              to="/admin/settings" 
              className={`${styles.navItem} ${isRouteActive('/admin/settings') ? styles.navItemActive : ''}`}
              title="Store Settings"
            >
              <span className={styles.linkNum}>09</span>
              <div className={styles.navIconWrap}><Sliders size={17} /></div>
              {!isCollapsed && <span className={styles.navItemLabel}>Store Settings</span>}
            </Link>
          </div>

        </nav>

        {/* Sidebar Footer with Profile & Sign Out */}
        <div className={styles.sidebarFooter}>
          {!isCollapsed ? (
            <>
              <div className={styles.adminProfileCard}>
                <div className={styles.adminAvatarSmall}>A</div>
                <div className={styles.adminInfo}>
                  <div className={styles.adminName}>Atelier Manager</div>
                  <div className={styles.adminRole}>
                    <span className={styles.onlineDot} /> Super Admin
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className={styles.signOutBtn}>
                <LogOut size={14} /> SIGN OUT
              </button>
            </>
          ) : (
            <button onClick={handleLogout} className={styles.signOutBtn} title="Sign Out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContainer}>
        {/* Sticky Glassmorphism Header */}
        <header className={styles.header}>
          
          {/* Header Left: Breadcrumbs */}
          <div className={styles.headerLeft}>
            <div className={styles.pageTitleBadge}>
              <span className={styles.breadcrumbText}>{headerContext.breadcrumb}</span>
              <h1 className={styles.headerPageTitle}>{headerContext.title}</h1>
            </div>
          </div>

          {/* Header Center: Global Search Bar */}
          <div className={styles.headerCenter} ref={searchContainerRef}>
            <div className={styles.searchBarWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search orders, products, clients..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className={styles.searchInput}
              />
              <span className={styles.keyboardShortcut}>⌘K</span>
            </div>

            {/* Quick Search Popover */}
            {showSearchDropdown && (
              <div className={styles.searchDropdown}>
                <div className={styles.searchGroupTitle}>Quick Navigation</div>
                {searchQuickLinks.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index}
                      className={styles.searchResultItem}
                      onClick={() => {
                        navigate(item.path);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <Icon size={16} color="#ff8ad8" />
                      <span>{item.title}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '10.5px', color: '#737373' }}>{item.category}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Header Right: Quick Actions, Notifications, Storefront Link, Profile */}
          <div className={styles.headerRight}>
            
            {/* Direct Link to Public Store */}
            <a 
              href="/shop" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.viewStoreBtn}
              title="Open Public Boutique Storefront"
            >
              <span>View Boutique</span>
              <ExternalLink size={14} />
            </a>

            {/* Quick Actions Launcher Button & Dropdown */}
            <div style={{ position: 'relative' }} ref={quickActionsRef}>
              <button 
                className={styles.quickActionsBtn}
                onClick={() => setShowQuickActions(!showQuickActions)}
                title="Quick Actions Menu"
              >
                <Zap size={14} fill="#ffffff" />
                <span>+ Quick Action</span>
              </button>

              {showQuickActions && (
                <div className={styles.quickActionsDropdown}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#ff8ad8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Atelier Fast Actions
                    </div>
                  </div>

                  <button 
                    className={styles.quickActionItem}
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/products');
                    }}
                  >
                    <div className={styles.quickActionIconWrap}>
                      <ShoppingBag size={16} />
                    </div>
                    <div className={styles.quickActionMeta}>
                      <span className={styles.quickActionTitle}>Add Floral Product</span>
                      <span className={styles.quickActionDesc}>Upload new arrangement or vase</span>
                    </div>
                  </button>

                  <button 
                    className={styles.quickActionItem}
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/customizations');
                    }}
                  >
                    <div className={styles.quickActionIconWrap}>
                      <Sparkles size={16} />
                    </div>
                    <div className={styles.quickActionMeta}>
                      <span className={styles.quickActionTitle}>Review Custom Bouquet</span>
                      <span className={styles.quickActionDesc}>Inspect bespoke client requests</span>
                    </div>
                  </button>

                  <button 
                    className={styles.quickActionItem}
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/inventory');
                    }}
                  >
                    <div className={styles.quickActionIconWrap}>
                      <AlertTriangle size={16} />
                    </div>
                    <div className={styles.quickActionMeta}>
                      <span className={styles.quickActionTitle}>Audit Low Stock Stems</span>
                      <span className={styles.quickActionDesc}>Review fresh flower reserves</span>
                    </div>
                  </button>

                  <button 
                    className={styles.quickActionItem}
                    onClick={() => {
                      setShowQuickActions(false);
                      window.open('https://wa.me/6567890123', '_blank');
                    }}
                  >
                    <div className={styles.quickActionIconWrap} style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366' }}>
                      <MessageSquare size={16} />
                    </div>
                    <div className={styles.quickActionMeta}>
                      <span className={styles.quickActionTitle}>WhatsApp Concierge</span>
                      <span className={styles.quickActionDesc}>Message atelier clients directly</span>
                    </div>
                  </button>

                  <button 
                    className={styles.quickActionItem}
                    onClick={() => {
                      setShowQuickActions(false);
                      navigate('/admin/settings');
                    }}
                  >
                    <div className={styles.quickActionIconWrap}>
                      <Sliders size={16} />
                    </div>
                    <div className={styles.quickActionMeta}>
                      <span className={styles.quickActionTitle}>Adjust Delivery & Tax</span>
                      <span className={styles.quickActionDesc}>Configure express shipping rules</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Notifications Center */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button 
                className={styles.notificationBtn}
                onClick={() => setShowNotifications(!showNotifications)}
                title="Atelier Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className={styles.notificationDrawer}>
                  <div className={styles.notificationHeader}>
                    <div className={styles.notificationHeaderTitle}>
                      <span>Atelier Alerts</span>
                      {unreadCount > 0 && (
                        <span className={styles.notificationHeaderCount}>{unreadCount} New</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsAsRead} className={styles.markAllReadBtn}>
                        <CheckCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification Category Tabs */}
                  <div className={styles.notificationTabs}>
                    <button 
                      className={`${styles.notifTab} ${notifTab === 'all' ? styles.notifTabActive : ''}`}
                      onClick={() => setNotifTab('all')}
                    >
                      All ({notifications.length})
                    </button>
                    <button 
                      className={`${styles.notifTab} ${notifTab === 'order' ? styles.notifTabActive : ''}`}
                      onClick={() => setNotifTab('order')}
                    >
                      Orders
                    </button>
                    <button 
                      className={`${styles.notifTab} ${notifTab === 'custom' ? styles.notifTabActive : ''}`}
                      onClick={() => setNotifTab('custom')}
                    >
                      Custom
                    </button>
                    <button 
                      className={`${styles.notifTab} ${notifTab === 'stock' ? styles.notifTabActive : ''}`}
                      onClick={() => setNotifTab('stock')}
                    >
                      Stock
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className={styles.notificationList}>
                    {filteredNotifications.length === 0 ? (
                      <div style={{ padding: '28px', textAlign: 'center', color: '#737373', fontSize: '13px' }}>
                        No notifications in this category.
                      </div>
                    ) : (
                      filteredNotifications.map((item) => (
                        <div 
                          key={item.id}
                          className={`${styles.notificationItem} ${!item.read ? styles.notificationUnread : ''}`}
                          onClick={() => handleNotificationClick(item)}
                        >
                          <div className={`
                            ${styles.notifIconWrap} 
                            ${item.type === 'order' ? styles.notifIconOrder : ''}
                            ${item.type === 'custom' ? styles.notifIconCustom : ''}
                            ${item.type === 'stock' ? styles.notifIconStock : ''}
                          `}>
                            {item.type === 'order' && <Package size={17} />}
                            {item.type === 'custom' && <Sparkles size={17} />}
                            {item.type === 'stock' && <AlertTriangle size={17} />}
                          </div>
                          <div className={styles.notifContent}>
                            <div className={styles.notifTitle}>{item.title}</div>
                            <div className={styles.notifDesc}>{item.desc}</div>
                            <div className={styles.notifTime}>{item.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.notificationFooter}>
                    <Link to="/admin/orders" onClick={() => setShowNotifications(false)} className={styles.notifFooterLink}>
                      View All Live Activity & Logs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <div 
              className={styles.userProfileTrigger}
              onClick={() => navigate('/admin/settings')}
              title="Open Settings & Security"
            >
              <div className={styles.userAvatar}>A</div>
              <span className={styles.userNameLabel}>Atelier Manager</span>
            </div>

          </div>
        </header>

        {/* Content View Area */}
        <div className={styles.contentArea}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="collections" element={<CollectionsManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="customers" element={<CustomersManagement />} />
            <Route path="enquiries" element={<EnquiriesManagement />} />
            <Route path="customizations" element={<CustomizationsManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
            <Route path="*" element={<DashboardOverview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
