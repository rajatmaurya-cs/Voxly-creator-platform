'use client';

import React from 'react';
import styles from './Card.module.css';

// SVG Logos as inline components
const NetBankingLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="rgba(255,255,255,0.15)" />
    <rect x="5" y="10" width="22" height="3" rx="1.5" fill="white" opacity="0.9" />
    <rect x="5" y="15" width="6" height="8" rx="1" fill="white" opacity="0.8" />
    <rect x="13" y="15" width="6" height="8" rx="1" fill="white" opacity="0.8" />
    <rect x="21" y="15" width="6" height="8" rx="1" fill="white" opacity="0.8" />
  </svg>
);

const UPILogo = () => (
  <svg width="36" height="20" viewBox="0 0 60 28" fill="none">
    <text x="0" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="18" fill="white" opacity="0.95">UPI</text>
    <rect x="48" y="4" width="3" height="20" rx="1.5" fill="#22C55E" />
    <rect x="54" y="8" width="3" height="16" rx="1.5" fill="#22C55E" />
  </svg>
);

const CreditCardLogo = () => (
  <svg width="32" height="22" viewBox="0 0 48 32" fill="none">
    <rect width="48" height="32" rx="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <rect x="0" y="7" width="48" height="8" fill="rgba(255,255,255,0.25)" />
    <rect x="6" y="20" width="14" height="5" rx="2" fill="rgba(255,255,255,0.6)" />
    <rect x="28" y="20" width="14" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const Card = () => {
  return (
    <div className="app-container overflow-visible">
      <div className={styles.wallet}>
        <div className={styles['wallet-back']} />

        {/* Net Banking Card */}
        <div className={`${styles.card} ${styles.netbanking}`}>
          <div className={styles['card-inner']}>
            <div className={styles['card-top']}>
              <span className={styles['card-label']}>Net Banking</span>
              <div className={styles['card-logo']}><NetBankingLogo /></div>
            </div>
            <div className={styles['card-bottom']}>
              <div className={styles['card-info']}>
                <span className={styles.label}>Holder</span>
                <span className={styles.value}>ALEX SMITH</span>
              </div>
              <div className={styles['card-number-wrapper']}>
                <span className={styles['hidden-stars']}>**** 4242</span>
                <span className={styles['card-number']}>5524 9910 4242</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPI Card */}
        <div className={`${styles.card} ${styles.upi}`}>
          <div className={styles['card-inner']}>
            <div className={styles['card-top']}>
              <span className={styles['card-label']}>UPI</span>
              <div className={styles['card-logo']}><UPILogo /></div>
            </div>
            <div className={styles['card-bottom']}>
              <div className={styles['card-info']}>
                <span className={styles.label}>UPI ID</span>
                <span className={styles.value}>Veyra@upi</span>
              </div>
              <div className={styles['card-number-wrapper']}>
                <span className={styles['hidden-stars']}>**** 8810</span>
                <span className={styles['card-number']}>9012 4432 8810</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Card */}
        <div className={`${styles.card} ${styles.creditcard}`}>
          <div className={styles['card-inner']}>
            <div className={styles['card-top']}>
              <span className={styles['card-label']}>Credit Card</span>
              <div className={styles['card-logo']}><CreditCardLogo /></div>
            </div>
            <div className={styles['card-bottom']}>
              <div className={styles['card-info']}>
                <span className={styles.label}>Card Type</span>
                <span className={styles.value}>VISA PLATINUM</span>
              </div>
              <div className={styles['card-number-wrapper']}>
                <span className={styles['hidden-stars']}>**** 0094</span>
                <span className={styles['card-number']}>3312 0045 0094</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pocket / Wallet Base */}
        <div className={styles.pocket}>
          <svg className={styles['pocket-svg']} viewBox="0 0 280 160" fill="none">
            <path
              d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
              fill="#1a2f3a"
            />
            <path
              d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
              stroke="#2a4a5a"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </svg>
          <div className={styles['pocket-content']}>
            <div className={styles['eye-icon-wrapper']}>
              {/* Eye slash (hidden state) */}
              <svg className={`${styles['eye-icon']} ${styles['eye-slash']}`} width={18} height={18} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
                <line x1={3} y1={3} x2={21} y2={21} />
              </svg>
              {/* Eye open (visible state) */}
              <svg className={`${styles['eye-icon']} ${styles['eye-open']}`} style={{ opacity: 0 }} width={18} height={18} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;