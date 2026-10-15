import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Phone, User, FileText, Image, Paperclip, CheckCircle2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import styles from './CustomizeBokehModal.module.css';

export default function CustomizeBokehModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    details: ''
  });
  const [referenceFile, setReferenceFile] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setIsSuccess(false);
    setError('');
    setFormData({ name: '', whatsapp: '', details: '' });
    setReferenceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim() || !formData.details.trim()) {
      setError('Please fill in your name, WhatsApp number, and customization details.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('whatsapp', formData.whatsapp.trim());
      data.append('details', formData.details.trim());
      if (referenceFile) {
        data.append('referenceImage', referenceFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/customizations`, {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmittedData({
          name: formData.name.trim(),
          whatsapp: formData.whatsapp.trim(),
          fileName: referenceFile ? referenceFile.name : null
        });
        setIsSuccess(true);
      } else {
        setError(json.message || 'Failed to submit customization request.');
      }
    } catch (err) {
      console.error('Error submitting custom bouquet:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleModalClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className={styles.closeBtn} 
          onClick={handleModalClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.badge}>
                <Sparkles size={13} />
                <span>BESPOKE BOUQUET ATELIER</span>
              </div>
              <h2 className={styles.title}>
                Customize Your Bouquet
              </h2>
              <p className={styles.subtitle}>
                Let's create something unique & unforgettable ✦
              </p>
            </div>

            {error && (
              <div className={styles.errorBanner} style={{ marginBottom: '16px' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Full Name *
                </label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Tan"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* WhatsApp No */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  WhatsApp Number *
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +65 9123 4567"
                    className={styles.input}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Customization Details */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Customization Details *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Specify desired flower varieties, color theme (e.g. lavender & blush pink), wrapping style, occasion, or delivery date..."
                  className={styles.textarea}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Reference Image Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Upload Reference Image <span style={{ opacity: 0.6, fontSize: '11px' }}>(Optional)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setReferenceFile(e.target.files[0] || null)}
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  id="bokehFileInput"
                  disabled={loading}
                />

                {!referenceFile ? (
                  <label htmlFor="bokehFileInput" className={styles.uploadDottedBox}>
                    <Image size={24} color="#c084fc" />
                    <span style={{ fontSize: '13px', color: '#ff8ad8', fontWeight: '600' }}>
                      Click to upload inspiration image
                    </span>
                    <span style={{ fontSize: '11px', color: '#d8b4fe', opacity: 0.85 }}>
                      PNG, JPG, WEBP or PDF (Max 15MB)
                    </span>
                  </label>
                ) : (
                  <div className={styles.filePreviewPill}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <Paperclip size={14} color="#ff8ad8" />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {referenceFile.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#d8b4fe' }}>
                        ({(referenceFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReferenceFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className={styles.removeFileBtn}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <Sparkles size={16} />
                <span>
                  {loading 
                    ? 'Submitting Request...' 
                    : 'Submit Request'}
                </span>
              </button>
            </form>
          </>
        ) : (
          /* Thank You Success Screen */
          <div className={styles.successView}>
            <div className={styles.successIconCore}>
              <CheckCircle2 size={38} />
            </div>

            <div className={styles.badge} style={{ color: '#ff8ad8', borderColor: 'rgba(255, 138, 216, 0.4)' }}>
              ✦ REQUEST RECEIVED ✦
            </div>

            <h3 className={styles.successTitle}>
              Thank You, {submittedData?.name || 'Valued Guest'}!
            </h3>

            <p className={styles.successSubtitle}>
              Our master florists have received your bespoke bouquet inquiry. We will contact your WhatsApp at 
              <strong style={{ color: '#25D366', fontWeight: '700' }}> {submittedData?.whatsapp}</strong> shortly with a personalized design proposal and quotation.
            </p>

            <div className={styles.successCard}>
              <div className={styles.successCardRow}>
                <span style={{ color: '#a3a3a3' }}>Client Name:</span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>{submittedData?.name}</span>
              </div>
              <div className={styles.successCardRow}>
                <span style={{ color: '#a3a3a3' }}>WhatsApp:</span>
                <span style={{ color: '#25D366', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366', display: 'inline-block', boxShadow: '0 0 6px #25D366' }}></span>
                  {submittedData?.whatsapp}
                </span>
              </div>
              {submittedData?.fileName && (
                <div className={styles.successCardRow}>
                  <span style={{ color: '#a3a3a3' }}>Reference File:</span>
                  <span style={{ color: '#d8b4fe' }}>📎 {submittedData?.fileName}</span>
                </div>
              )}
            </div>

            <button 
              className={styles.continueBtn}
              onClick={handleModalClose}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
