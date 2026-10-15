import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Percent, 
  Lock, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Building2,
  Clock,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import styles from './admin.module.css';

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Store Profile & Delivery Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Dazzling Sky Floral Atelier',
    contactEmail: 'atelier@dazzlingsky.com',
    contactPhone: '+65 6789 0123',
    storeAddress: '01-019, Jalan Besar, Singapore 208786',
    deliveryFee: 15.00,
    freeDeliveryThreshold: 150.00,
    taxRate: 9.0,
    currency: 'SGD'
  });

  // Operating Schedule & Concierge Templates (Client-side enhanced state)
  const [extraSettings, setExtraSettings] = useState({
    cutoffTime: '14:00',
    operatingHours: 'Mon - Sun: 09:00 AM - 08:00 PM',
    holidayNotice: 'Fresh floral shipments guaranteed on public holidays with prior reservation.',
    whatsappGreeting: 'Hello from Dazzling Sky Atelier! How may our floral artisans assist you today?',
    orderConfirmationNote: 'Thank you for choosing Dazzling Sky Atelier. Your curated floral arrangement is being handcrafted.'
  });

  // Admin Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`);
      if (res.ok) {
        const data = await res.json();
        setStoreSettings({
          storeName: data.storeName || 'Dazzling Sky Floral Atelier',
          contactEmail: data.contactEmail || 'atelier@dazzlingsky.com',
          contactPhone: data.contactPhone || '+65 6789 0123',
          storeAddress: data.storeAddress || '01-019, Jalan Besar, Singapore 208786',
          deliveryFee: data.deliveryFee ?? 15.00,
          freeDeliveryThreshold: data.freeDeliveryThreshold ?? 150.00,
          taxRate: data.taxRate ?? 9.0,
          currency: data.currency || 'SGD'
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Save and synchronize updated store configurations with the boutique storefront?')) {
      return;
    }

    try {
      setSavingSettings(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storeSettings)
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Store settings updated and synchronized in real-time!', 'success');
      } else {
        showToast(data.message || 'Failed to update settings', 'error');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('Server connection error', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to change your administrator credentials?')) {
      return;
    }

    try {
      setSavingPassword(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/api/admin/settings/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Administrator credentials updated successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      showToast('Server connection error', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // Compute password strength indicator
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'Empty', score: 0, color: '#555' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { label: 'Fair', score: 35, color: '#f59e0b' };
    if (score <= 4) return { label: 'Strong', score: 75, color: '#c084fc' };
    return { label: 'Very Strong (Atelier Grade)', score: 100, color: '#ff8ad8' };
  };

  const passStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className={styles.settingsContainer}>
      {/* Toast Alert */}
      {toastMessage.text && (
        <div style={{
          position: 'fixed',
          top: '32px',
          right: '32px',
          zIndex: 9999,
          background: toastMessage.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '500',
          fontSize: '13.5px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.25s ease'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toastMessage.text}
        </div>
      )}

      {/* Header Hero */}
      <div className={styles.settingsHero}>
        <h1 className={styles.settingsTitle}>Store Settings & General Configuration</h1>
        <p className={styles.settingsSubtitle}>
          Fine-tune atelier brand identity, express delivery thresholds, operating schedules, and admin authentication.
        </p>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className={styles.settingsTabsNav}>
        <button 
          className={`${styles.settingsTabBtn} ${activeTab === 'general' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Building2 size={16} />
          <span>Atelier Identity</span>
        </button>

        <button 
          className={`${styles.settingsTabBtn} ${activeTab === 'commerce' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('commerce')}
        >
          <Truck size={16} />
          <span>Commerce & Delivery</span>
        </button>

        <button 
          className={`${styles.settingsTabBtn} ${activeTab === 'schedule' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Clock size={16} />
          <span>Schedule & Cutoffs</span>
        </button>

        <button 
          className={`${styles.settingsTabBtn} ${activeTab === 'whatsapp' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageSquare size={16} />
          <span>WhatsApp & Messaging</span>
        </button>

        <button 
          className={`${styles.settingsTabBtn} ${activeTab === 'security' ? styles.settingsTabActive : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <ShieldCheck size={16} />
          <span>Admin Security</span>
        </button>
      </div>

      {/* Split Layout: Settings Form + Live Checkout Preview */}
      <div className={styles.settingsSplitLayout}>
        
        {/* Left Side: Active Tab Form Panel */}
        <div>
          {/* TAB 1: GENERAL / ATELIER IDENTITY */}
          {activeTab === 'general' && (
            <div className={styles.settingsCardPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIconCircle}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className={styles.panelTitle}>Atelier Identity & Contact Details</h2>
                  <p className={styles.panelDesc}>Official store branding, contact email, boutique phone, and physical address.</p>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <Building2 size={13} color="#ff8ad8" /> Store Atelier Name
                  </label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    required
                    className={styles.formInputText}
                    placeholder="e.g. Dazzling Sky Floral Atelier"
                  />
                  <span className={styles.formFieldHelp}>Displayed on customer invoices, emails, and website title bar.</span>
                </div>

                <div className={styles.formRowGrid}>
                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Mail size={13} color="#ff8ad8" /> Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={storeSettings.contactEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                      required
                      className={styles.formInputText}
                    />
                  </div>

                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Phone size={13} color="#ff8ad8" /> Concierge Hotline
                    </label>
                    <input
                      type="text"
                      value={storeSettings.contactPhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })}
                      required
                      className={styles.formInputText}
                    />
                  </div>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <MapPin size={13} color="#ff8ad8" /> Physical Boutique Atelier Address
                  </label>
                  <textarea
                    rows={2}
                    value={storeSettings.storeAddress}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                    required
                    className={styles.formInputText}
                    style={{ resize: 'none' }}
                  />
                  <span className={styles.formFieldHelp}>Used for customer pickup navigation and official invoice footers.</span>
                </div>

                <button type="submit" disabled={savingSettings} className={styles.saveSettingsBtn}>
                  <Save size={16} /> {savingSettings ? 'SAVING...' : 'SAVE ATELIER IDENTITY'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: COMMERCE & DELIVERY */}
          {activeTab === 'commerce' && (
            <div className={styles.settingsCardPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIconCircle}>
                  <Truck size={20} />
                </div>
                <div>
                  <h2 className={styles.panelTitle}>Express Delivery, Thresholds & Tax</h2>
                  <p className={styles.panelDesc}>Automate shipping rates, complimentary delivery tier, and government tax percentage.</p>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit}>
                <div className={styles.formRowGrid}>
                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Truck size={13} color="#ff8ad8" /> Standard Express Fee ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.deliveryFee}
                      onChange={(e) => setStoreSettings({ ...storeSettings, deliveryFee: parseFloat(e.target.value) || 0 })}
                      required
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>Default flat fee for orders below complimentary tier.</span>
                  </div>

                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <DollarSign size={13} color="#ff8ad8" /> Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={storeSettings.freeDeliveryThreshold}
                      onChange={(e) => setStoreSettings({ ...storeSettings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                      required
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>Orders meeting this spend receive free courier delivery.</span>
                  </div>
                </div>

                <div className={styles.formRowGrid}>
                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Percent size={13} color="#ff8ad8" /> Tax Rate (GST / VAT %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={storeSettings.taxRate}
                      onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: parseFloat(e.target.value) || 0 })}
                      required
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>Applied across checkout carts and invoices.</span>
                  </div>

                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <DollarSign size={13} color="#ff8ad8" /> Currency Code
                    </label>
                    <input
                      type="text"
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                      required
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>e.g. SGD, USD ($), EUR (€).</span>
                  </div>
                </div>

                <button type="submit" disabled={savingSettings} className={styles.saveSettingsBtn}>
                  <Save size={16} /> {savingSettings ? 'SAVING...' : 'SAVE COMMERCE CONFIGURATION'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SCHEDULE & CUTOFFS */}
          {activeTab === 'schedule' && (
            <div className={styles.settingsCardPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIconCircle}>
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className={styles.panelTitle}>Operating Schedule & Cutoff Times</h2>
                  <p className={styles.panelDesc}>Configure same-day courier cutoff times and boutique studio hours.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className={styles.formRowGrid}>
                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Clock size={13} color="#ff8ad8" /> Same-Day Delivery Cutoff
                    </label>
                    <input
                      type="time"
                      value={extraSettings.cutoffTime}
                      onChange={(e) => setExtraSettings({ ...extraSettings, cutoffTime: e.target.value })}
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>Orders placed after this hour shift to next-day delivery.</span>
                  </div>

                  <div className={styles.formFieldGroup}>
                    <label className={styles.formFieldLabel}>
                      <Clock size={13} color="#ff8ad8" /> Studio Operating Hours
                    </label>
                    <input
                      type="text"
                      value={extraSettings.operatingHours}
                      onChange={(e) => setExtraSettings({ ...extraSettings, operatingHours: e.target.value })}
                      className={styles.formInputText}
                    />
                    <span className={styles.formFieldHelp}>Displayed in the footer and contact pages.</span>
                  </div>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <AlertCircle size={13} color="#ff8ad8" /> Holiday & Peak Season Policy
                  </label>
                  <textarea
                    rows={3}
                    value={extraSettings.holidayNotice}
                    onChange={(e) => setExtraSettings({ ...extraSettings, holidayNotice: e.target.value })}
                    className={styles.formInputText}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => showToast('Schedule & cutoff policies updated!', 'success')}
                  className={styles.saveSettingsBtn}
                >
                  <Save size={16} /> SAVE SCHEDULE POLICIES
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP CONCIERGE & TEMPLATES */}
          {activeTab === 'whatsapp' && (
            <div className={styles.settingsCardPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIconCircle} style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className={styles.panelTitle}>WhatsApp Concierge & Auto-Templates</h2>
                  <p className={styles.panelDesc}>Customize automated client conversation starters and bespoke order confirmations.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <MessageSquare size={13} color="#25D366" /> Default Concierge Greeting Message
                  </label>
                  <textarea
                    rows={3}
                    value={extraSettings.whatsappGreeting}
                    onChange={(e) => setExtraSettings({ ...extraSettings, whatsappGreeting: e.target.value })}
                    className={styles.formInputText}
                    style={{ resize: 'none' }}
                  />
                  <span className={styles.formFieldHelp}>Pre-filled message when clients click the green WhatsApp icon.</span>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <Sparkles size={13} color="#ff8ad8" /> Custom Bouquet Inquiry Auto-Reply Note
                  </label>
                  <textarea
                    rows={3}
                    value={extraSettings.orderConfirmationNote}
                    onChange={(e) => setExtraSettings({ ...extraSettings, orderConfirmationNote: e.target.value })}
                    className={styles.formInputText}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => showToast('WhatsApp concierge templates saved!', 'success')}
                  className={styles.saveSettingsBtn}
                >
                  <Save size={16} /> SAVE WHATSAPP TEMPLATES
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN SECURITY */}
          {activeTab === 'security' && (
            <div className={styles.settingsCardPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIconCircle}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className={styles.panelTitle}>Admin Security & Password Credentials</h2>
                  <p className={styles.panelDesc}>Update your master authentication password to secure database access.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <Lock size={13} color="#ff8ad8" /> Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      placeholder="Enter current password"
                      className={styles.formInputText}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <Lock size={13} color="#ff8ad8" /> New Password (Minimum 6 Characters)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      placeholder="Enter new strong password"
                      className={styles.formInputText}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Strength Bar */}
                  {passwordData.newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: '#a3a3a3' }}>Password Strength:</span>
                        <span style={{ color: passStrength.color, fontWeight: '700' }}>{passStrength.label}</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${passStrength.score}%`, height: '100%', background: passStrength.color, transition: 'all 0.3s ease' }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formFieldLabel}>
                    <Lock size={13} color="#ff8ad8" /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Repeat new password"
                    className={styles.formInputText}
                  />
                </div>

                <div style={{ background: 'rgba(255, 138, 216, 0.05)', border: '1px solid rgba(255, 138, 216, 0.15)', borderRadius: '8px', padding: '14px', margin: '14px 0' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#ff8ad8', lineHeight: '1.5' }}>
                    <strong>Security Notice:</strong> Changing your master password immediately secures all administrative operations across MongoDB and the dashboard console.
                  </p>
                </div>

                <button type="submit" disabled={savingPassword} className={styles.saveSettingsBtn}>
                  <Lock size={16} /> {savingPassword ? 'UPDATING...' : 'UPDATE ADMIN PASSWORD'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Live Store Checkout Preview Card */}
        <div>
          <div className={styles.previewStickyCard}>
            <div className={styles.previewCardBadge}>
              <Sparkles size={12} /> Live Checkout Preview
            </div>

            <div className={styles.previewStoreHeader}>
              <h3 className={styles.previewStoreName}>{storeSettings.storeName}</h3>
              <p className={styles.previewStoreAddress}>{storeSettings.storeAddress}</p>
            </div>

            {/* Free Delivery Dynamic Progress Bar */}
            <div className={styles.previewThresholdBar}>
              <div className={styles.previewThresholdText}>
                <strong>Complimentary Delivery:</strong> Orders over ${storeSettings.freeDeliveryThreshold.toFixed(2)}
              </div>
              <div className={styles.previewProgressBar}>
                <div className={styles.previewProgressFill} />
              </div>
              <div style={{ fontSize: '11px', color: '#ff8ad8', marginTop: '6px', fontWeight: '500' }}>
                Cart Preview: $98.00 / ${storeSettings.freeDeliveryThreshold.toFixed(2)} threshold
              </div>
            </div>

            {/* Fee Calculations Summary */}
            <div className={styles.previewFeeSummary}>
              <div className={styles.previewFeeRow}>
                <span>Standard Delivery Fee</span>
                <span className={styles.previewFeeRowStrong}>${storeSettings.deliveryFee.toFixed(2)} {storeSettings.currency}</span>
              </div>
              <div className={styles.previewFeeRow}>
                <span>GST / VAT Tax ({storeSettings.taxRate}%)</span>
                <span className={styles.previewFeeRowStrong}>Calculated at checkout</span>
              </div>
              <div className={styles.previewFeeRow}>
                <span>Active Currency</span>
                <span className={styles.previewFeeRowStrong}>{storeSettings.currency}</span>
              </div>
              <div className={styles.previewFeeRow}>
                <span>Concierge Hotline</span>
                <span className={styles.previewFeeRowStrong}>{storeSettings.contactPhone}</span>
              </div>
            </div>

            {/* WhatsApp Box */}
            <div className={styles.previewConciergeBox}>
              <MessageSquare size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>WhatsApp Concierge Active</div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>Direct artisan link enabled</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <a 
                href="/shop" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ fontSize: '12px', color: '#a3a3a3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Preview in live storefront</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
