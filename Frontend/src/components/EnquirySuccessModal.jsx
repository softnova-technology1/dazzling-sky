import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Check, Paperclip, ArrowRight } from 'lucide-react';
import styles from './EnquirySuccessModal.module.css';

export default function EnquirySuccessModal({ isOpen, onClose, enquiryData }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const clientName = enquiryData?.firstName 
    ? `${enquiryData.firstName}${enquiryData.lastName ? ' ' + enquiryData.lastName : ''}`
    : 'Valued Guest';

  const sourceTitle = enquiryData?.source === 'homepage' 
    ? 'Atelier Consultation Request' 
    : 'Floral Enquiry Submission';

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Top Close Button */}
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Close thank you popup"
        >
          <X size={18} />
        </button>

        {/* Glowing Animated Icon Centerpiece */}
        <div className={styles.iconWrapper}>
          <div className={styles.pulsingHalo} />
          <div className={styles.iconOuterRing} />
          <div className={styles.iconCore}>
            <Sparkles size={32} />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className={styles.brandLabel}>
          ✦ DAZZLING SKY LUXURY ATELIER ✦
        </div>

        {/* Title */}
        <h2 className={styles.title}>
          Thank You, {enquiryData?.firstName || 'Guest'}!
        </h2>

        {/* Subtitle / Description */}
        <p className={styles.subtitle}>
          Your floral consultation inquiry has been gracefully received. Our master florists are curating inspiration for your vision and will contact you within 24 hours.
        </p>

        {/* Submission Details Card */}
        <div className={styles.detailsReceipt}>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Client:</span>
            <span className={styles.receiptValue}>{clientName}</span>
          </div>
          {enquiryData?.email && (
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Confirmation Email:</span>
              <span className={styles.receiptValue}>{enquiryData.email}</span>
            </div>
          )}
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Request Channel:</span>
            <span className={styles.receiptValue}>{sourceTitle}</span>
          </div>

          {enquiryData?.attachmentName && (
            <div className={styles.attachmentBadge}>
              <Paperclip size={13} />
              <span>Reference File: <strong>{enquiryData.attachmentName}</strong></span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsContainer}>
          <button 
            className={styles.primaryBtn}
            onClick={() => {
              onClose();
              navigate('/shop');
            }}
          >
            <span>Explore Collections</span>
            <ArrowRight size={15} />
          </button>
          <button 
            className={styles.secondaryBtn}
            onClick={onClose}
          >
            Return to Atelier
          </button>
        </div>
      </div>
    </div>
  );
}
